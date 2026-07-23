import Link from 'next/link';
import { getAllCategories } from '@/lib/db';

export default function Footer() {
  const categories = getAllCategories();

  return (
    <footer className="bg-[#f3f3f3] mt-10 border-t">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-10">
        
        {/* Brand Logo Header */}
        <div className="text-center mb-6">
          <Link href="/">
            <h2 className="text-red-700 text-3xl md:text-4xl font-bold logo-font">Business Standard</h2>
          </Link>
          <p className="text-gray-600 text-xl mt-1 font-serif">
            Information that matters
          </p>
        </div>

        {/* Links Grid */}
        <div className="space-y-6 text-sm text-black">
          <div>
            <h3 className="font-semibold text-xs mb-2 border-b border-gray-300 pb-1 uppercase tracking-wider">
              MAIN SECTIONS
            </h3>
            <div className="flex flex-wrap leading-7">
              {categories.map((cat, idx) => (
                <span key={cat.slug} className="inline-flex items-center">
                  <Link href={`/category/${cat.slug}`} className="mr-2 hover:text-red-600">
                    {cat.name} News
                  </Link>
                  {idx < categories.length - 1 && <span className="mr-2">|</span>}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-xs mb-2 border-b border-gray-300 pb-1 uppercase tracking-wider">
              QUICK LINKS
            </h3>
            <div className="leading-7">
              <Link href="/" className="hover:text-red-600">Latest News</Link> |{' '}
              <Link href="/about" className="hover:text-red-600">About Us</Link> |{' '}
              <Link href="/our-team" className="hover:text-red-600">Our Team</Link> |{' '}
              <Link href="/privacy-policy" className="hover:text-red-600">Privacy Policy</Link> |{' '}
              <Link href="/terms-and-conditions" className="hover:text-red-600">Terms & Conditions</Link> |{' '}
              <Link href="/search" className="hover:text-red-600">Search</Link> |{' '}
              <a href="/sitemap.xml" className="hover:text-red-600" target="_blank">Sitemap</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left mt-6 gap-4 border-t pt-4">
          <p className="text-xs text-black">
            Copyright © {new Date().getFullYear()} Business Standard Private Ltd. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" aria-label="Facebook">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" className="w-6 h-6" alt="Facebook" />
            </a>
            <a href="#" aria-label="Twitter">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" className="w-6 h-6" alt="Twitter" />
            </a>
            <a href="#" aria-label="Instagram">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" className="w-6 h-6" alt="Instagram" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" className="w-6 h-6" alt="LinkedIn" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
