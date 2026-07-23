import Link from 'next/link';
import { getAllAuthors } from '@/lib/db';

export const metadata = {
  title: 'Our Editorial Team | Business Standard',
  description: 'Meet the journalists, editors, and correspondents behind Business Standard.',
};

export default function OurTeamPage() {
  const authors = getAllAuthors();

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-12">
      <div className="border-b-4 border-red-700 pb-4 mb-8 text-center md:text-left">
        <h1 className="text-4xl font-bold font-serif text-red-700 uppercase">
          Our Editorial Team
        </h1>
        <p className="text-gray-600 font-serif text-base mt-2">
          Meet the dedicated investigative journalists, financial analysts, and regional correspondents powering Business Standard.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {authors.map((author) => (
          <div key={author.slug} className="bg-white border rounded-xl p-6 text-center shadow-sm hover:shadow-md transition">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-red-700 mx-auto mb-4"
            />
            <Link href={`/author/${author.slug}`}>
              <h3 className="font-serif font-bold text-lg text-gray-900 hover:text-red-700">{author.name}</h3>
            </Link>
            <p className="text-red-700 text-xs font-bold uppercase tracking-wider mt-1 mb-3">
              {author.role}
            </p>
            <p className="text-xs text-gray-500 font-serif">
              {author.count} Published Articles
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
