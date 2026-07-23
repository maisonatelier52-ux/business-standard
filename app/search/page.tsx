import Link from 'next/link';
import { searchArticles } from '@/lib/db';

interface PageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export async function generateMetadata({ searchParams }: PageProps) {
  const { q } = await searchParams;
  return {
    title: q ? `Search results for "${q}" | Business Standard` : 'Search News | Business Standard',
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q || '';
  const results = searchArticles(query);

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="border-b-2 border-red-700 pb-4 mb-8">
        <h1 className="text-3xl font-bold font-serif text-gray-900">
          {query ? `Search Results for "${query}"` : 'Search Business Standard'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Found {results.length} matching articles
        </p>
      </div>

      {results.length === 0 ? (
        <div className="bg-gray-50 p-12 text-center rounded-lg border">
          <h3 className="text-xl font-bold font-serif text-gray-800">No articles found matching "{query}"</h3>
          <p className="text-sm text-gray-600 mt-2">
            Try searching for terms like "Economy", "Politics", "Technology", "Health", "Markets", or author names.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {results.map((item) => (
            <div key={item.slug} className="flex flex-col sm:flex-row gap-6 border-b pb-6 last:border-b-0">
              {item.image && (
                <Link href={`/${item.categorySlug}/${item.slug}`} className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full sm:w-[240px] h-[150px] object-cover rounded-md shadow-sm"
                  />
                </Link>
              )}
              <div className="flex-1 space-y-2">
                <span className="text-[10px] font-bold text-red-700 uppercase tracking-widest">
                  {item.breadcrumbCategory || item.category}
                </span>
                <Link href={`/${item.categorySlug}/${item.slug}`}>
                  <h2 className="text-xl font-bold font-serif hover:text-red-700 leading-snug">
                    {item.title}
                  </h2>
                </Link>
                <p className="text-sm text-gray-600 font-serif leading-relaxed line-clamp-2">
                  {item.deck || item.standfirst}
                </p>
                <div className="text-xs text-gray-400 pt-1">
                  BY <span className="font-semibold text-gray-700">{item.author}</span> • {item.time || 'Recently'} • {item.readTime || '2 min read'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
