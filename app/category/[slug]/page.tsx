import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryBySlug, getArticlesByCategory } from '@/lib/db';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const SITE_URL = 'https://www.financial-journal.xyz';
const SITE_NAME = 'Financial Journal';

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};

  const title = `${category.name} News`;
  const description = `Latest news, analysis and reports in ${category.name}.`;
  const url = `${SITE_URL}/category/${category.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const articles = getArticlesByCategory(category.slug);
  const heroArticle = articles[0];
  const listArticles = articles.slice(1);

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6">
      <div className="mt-6">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-3">
          <Link href="/" className="text-red-600 hover:underline">
            Home
          </Link>{' '}
          / {category.name}
        </div>

        {/* Category Header — page's single H1 (fixes previous H2 start / missing H1) */}
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <h1 className="text-2xl font-bold">
            {category.name} News
          </h1>
          <span className="text-sm text-gray-600 cursor-pointer">
            more →
          </span>
        </div>

        {/* Top Grid: Hero Featured Box + Ad */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {heroArticle && (
            <div className="md:col-span-2 bg-[#e9d6c7] p-4 rounded-md flex flex-col md:flex-row gap-4">
              <div className="md:w-1/2">
                <Link href={`/${heroArticle.categorySlug}/${heroArticle.slug}`}>
                  <h2 className="text-xl font-bold leading-snug mb-2 hover:text-red-700 transition">
                    {heroArticle.title}
                  </h2>
                </Link>
                <p className="text-xs text-gray-700 italic">
                  {heroArticle.readTime || '3 min read'}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  By{' '}
                  <Link href={`/author/${heroArticle.authorSlug}`} className="hover:text-red-600">
                    {heroArticle.author}
                  </Link>
                </p>
              </div>
              <div className="md:w-1/2">
                <Link href={`/${heroArticle.categorySlug}/${heroArticle.slug}`}>
                  <img
                    src={heroArticle.image || '/images/img.webp'}
                    className="w-full h-48 object-cover rounded"
                    alt={heroArticle.title}
                  />
                </Link>
              </div>
            </div>
          )}

          <div className="hidden md:block">
            <p className="text-sm text-gray-500 mb-2">Advertisement</p>
            <img
              src="/images/ad.webp"
              className="w-full h-[250px] object-cover rounded"
              alt="Advertisement"
            />
          </div>
        </div>

        {/* Bottom Grid: 3-column articles list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {listArticles.map((item) => (
            <Link
              key={item.slug}
              href={`/${item.categorySlug}/${item.slug}`}
              className="flex gap-3 border-b pb-4 hover:text-red-700 transition"
            >
              <div className="flex-1">
                <h3 className="font-semibold leading-snug">{item.title}</h3>
                <p className="text-xs text-gray-600 mt-1">
                  {item.readTime || '2 min read'}
                </p>
                <p className="text-xs text-gray-500">
                  By {item.author}
                </p>
              </div>
              {item.image && (
                <img
                  src={item.image}
                  className="w-20 h-16 object-cover rounded flex-shrink-0"
                  alt={item.title}
                />
              )}
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
