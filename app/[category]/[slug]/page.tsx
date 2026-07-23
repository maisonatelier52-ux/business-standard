import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug, getArticlesByCategory, getAllArticles, incrementArticleView, getComments } from '@/lib/db';
import ArticleComments from './ArticleComments';

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: `${article.metaTitle || article.title} | Business Standard`,
    description: article.metaDescription || article.deck,
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Increment view count
  incrementArticleView(article.slug);

  const relatedArticles = getArticlesByCategory(article.categorySlug)
    .filter(a => a.slug !== article.slug)
    .slice(0, 4);

  const allArticles = getAllArticles();
  const latestSidebar = allArticles
    .filter(a => a.slug !== article.slug)
    .slice(0, 5);

  const mostReadSidebar = allArticles
    .filter(a => a.slug !== article.slug)
    .slice(5, 9);

  const initialComments = getComments(article.slug);

  const shareUrl = encodeURIComponent(`https://my-api-usa.com/ramshad/Business-Standard/${article.categorySlug}/${article.slug}`);
  const shareTitle = encodeURIComponent(article.title);

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6">
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Article Content */}
          <div className="md:col-span-2">
            
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-2">
              <Link href="/" className="text-red-600 hover:underline">
                Home
              </Link>{' '}
              /{' '}
              <Link href={`/category/${article.categorySlug}`} className="hover:text-red-600">
                {article.breadcrumbCategory || article.category}
              </Link>{' '}
              /{' '}
              <span className="text-black">
                {article.title.slice(0, 40)}...
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3 logo-font">
              {article.title}
            </h1>

            {/* Deck / Lead */}
            {article.deck && (
              <div className="bg-[#f5e9df] text-gray-700 italic px-3 py-2 text-sm mb-4">
                {article.deck}
              </div>
            )}

            {/* Main Image */}
            {article.image && (
              <div className="relative mb-3">
                <img
                  src={article.image}
                  className="w-full rounded-md"
                  alt={article.caption || article.title}
                />
              </div>
            )}

            {/* Caption */}
            {article.caption && (
              <p className="text-sm text-gray-600 mb-4">{article.caption}</p>
            )}

            {/* Meta Bar & Social Share */}
            <div className="border-b pb-3 mb-4 flex items-start justify-between gap-4">
              <div className="text-sm text-gray-700">
                <Link
                  href={`/author/${article.authorSlug}`}
                  className="font-semibold text-black hover:text-red-700"
                >
                  {article.author}
                </Link>
                {article.authorRole && <span> | {article.authorRole}</span>}
                <br />
                <span className="text-xs text-gray-500">
                  {article.readTime || '3 min read'} | Last updated: {article.time || 'Apr 29 2026 | 10:00 PM IST'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Share:</span>
                <a
                  href={`https://twitter.com/share?url=${shareUrl}&text=${shareTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
                    className="w-6 h-6 border rounded-md p-1 cursor-pointer hover:bg-gray-100"
                    alt="Twitter"
                  />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                    className="w-6 h-6 border rounded-md p-1 cursor-pointer hover:bg-gray-100"
                    alt="Facebook"
                  />
                </a>
                <a
                  href={`https://wa.me/?text=${shareTitle}+${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/733/733561.png"
                    className="w-6 h-6 border rounded-md p-1 cursor-pointer hover:bg-gray-100"
                    alt="WhatsApp"
                  />
                </a>
              </div>
            </div>

            {/* Article Content Paragraphs */}
            <div className="article-content text-[15px] leading-7 space-y-4 text-gray-800">
              {Array.isArray(article.body) ? (
                article.body.map((paragraph, idx) => (
                  <div key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />
                ))
              ) : (
                <p>{article.deck || article.standfirst}</p>
              )}
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-bold mb-4">Related Stories</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {relatedArticles.map((rel) => (
                    <Link
                      key={rel.slug}
                      href={`/${rel.categorySlug}/${rel.slug}`}
                      className="flex gap-3 border rounded p-3 hover:bg-gray-50 transition"
                    >
                      {rel.image && (
                        <img
                          src={rel.image}
                          className="w-20 h-16 object-cover rounded flex-shrink-0"
                          alt={rel.title}
                        />
                      )}
                      <div>
                        <p className="font-semibold text-sm leading-snug hover:text-red-700">
                          {rel.title}
                        </p>
                        <span className="text-xs text-gray-500">
                          {rel.readTime || '2 min read'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Subscription Promo Cards */}
            <div className="mt-10 border-t pt-8">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 logo-font">
                Here is what our digital subscription plans include
              </h2>

              <div className="bg-[#efe2d6] rounded-md p-6 md:flex items-center justify-between mb-6">
                <div className="md:w-1/2">
                  <h3 className="text-xl md:text-2xl font-bold mb-3 logo-font">
                    Exclusive online premium stories
                  </h3>
                  <p className="text-sm flex items-start gap-2">
                    <svg className="w-4 h-4 text-red-700 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Over 30 daily premium stories curated by our editors
                  </p>
                </div>
                <div className="md:w-1/2 mt-4 md:mt-0 flex justify-center">
                  <img src="/images/img.webp" className="w-[250px] md:w-[300px]" alt="Premium Stories" />
                </div>
              </div>

              <div className="bg-[#f3f3f3] rounded-md p-6 md:flex items-center justify-between mb-6">
                <div className="md:w-1/2 mb-4 md:mb-0 flex justify-center">
                  <img src="/images/img2.webp" className="w-[220px] md:w-[260px]" alt="Access" />
                </div>
                <div className="md:w-1/2">
                  <h3 className="text-xl md:text-2xl font-bold mb-3 logo-font">
                    Free access to The New York Times
                  </h3>
                  <p className="text-sm flex items-start gap-2">
                    <svg className="w-4 h-4 text-red-700 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    News, Games, Cooking, Audio, Wirecutter and The Athletic
                  </p>
                </div>
              </div>

              <div className="bg-[#efe2d6] rounded-md p-6 md:flex items-center justify-between">
                <div className="md:w-1/2">
                  <h3 className="text-xl md:text-2xl font-bold mb-3 logo-font">
                    Business Standard Digital Newspaper
                  </h3>
                  <p className="text-sm flex items-start gap-2">
                    <svg className="w-4 h-4 text-red-700 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Digital replica of our daily newspaper — with options to read, save and share
                  </p>
                </div>
                <div className="md:w-1/2 mt-4 md:mt-0 flex justify-center">
                  <img src="/images/img3.webp" className="w-[220px] md:w-[260px]" alt="Digital Newspaper" />
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <ArticleComments articleSlug={article.slug} initialComments={initialComments} />

          </div>

          {/* Sidebar Right Column */}
          <div className="hidden md:block">
            <div className="sticky top-6 border p-4">
              
              <h3 className="font-bold mb-3">Latest News</h3>
              {latestSidebar.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.categorySlug}/${item.slug}`}
                  className="flex gap-3 border-b pb-3 mb-3 hover:text-red-700 transition"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.readTime || '3 min read'}</p>
                  </div>
                  {item.image && (
                    <img
                      src={item.image}
                      className="w-16 h-12 object-cover rounded flex-shrink-0"
                      alt={item.title}
                    />
                  )}
                </Link>
              ))}

              <div className="mt-4 border-t pt-4">
                <h3 className="font-bold mb-3">Most Read</h3>
                {mostReadSidebar.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/${item.categorySlug}/${item.slug}`}
                    className="block border-b pb-2 mb-2 text-sm font-semibold hover:text-red-700 transition"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
