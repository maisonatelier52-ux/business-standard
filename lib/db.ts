import fs from 'fs';
import path from 'path';

export interface Article {
  _id: { $oid: string } | string;
  slug: string;
  title: string;
  deck?: string;
  image?: string;
  tag?: string;
  tagColor?: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  time?: string;
  readTime?: string;
  comments?: number;
  category: string;
  breadcrumbCategory?: string;
  tagLabel?: string;
  headline?: string;
  standfirst?: string;
  caption?: string;
  body?: string[];
  tags?: string[];
  related?: string[];
  status?: string;
  views?: number;
  isBreaking?: boolean;
  isFeatured?: boolean;
  publishedDate?: string;
  metaTitle?: string;
  metaDescription?: string;
  targetKeyword?: string;
  canonicalUrl?: string;
  isOpinion?: boolean;
  categorySlug: string;
  // Computed fields
  id?: string;
  authorSlug: string;
}

export interface Category {
  slug: string;
  name: string;
  count: number;
}

export interface Author {
  slug: string;
  name: string;
  role: string;
  avatar: string;
  count: number;
}

export interface CommentItem {
  id: string;
  articleSlug: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const ARTICLES_PATH = path.join(DATA_DIR, 'articles.json');
const COMMENTS_PATH = path.join(DATA_DIR, 'comments.json');
const SUBSCRIBERS_PATH = path.join(DATA_DIR, 'subscribers.json');
const VIEWS_PATH = path.join(DATA_DIR, 'views.json');

const CATEGORY_MAP: Record<string, string> = {
  politics: 'politics',
  politica: 'politics',
  economy: 'economy',
  economia: 'economy',
  technology: 'technology',
  tecnologia: 'technology',
  environment: 'environment',
  'medio-ambiente': 'environment',
  health: 'health',
  salud: 'health',
  culture: 'culture',
  cultura: 'culture',
  sports: 'sports',
  deportes: 'sports',
  society: 'migration',
  migracion: 'migration',
  migration: 'migration',
  tourism: 'tourism',
  turismo: 'tourism',
  world: 'security',
  seguridad: 'security',
  security: 'security',
};

const CATEGORY_NAME_MAP: Record<string, string> = {
  politics: 'Politics',
  economy: 'Economy',
  technology: 'Technology',
  environment: 'Environment',
  health: 'Health',
  culture: 'Culture',
  sports: 'Sports',
  migration: 'Migration',
  tourism: 'Tourism',
  security: 'Security',
};

const ROLE_TRANSLATIONS: Record<string, string> = {
  'Corresponsal Deportivo': 'Sports Correspondent',
  'Editora de Economía': 'Economy Editor',
  'Corresponsal Político': 'Political Correspondent',
  'Editor de Medio Ambiente': 'Environment Editor',
  'Periodista de Turismo': 'Tourism Correspondent',
  'Editora de Salud': 'Health Editor',
  'Editor de Tecnología': 'Technology Editor',
};

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function translateTextToEnglish(text: string): string {
  if (!text) return text;
  return text
    .replace(/min de lectura/g, 'min read')
    .replace(/Última actualización:/g, 'Last updated:')
    .replace(/Actualizado el:/g, 'Updated on:')
    .replace(/Por /g, 'By ');
}

export function getAllArticles(): Article[] {
  try {
    if (!fs.existsSync(ARTICLES_PATH)) return [];
    const fileData = fs.readFileSync(ARTICLES_PATH, 'utf-8');
    const rawArticles: Article[] = JSON.parse(fileData);
    
    const viewCounts = getViewsMap();

    return rawArticles.map(art => {
      const artId = typeof art._id === 'object' && art._id?.$oid ? art._id.$oid : String(art._id || art.slug);
      const rawCat = (art.categorySlug || art.category || 'economy').toLowerCase();
      const normalizedCatSlug = CATEGORY_MAP[rawCat] || rawCat;
      const normalizedCatName = CATEGORY_NAME_MAP[normalizedCatSlug] || art.breadcrumbCategory || art.category || 'General';
      const aSlug = slugify(art.author || 'Editorial');
      const dynamicViews = viewCounts[art.slug] || 0;

      const rawRole = art.authorRole || 'Correspondent';
      const englishRole = ROLE_TRANSLATIONS[rawRole] || rawRole;

      return {
        ...art,
        id: artId,
        categorySlug: normalizedCatSlug,
        breadcrumbCategory: normalizedCatName,
        authorRole: englishRole,
        authorSlug: aSlug,
        readTime: translateTextToEnglish(art.readTime || '2 min read'),
        time: translateTextToEnglish(art.time || 'Recently'),
        views: (art.views || 0) + dynamicViews,
        publishedDate: art.publishedDate || new Date().toISOString()
      };
    }).sort((a, b) => new Date(b.publishedDate!).getTime() - new Date(a.publishedDate!).getTime());
  } catch (error) {
    console.error('Error reading articles:', error);
    return [];
  }
}

export function getArticleBySlug(slug: string): Article | null {
  const articles = getAllArticles();
  return articles.find(a => a.slug === slug) || null;
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  const articles = getAllArticles();
  const normTarget = (CATEGORY_MAP[categorySlug.toLowerCase()] || categorySlug).toLowerCase();
  return articles.filter(a => a.categorySlug.toLowerCase() === normTarget);
}

export function getArticlesByAuthor(authorSlug: string): Article[] {
  const articles = getAllArticles();
  return articles.filter(a => a.authorSlug === authorSlug);
}

export function searchArticles(query: string): Article[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  const articles = getAllArticles();

  return articles.filter(art => {
    const titleMatch = art.title?.toLowerCase().includes(q);
    const deckMatch = art.deck?.toLowerCase().includes(q) || art.standfirst?.toLowerCase().includes(q);
    const bodyMatch = art.body?.some(p => p.toLowerCase().includes(q));
    const tagMatch = art.tags?.some(t => t.toLowerCase().includes(q)) || art.tag?.toLowerCase().includes(q);
    const authorMatch = art.author?.toLowerCase().includes(q);

    return titleMatch || deckMatch || bodyMatch || tagMatch || authorMatch;
  });
}

export function getAllCategories(): Category[] {
  const articles = getAllArticles();
  const catMap: Record<string, { name: string; count: number }> = {};

  articles.forEach(art => {
    const slug = art.categorySlug;
    const name = art.breadcrumbCategory || CATEGORY_NAME_MAP[slug] || slug;
    if (!catMap[slug]) {
      catMap[slug] = { name: name.charAt(0).toUpperCase() + name.slice(1), count: 0 };
    }
    catMap[slug].count += 1;
  });

  return Object.entries(catMap).map(([slug, data]) => ({
    slug,
    name: data.name,
    count: data.count
  })).sort((a, b) => b.count - a.count);
}

export function getCategoryBySlug(slug: string): Category | null {
  const categories = getAllCategories();
  const normTarget = (CATEGORY_MAP[slug.toLowerCase()] || slug).toLowerCase();
  return categories.find(c => c.slug.toLowerCase() === normTarget) || null;
}

export function getAllAuthors(): Author[] {
  const articles = getAllArticles();
  const authorMap: Record<string, Author> = {};

  articles.forEach(art => {
    const slug = art.authorSlug!;
    if (!authorMap[slug]) {
      authorMap[slug] = {
        slug,
        name: art.author,
        role: art.authorRole || 'Correspondent',
        avatar: art.authorAvatar || '/images/author.webp',
        count: 0
      };
    }
    authorMap[slug].count += 1;
  });

  return Object.values(authorMap).sort((a, b) => b.count - a.count);
}

export function getAuthorBySlug(slug: string): Author | null {
  const authors = getAllAuthors();
  return authors.find(a => a.slug === slug) || null;
}

// ── Views Storage ─────────────────────────────────────────────────────────────
function getViewsMap(): Record<string, number> {
  try {
    if (!fs.existsSync(VIEWS_PATH)) return {};
    const content = fs.readFileSync(VIEWS_PATH, 'utf-8');
    return JSON.parse(content || '{}');
  } catch {
    return {};
  }
}

export function incrementArticleView(slug: string): number {
  try {
    const viewsMap = getViewsMap();
    viewsMap[slug] = (viewsMap[slug] || 0) + 1;
    fs.writeFileSync(VIEWS_PATH, JSON.stringify(viewsMap, null, 2), 'utf-8');
    return viewsMap[slug];
  } catch (err) {
    console.error('Failed to increment view count:', err);
    return 0;
  }
}

// ── Comments Storage ──────────────────────────────────────────────────────────
export function getComments(articleSlug: string): CommentItem[] {
  try {
    if (!fs.existsSync(COMMENTS_PATH)) return [];
    const content = fs.readFileSync(COMMENTS_PATH, 'utf-8');
    const allComments: CommentItem[] = JSON.parse(content || '[]');
    return allComments.filter(c => c.articleSlug === articleSlug).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

export function addComment(articleSlug: string, name: string, email: string, content: string): CommentItem {
  let allComments: CommentItem[] = [];
  try {
    if (fs.existsSync(COMMENTS_PATH)) {
      allComments = JSON.parse(fs.readFileSync(COMMENTS_PATH, 'utf-8') || '[]');
    }
  } catch {
    allComments = [];
  }

  const newComment: CommentItem = {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    articleSlug,
    name,
    email,
    content,
    createdAt: new Date().toISOString()
  };

  allComments.unshift(newComment);
  fs.writeFileSync(COMMENTS_PATH, JSON.stringify(allComments, null, 2), 'utf-8');
  return newComment;
}

// ── Subscribers Storage ───────────────────────────────────────────────────────
export function addSubscriber(email: string): boolean {
  try {
    let subscribers: { email: string; createdAt: string }[] = [];
    if (fs.existsSync(SUBSCRIBERS_PATH)) {
      subscribers = JSON.parse(fs.readFileSync(SUBSCRIBERS_PATH, 'utf-8') || '[]');
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!subscribers.some(s => s.email === cleanEmail)) {
      subscribers.push({ email: cleanEmail, createdAt: new Date().toISOString() });
      fs.writeFileSync(SUBSCRIBERS_PATH, JSON.stringify(subscribers, null, 2), 'utf-8');
    }
    return true;
  } catch (err) {
    console.error('Error adding subscriber:', err);
    return false;
  }
}

export function getSubscribers(): { email: string; createdAt: string }[] {
  try {
    if (!fs.existsSync(SUBSCRIBERS_PATH)) return [];
    return JSON.parse(fs.readFileSync(SUBSCRIBERS_PATH, 'utf-8') || '[]');
  } catch {
    return [];
  }
}
