import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAuthorBySlug, getArticlesByAuthor, getAllAuthors, getAllArticles } from '@/lib/db';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return {};

  return {
    title: `${author.name} - Author Profile | Business Standard`,
    description: `Articles and reporting by ${author.name}, ${author.role}.`,
  };
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const articles = getArticlesByAuthor(author.slug);
  const otherAuthors = getAllAuthors().filter(a => a.slug !== author.slug);
  const latestSidebar = getAllArticles().slice(0, 5);

  const lastArticleDate = articles[0]?.publishedDate
    ? new Date(articles[0].publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Apr 29, 2026';

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6">
      <div className="mt-6">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="text-red-600 hover:underline">
            Home
          </Link>{' '}
          / Author / {author.name}
        </div>

        {/* Author Header Banner Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 flex items-center gap-6">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
            />
            <div>
              <h1 className="text-3xl md:text-5xl font-bold logo-font mb-1">{author.name}</h1>
              <p className="text-gray-600 mb-2">{author.role}</p>
              <p className="text-sm text-gray-500 mb-2">Buenos Aires, Argentina</p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Follow:</span>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
                    className="w-6 h-6 border rounded-md p-1 hover:bg-gray-100 cursor-pointer"
                    alt="Twitter"
                  />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                    className="w-6 h-6 border rounded-md p-1 hover:bg-gray-100 cursor-pointer"
                    alt="Facebook"
                  />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
                    className="w-6 h-6 border rounded-md p-1 hover:bg-gray-100 cursor-pointer"
                    alt="LinkedIn"
                  />
                </a>
                <img
                  src="/images/insta.webp"
                  className="w-6 h-6 border rounded-md p-1 hover:bg-gray-100 cursor-pointer"
                  alt="Instagram"
                />
              </div>
            </div>
          </div>

          <div className="hidden md:block text-right">
            <p className="text-sm text-gray-500 mb-2">Advertisement</p>
            <img
              src="/images/ad.webp"
              className="w-full h-[220px] object-cover rounded"
              alt="Advertisement"
            />
          </div>
        </div>

        {/* Bio Box */}
        <div className="mt-4 bg-gray-50 border rounded p-4 text-sm text-gray-700 leading-relaxed">
          Specialist in business, finance, and economic reporting for Business Standard across international markets.
        </div>

        {/* Stats */}
        <div className="mt-4 flex gap-6 text-sm text-gray-600">
          <span>
            <strong className="text-black">{articles.length}</strong> Articles
          </span>
          <span>
            Latest publication: <strong className="text-black">{lastArticleDate}</strong>
          </span>
        </div>

        {/* Category Pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/author/${author.slug}`}
            className="px-3 py-1 text-sm rounded-full border bg-red-600 text-white border-red-600"
          >
            All
          </Link>
        </div>

        <div className="mt-8 border-t-4 pt-2"></div>

        {/* Articles List & Sidebar Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Articles Left Column */}
          <div className="md:col-span-2">
            <div className="border-b pb-2 mb-6">
              <h2 className="text-xl font-bold">{author.name}</h2>
              <div className="w-20 h-[2px] bg-red-600 mt-1"></div>
            </div>

            {articles.map((item) => (
              <div key={item.slug} className="flex gap-6 pb-6 border-b mb-6">
                <div className="flex-1">
                  <Link href={`/${item.categorySlug}/${item.slug}`}>
                    <h3 className="text-2xl font-bold leading-snug mb-2 hover:text-red-700 transition">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-gray-700 mb-2 font-serif text-sm">
                    {item.deck || item.standfirst}
                  </p>
                  <p className="text-sm text-gray-500">
                    Updated on: {item.time || '29 Apr 2026 | 10:00 PM IST'}
                    <span className="ml-2 text-red-600">
                      <Link href={`/category/${item.categorySlug}`}>
                        {item.breadcrumbCategory || item.category}
                      </Link>
                    </span>
                  </p>
                </div>
                {item.image && (
                  <Link href={`/${item.categorySlug}/${item.slug}`} className="flex-shrink-0">
                    <img
                      src={item.image}
                      className="w-48 h-28 object-cover rounded"
                      alt={item.title}
                    />
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <div>
            <div className="border p-4 mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold">Latest News</h3>
                <span className="text-sm text-gray-600">more →</span>
              </div>
              {latestSidebar.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.categorySlug}/${item.slug}`}
                  className="flex gap-3 border-b pb-3 mb-3 last:border-b-0 last:mb-0 hover:text-red-700 transition"
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
            </div>

            <div className="border p-4">
              <h3 className="font-bold mb-3">Other Contributors</h3>
              {otherAuthors.map((auth) => (
                <Link
                  key={auth.slug}
                  href={`/author/${auth.slug}`}
                  className="flex items-center gap-3 border-b pb-3 mb-3 last:border-b-0 last:mb-0 hover:text-red-700 transition"
                >
                  <img
                    src={auth.avatar}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    alt={auth.name}
                  />
                  <div>
                    <p className="font-semibold text-sm">{auth.name}</p>
                    <p className="text-xs text-gray-500">{auth.role}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
