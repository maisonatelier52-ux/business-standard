'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import SubscribeModal from './SubscribeModal';

interface HeaderProps {
  categories?: { slug: string; name: string }[];
  currentLang?: string;
}

export default function Header({ categories = [], currentLang = 'en' }: HeaderProps) {
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<{ username: string; email: string; isSubscribed: boolean } | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.refresh();
  };

  const defaultCategories = [
    { slug: 'culture', name: 'CULTURE' },
    { slug: 'sports', name: 'SPORTS' },
    { slug: 'economy', name: 'ECONOMY' },
    { slug: 'environment', name: 'ENVIRONMENT' },
    { slug: 'migration', name: 'MIGRATION' },
    { slug: 'politics', name: 'POLITICS' },
    { slug: 'health', name: 'HEALTH' },
    { slug: 'security', name: 'SECURITY' },
    { slug: 'technology', name: 'TECHNOLOGY' },
    { slug: 'tourism', name: 'TOURISM' },
  ];

  const catList = categories.length > 0 ? categories.map(c => ({ slug: c.slug, name: c.name.toUpperCase() })) : defaultCategories;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const currentTimeStr = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <>
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        {/* Top Date & User Auth Bar */}
        <div className="flex justify-between items-center text-sm py-3 border-b border-gray-100">
          <span className="font-medium text-gray-800 capitalize">
            {currentDateStr} | {currentTimeStr}
          </span>
          <div className="flex items-center gap-4 text-xs font-semibold">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-700">
                  Hi, <strong className="text-red-700">{user.username}</strong>
                </span>
                {user.isSubscribed && (
                  <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                    Subscriber
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-gray-700 hover:text-red-700 transition">
                  Login
                </Link>
                <span className="text-gray-300">|</span>
                <Link href="/signup" className="text-red-700 font-bold hover:underline">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Main Logo & Header Controls */}
        <header className="relative">
          <div className="relative flex items-center justify-between py-6">
            {/* Menu Hamburger Icon */}
            <div
              id="menuBtn"
              className="flex flex-col gap-1 cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="w-6 h-[2px] bg-black"></span>
              <span className="w-6 h-[2px] bg-black"></span>
              <span className="w-6 h-[2px] bg-black"></span>
            </div>

            {/* Centered Logo */}
            <Link href="/" title="Business Standard - The Leading Business Journal">
              <h1 className="absolute left-1/2 -translate-x-1/2 top-2 md:top-1 text-red-700 text-2xl md:text-5xl logo-font font-bold whitespace-nowrap">
                Business Standard
              </h1>
            </Link>

            {/* Right Search Toggle Button */}
            <div className="flex items-center gap-5">
              <button
                id="searchToggleBtn"
                aria-label="Search"
                className="focus:outline-none"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                {!isSearchOpen ? (
                  <svg className="w-5 h-5 md:w-6 md:h-6 stroke-gray-700" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.3-4.3" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 md:w-6 md:h-6 stroke-gray-700" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="border-t border-gray-300"></div>

          {/* Collapsible Search Bar */}
          {isSearchOpen && (
            <div className="py-3 px-1 border-b border-gray-200">
              <form onSubmit={handleSearchSubmit} className="flex gap-2 items-center">
                <input
                  type="text"
                  name="q"
                  placeholder="Search in Business Standard..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-200"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-red-700 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-red-800 transition whitespace-nowrap"
                >
                  Search
                </button>
              </form>
            </div>
          )}

          {/* Categories Nav Bar */}
          <div className="flex items-center justify-between py-3">
            <nav className="hidden md:flex items-center gap-4 text-[12px] font-semibold text-gray-800 overflow-x-auto">
              <Link
                href="/"
                className={pathname === '/' ? 'text-red-600 font-bold' : 'hover:text-red-600'}
              >
                HOME
              </Link>
              {catList.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className={pathname === `/category/${cat.slug}` ? 'text-red-600 font-bold' : 'hover:text-red-600'}
                >
                  {cat.name}
                </Link>
              ))}
            </nav>

            <button
              onClick={() => setIsSubscribeOpen(true)}
              className="border border-red-600 text-red-600 px-4 py-1 rounded-md font-semibold text-sm hover:bg-red-600 hover:text-white transition-colors duration-200 ml-auto md:ml-0"
            >
              Subscribe
            </button>
          </div>

          {/* Hamburger Menu Dropdown */}
          {isMenuOpen && (
            <div className="absolute left-0 top-full w-full bg-white border-t shadow-md z-50 py-6 px-4 border-b">
              <nav className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-semibold text-gray-800">
                <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-red-600">
                  HOME
                </Link>
                {catList.map((cat) => (
                  <Link key={cat.slug} href={`/category/${cat.slug}`} onClick={() => setIsMenuOpen(false)}>
                    {cat.name}
                  </Link>
                ))}
                <Link href="/about" onClick={() => setIsMenuOpen(false)}>ABOUT US</Link>
                <Link href="/our-team" onClick={() => setIsMenuOpen(false)}>OUR TEAM</Link>
                <Link href="/privacy-policy" onClick={() => setIsMenuOpen(false)}>PRIVACY POLICY</Link>
                <Link href="/terms-and-conditions" onClick={() => setIsMenuOpen(false)}>TERMS & CONDITIONS</Link>
              </nav>
            </div>
          )}

          <div className="border-t my-0"></div>
        </header>
      </div>

      {/* Subscribe Modal */}
      <SubscribeModal isOpen={isSubscribeOpen} onClose={() => setIsSubscribeOpen(false)} />
    </>
  );
}
