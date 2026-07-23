import Link from 'next/link';
import { getAllArticles, getAllCategories, getAllAuthors } from '@/lib/db';
import PollBox from '@/components/PollBox';

export const revalidate = 60;

export default function HomePage() {
  const articles = getAllArticles();
  const categories = getAllCategories();
  const authors = getAllAuthors();

  if (!articles || articles.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-bold">No articles found.</h2>
      </div>
    );
  }

  // Track used articles for maximum section diversity
  const usedSlugs = new Set<string>();

  // Helper to pick N unused articles (with fallback to any article if exhausted)
  const getUnused = (count: number, categoryFilter?: string) => {
    let list = articles.filter(a => !usedSlugs.has(a.slug));
    if (categoryFilter) {
      const catList = list.filter(a => a.categorySlug === categoryFilter);
      if (catList.length > 0) list = catList;
    }
    const result = list.slice(0, count);
    result.forEach(a => usedSlugs.add(a.slug));

    // If we couldn't get enough unused, fill from overall pool
    if (result.length < count) {
      const pool = articles.filter(a => !result.some(r => r.slug === a.slug));
      const fillers = pool.slice(0, count - result.length);
      result.push(...fillers);
    }
    return result;
  };

  // ── Section 1: Economy Hero ──
  const econPool = articles.filter(a => a.categorySlug === 'economy');
  const econHero = econPool[0] || articles[0];
  if (econHero) usedSlugs.add(econHero.slug);
  const econSubItems = getUnused(3, 'economy');

  // ── Section 2: Top News ──
  const mainNewsList = getUnused(6);
  const mainNewsHero = mainNewsList[0];
  const mainNewsMiddle = mainNewsList.slice(1, 5);
  const mainNewsRight = mainNewsList[5];

  // ── Section 3: Special Coverage (4 categories) ──
  const specialCatSlugs = ['politics', 'sports', 'economy', 'tourism'];

  // ── Section 4: Latest News ──
  const ultimasCol1 = getUnused(7);
  const ultimasCol2Main = getUnused(1)[0];
  const ultimasCol2List = getUnused(3);

  // ── Section 5: Highlights ──
  const destacadosList = getUnused(3);

  // ── Section 6: Politics Feature ──
  const polCol1 = getUnused(4, 'politics');
  const polCol2Main = getUnused(1, 'politics')[0];
  const polCol3 = getUnused(3, 'politics');

  // ── Section 7: 3 Columns (Top Stories, Economy, Sports) ──
  const colSec1 = getUnused(4);
  const colSec2 = getUnused(4, 'economy');
  const colSec3 = getUnused(4, 'sports');

  // ── Section 8: Explore News ──
  const exploreCatSlugs = ['tourism', 'technology', 'health', 'environment'];

  // ── Section 9: Popular Now & Authors ──
  const popularesMain = getUnused(1)[0];
  const popularesList = getUnused(3);

  // ── Section 10: Opinion ──
  const opinionArticles = articles.slice(0, 8);

  // ── Section 11: 3-Column Showcase ──
  const showcaseCatSlugs = ['tourism', 'technology', 'health'];

  // ── Section 12: BS Web Reports ──
  const reportesMain = getUnused(1)[0];
  const reportesList1 = getUnused(4);
  const reportesList2 = getUnused(4);

  // ── Section 13: People ──
  const personasArticles = articles.slice(0, 6);

  return (
    <main>
      {/* ── SECTION 1: ECONOMY HERO ── */}
      <section className="border border-gray-300 mt-6">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <div className="mb-4">
                <h2 className="text-2xl md:text-3xl font-bold">
                  <span className="text-red-700">ECONOMY</span>
                </h2>
                <div className="w-16 h-[3px] bg-red-700 mt-2"></div>
              </div>
              {econHero && (
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  <Link href={`/${econHero.categorySlug}/${econHero.slug}`}>
                    <img
                      src={econHero.image || '/images/img.webp'}
                      className="w-full h-[220px] md:h-[250px] object-cover rounded"
                      alt={econHero.title}
                    />
                  </Link>
                  <div>
                    <Link href={`/${econHero.categorySlug}/${econHero.slug}`}>
                      <h3 className="text-xl md:text-3xl font-semibold leading-snug hover:text-red-700 transition">
                        {econHero.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 mt-3 leading-6">
                      {econHero.deck || econHero.standfirst}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full md:w-[260px] shrink-0">
              <p className="text-sm text-gray-600 mb-2 text-right md:text-left">Advertisement</p>
              <img src="/images/ad.webp" className="w-full h-[250px] object-cover border" alt="Advertisement" />
            </div>
          </div>

          <div className="border-t my-6"></div>

          <div className="grid md:grid-cols-3 gap-4 text-sm md:text-base font-semibold">
            {econSubItems.map((item) => (
              <Link
                key={item.slug}
                href={`/${item.categorySlug}/${item.slug}`}
                className="md:border-r pr-4 hover:text-red-700 transition last:border-r-0"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-banner lead line */}
      <p className="text-xs text-gray-400 text-center mt-2 mb-0">
        Business Standard — your leading business journal in markets, economy, companies, and more.
      </p>

      {/* ── SECTION 2: TOP NEWS ── */}
      <section className="mt-8 border-t-4 pt-6">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Top News</h2>
            <div className="w-16 h-[2px] bg-red-600 mt-2"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {mainNewsHero && (
              <div className="md:border-r md:pr-6">
                <Link href={`/${mainNewsHero.categorySlug}/${mainNewsHero.slug}`}>
                  <h3 className="text-lg md:text-2xl font-bold leading-snug mb-3 hover:text-red-700 transition">
                    {mainNewsHero.title}
                  </h3>
                  <img
                    src={mainNewsHero.image || '/images/img1.webp'}
                    className="w-full h-[220px] object-cover rounded"
                    alt={mainNewsHero.title}
                  />
                </Link>
              </div>
            )}

            <div className="space-y-1 md:border-r md:pr-6">
              {mainNewsMiddle.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.categorySlug}/${item.slug}`}
                  className="block pb-1 border-b hover:text-red-700 transition"
                >
                  <p className="font-bold text-sm">{item.title}</p>
                  <span className="text-xs text-gray-500">{item.readTime || '2 min read'}</span>
                </Link>
              ))}
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Advertisement</p>
                <img src="/images/ad.webp" className="w-full h-[220px] object-cover border" alt="Advertisement" />
              </div>
              {mainNewsRight && (
                <div className="border-t pt-4">
                  <Link
                    href={`/${mainNewsRight.categorySlug}/${mainNewsRight.slug}`}
                    className="hover:text-red-700 transition"
                  >
                    <p className="font-bold">{mainNewsRight.title}</p>
                    <span className="text-xs text-gray-500">{mainNewsRight.readTime || '2 min read'}</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: SPECIAL COVERAGE ── */}
      <section className="mt-10 border-t-4 pt-4">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold">Special Coverage</h2>
            <div className="w-20 h-[2px] bg-red-600 mt-2"></div>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {specialCatSlugs.map((catSlug) => {
              const catObj = categories.find(c => c.slug === catSlug) || { slug: catSlug, name: catSlug };
              const catArt = articles.find(a => a.categorySlug === catSlug) || articles[0];

              return (
                <div key={catSlug} className="border border-black">
                  <div className="border-b text-center font-semibold py-2 capitalize">{catObj.name}</div>
                  <Link href={`/${catArt.categorySlug}/${catArt.slug}`}>
                    <img
                      src={catArt.image || '/images/img2.webp'}
                      className="w-full h-[160px] object-cover"
                      alt={catArt.title}
                    />
                  </Link>
                  <div className="p-3 text-sm">
                    <Link href={`/${catArt.categorySlug}/${catArt.slug}`}>
                      <h3 className="font-bold mb-2 hover:text-red-700 transition">{catArt.title}</h3>
                    </Link>
                    <ul className="list-disc pl-4 space-y-1 font-normal text-xs">
                      <li>{(catArt.deck || catArt.standfirst)?.slice(0, 75)}...</li>
                    </ul>
                    <Link
                      href={`/category/${catSlug}`}
                      className="text-right block mt-2 text-gray-600 cursor-pointer hover:text-red-600"
                    >
                      more →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: LATEST NEWS ── */}
      <section className="mt-10 border-t-4 pt-4">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold">Latest News</h2>
              <div className="w-16 h-[2px] bg-red-600 mt-2"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2 border-r md:pr-4">
              {ultimasCol1.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.categorySlug}/${item.slug}`}
                  className="block pb-1 border-b hover:text-red-700 transition"
                >
                  <p className="font-semibold text-sm">{item.title}</p>
                  <span className="text-xs text-gray-500">{item.readTime || '2 min read'}</span>
                </Link>
              ))}
            </div>

            <div className="space-y-4">
              {ultimasCol2Main && (
                <div>
                  <Link href={`/${ultimasCol2Main.categorySlug}/${ultimasCol2Main.slug}`}>
                    <h3 className="text-lg font-bold mb-3 hover:text-red-700 transition">
                      {ultimasCol2Main.title}
                    </h3>
                    <img
                      src={ultimasCol2Main.image || '/images/img3.webp'}
                      className="w-full h-[220px] object-cover rounded"
                      alt={ultimasCol2Main.title}
                    />
                  </Link>
                </div>
              )}
              <div className="space-y-1">
                {ultimasCol2List.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/${item.categorySlug}/${item.slug}`}
                    className="block border-b pb-1 hover:text-red-700 transition"
                  >
                    <p className="font-semibold text-sm">{item.title}</p>
                    <span className="text-xs text-gray-500">{item.readTime || '2 min read'}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden md:block">
              <p className="text-sm text-gray-600 mb-2">Advertisement</p>
              <img src="/images/ad.webp" className="w-full h-[600px] object-cover border rounded" alt="Advertisement" />
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: HIGHLIGHTS & POLL ── */}
      <section className="mt-10 border-t-4 pt-6">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <div className="mb-4">
                <h2 className="text-xl font-bold">Highlights</h2>
                <div className="w-16 h-[2px] bg-red-600 mt-2"></div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {destacadosList.map((item) => (
                  <div key={item.slug} className="border rounded p-3 bg-gray-50">
                    <Link href={`/${item.categorySlug}/${item.slug}`}>
                      <h3 className="font-semibold mb-3 leading-snug hover:text-red-700 transition">{item.title}</h3>
                      <img
                        src={item.image || '/images/img1.webp'}
                        className="w-full h-[150px] object-cover rounded"
                        alt={item.title}
                      />
                    </Link>
                    <p className="text-xs text-gray-500 mt-2">{item.readTime || '2 min read'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Poll Box */}
            <PollBox />
          </div>
        </div>
      </section>

      {/* ── SECTION 6: POLITICS FEATURE ── */}
      <section className="mt-10 border-t-4 pt-2">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold">Politics</h2>
              <div className="w-16 h-[2px] bg-red-600 mt-2"></div>
            </div>
            <Link href="/category/politics" className="text-sm text-gray-600 cursor-pointer hover:text-red-600">
              more →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2 md:border-r md:pr-4">
              {polCol1.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.categorySlug}/${item.slug}`}
                  className="block border-b pb-1 hover:text-red-700 transition"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.image || '/images/img2.webp'}
                      className="w-20 h-16 object-cover rounded flex-shrink-0"
                      alt={item.title}
                    />
                    <div>
                      <p className="font-semibold text-sm">{item.title}</p>
                      <span className="text-xs text-gray-500">{item.readTime || '2 min'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="space-y-4">
              {polCol2Main && (
                <Link href={`/${polCol2Main.categorySlug}/${polCol2Main.slug}`}>
                  <h3 className="text-xl font-bold leading-snug mb-3 hover:text-red-700 transition">
                    {polCol2Main.title}
                  </h3>
                  <img
                    src={polCol2Main.image || '/images/img3.webp'}
                    className="w-full h-[220px] object-cover rounded"
                    alt={polCol2Main.title}
                  />
                </Link>
              )}
            </div>

            <div className="space-y-2 md:border-l md:pl-4">
              {polCol3.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.categorySlug}/${item.slug}`}
                  className="flex gap-3 border-b pb-4 hover:text-red-700 transition"
                >
                  <img
                    src={item.image || '/images/img.webp'}
                    className="w-20 h-16 object-cover rounded flex-shrink-0"
                    alt={item.title}
                  />
                  <div>
                    <p className="font-semibold text-sm">{item.title}</p>
                    <span className="text-xs text-gray-500">{item.readTime || '2 min'}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: 3 COLUMNS ── */}
      <section className="mt-10 border-t-4 pt-6">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h2 className="text-xl font-bold">Top Stories</h2>
                  <div className="w-20 h-[2px] bg-red-600 mt-2"></div>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                {colSec1.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/${item.categorySlug}/${item.slug}`}
                    className="flex justify-between items-center border-b pb-2 hover:text-red-700 transition"
                  >
                    <span className="font-semibold mr-2">{item.title}</span>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{item.readTime || '2m'}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h2 className="text-xl font-bold">Economy</h2>
                  <div className="w-20 h-[2px] bg-red-600 mt-2"></div>
                </div>
                <Link href="/category/economy" className="text-sm text-gray-600 hover:text-red-600">more →</Link>
              </div>
              <div className="space-y-3 text-sm">
                {colSec2.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/${item.categorySlug}/${item.slug}`}
                    className="flex justify-between items-center border-b pb-2 hover:text-red-700 transition"
                  >
                    <span className="font-semibold mr-2">{item.title}</span>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{item.readTime || '2m'}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h2 className="text-xl font-bold">Sports</h2>
                  <div className="w-40 h-[2px] bg-red-600 mt-2"></div>
                </div>
                <Link href="/category/sports" className="text-sm text-gray-600 hover:text-red-600">more →</Link>
              </div>
              <div className="text-sm space-y-3 mt-3">
                {colSec3.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/${item.categorySlug}/${item.slug}`}
                    className="flex justify-between border-b pb-2 hover:text-red-700 transition"
                  >
                    <span className="font-bold">{item.title}</span>
                    <span className="font-bold text-gray-500 text-xs ml-2">{item.time || 'Recently'}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 8: EXPLORE NEWS ── */}
      <section className="mt-10 bg-[#e6d2c2] py-6">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold">Explore News</h2>
            <div className="w-20 h-[2px] bg-red-600 mt-2"></div>
          </div>
          <div className="border border-gray-300 bg-[#f3e5d8] p-4 mb-6">
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm cursor-pointer hover:bg-red-600 hover:text-white transition duration-200"
                >
                  {cat.name} News
                </Link>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {exploreCatSlugs.map((catSlug) => {
              const catObj = categories.find(c => c.slug === catSlug) || { slug: catSlug, name: catSlug };
              const catArtList = articles.filter(a => a.categorySlug === catSlug);
              const catList = catArtList.length >= 2 ? catArtList.slice(0, 2) : articles.slice(0, 2);

              return (
                <div key={catSlug} className="bg-white p-4 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-xl capitalize">{catObj.name}</h3>
                    <Link href={`/category/${catSlug}`} className="text-sm text-gray-600 hover:text-red-600">more →</Link>
                  </div>
                  <div className="border-t pt-1 space-y-1 text-lg">
                    {catList.map((item, idx) => (
                      <Link
                        key={item.slug}
                        href={`/${item.categorySlug}/${item.slug}`}
                        className={`block font-semibold hover:text-red-600 cursor-pointer ${idx > 0 ? 'border-t pt-2' : ''}`}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 9: POPULAR NOW & AUTHORS ── */}
      <section className="mt-10 border-t-4 pt-6">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold">Popular Now</h3>
                  <div className="w-16 h-[2px] bg-red-600 mt-2"></div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {popularesMain && (
                  <div>
                    <Link href={`/${popularesMain.categorySlug}/${popularesMain.slug}`}>
                      <h3 className="text-xl font-bold leading-snug mb-3 hover:text-red-700 transition">
                        {popularesMain.title}
                      </h3>
                      <img
                        src={popularesMain.image || '/images/img1.webp'}
                        className="w-full h-[220px] object-cover rounded mb-2"
                        alt={popularesMain.title}
                      />
                      <span className="text-xs text-gray-500">{popularesMain.readTime || '2 min read'}</span>
                    </Link>
                  </div>
                )}
                <div className="space-y-4">
                  {popularesList.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/${item.categorySlug}/${item.slug}`}
                      className="block border-b pb-3 hover:text-red-700 transition"
                    >
                      <p className="font-semibold leading-snug">{item.title}</p>
                      <span className="text-xs text-gray-500">{item.readTime || '2 min read'}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Top Authors</h3>
              </div>
              <div className="space-y-3 text-sm">
                {authors.map((auth) => (
                  <Link
                    key={auth.slug}
                    href={`/author/${auth.slug}`}
                    className="block border-b pb-2 cursor-pointer hover:text-red-600 font-medium"
                  >
                    {auth.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 10: OPINION ── */}
      <section className="mt-10 border-t-4 pt-6 bg-gray-100 py-6">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">Opinion</h2>
              <div className="w-16 h-[2px] bg-red-600 mt-2"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {opinionArticles.map((item) => (
              <Link
                key={item.slug}
                href={`/${item.categorySlug}/${item.slug}`}
                className="block bg-white p-4 rounded shadow-sm hover:shadow-md transition"
              >
                <p className="font-semibold leading-snug mb-4">{item.title}</p>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={item.authorAvatar || '/images/author.webp'}
                    className="w-10 h-10 rounded-full object-cover"
                    alt={item.author}
                  />
                  <span className="font-semibold text-blue-900">{item.author}</span>
                </div>
                <span className="text-xs text-gray-500">{item.readTime || '3 min read'}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 11: 3-COLUMN SHOWCASE ── */}
      <section className="mt-10 border-t-4 pt-6">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {showcaseCatSlugs.map((catSlug) => {
              const catObj = categories.find(c => c.slug === catSlug) || { slug: catSlug, name: catSlug };
              const catArtList = articles.filter(a => a.categorySlug === catSlug);
              const mainArt = catArtList[0] || articles[0];
              const subArts = catArtList.length >= 3 ? catArtList.slice(1, 3) : articles.slice(1, 3);

              return (
                <div key={catSlug}>
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h2 className="text-xl font-bold capitalize">{catObj.name}</h2>
                      <div className="w-16 h-[2px] bg-red-600 mt-2"></div>
                    </div>
                    <Link href={`/category/${catSlug}`} className="text-sm text-gray-600 hover:text-red-600">more →</Link>
                  </div>
                  <Link href={`/${mainArt.categorySlug}/${mainArt.slug}`}>
                    <h3 className="font-semibold text-lg leading-snug mb-3 hover:text-red-700 transition">
                      {mainArt.title}
                    </h3>
                    <img
                      src={mainArt.image || '/images/img2.webp'}
                      className="w-full h-[200px] object-cover rounded mb-2"
                      alt={mainArt.title}
                    />
                    <span className="text-xs text-gray-500">{mainArt.readTime || '2 min read'}</span>
                  </Link>
                  <div className="mt-2 space-y-3 text-sm">
                    {subArts.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/${item.categorySlug}/${item.slug}`}
                        className="block border-t pt-1 hover:text-red-700 transition"
                      >
                        <p className="font-semibold text-lg">{item.title}</p>
                        <span className="text-xs text-gray-500">{item.readTime || '2 min read'}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 12: BS WEB REPORTS ── */}
      <section className="mt-10 bg-[#e6d2c2] py-6">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold">BS Web Reports</h2>
            <div className="w-20 h-[2px] bg-red-600 mt-2"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {reportesMain && (
              <div>
                <Link href={`/${reportesMain.categorySlug}/${reportesMain.slug}`}>
                  <h3 className="text-2xl font-semibold leading-snug mb-3 hover:text-red-700 transition">
                    {reportesMain.title}
                  </h3>
                  <img
                    src={reportesMain.image || '/images/img3.webp'}
                    className="w-full h-[220px] object-cover rounded mb-2"
                    alt={reportesMain.title}
                  />
                  <span className="text-xs text-gray-700">{reportesMain.readTime || '2 min read'}</span>
                </Link>
              </div>
            )}

            <div className="space-y-1 text-lg">
              {reportesList1.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.categorySlug}/${item.slug}`}
                  className="block border-b border-gray-400 pb-1 hover:text-red-700 transition"
                >
                  <p className="font-semibold">{item.title}</p>
                  <span className="text-xs text-gray-700">{item.readTime || '2 min'}</span>
                </Link>
              ))}
            </div>

            <div className="space-y-1 text-lg">
              {reportesList2.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.categorySlug}/${item.slug}`}
                  className="block border-b border-gray-400 pb-1 hover:text-red-700 transition"
                >
                  <p className="font-semibold">{item.title}</p>
                  <span className="text-xs text-gray-700">{item.readTime || '2 min'}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 13: PEOPLE ── */}
      <section className="mt-10 border-t-4 pt-4 mb-10">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold">People</h2>
              <div className="w-16 h-[2px] bg-red-600 mt-2"></div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {personasArticles.map((item) => (
              <Link
                key={item.slug}
                href={`/${item.categorySlug}/${item.slug}`}
                className="flex justify-between gap-4 border-b pb-4 hover:text-red-700 transition"
              >
                <div>
                  <p className="font-semibold text-lg leading-snug">{item.title}</p>
                  <span className="text-xs text-gray-500">
                    {item.readTime || '3 min'} | <span className="text-blue-700">{item.author}</span>
                  </span>
                </div>
                <img
                  src={item.image || '/images/img1.webp'}
                  className="w-20 h-20 object-cover rounded flex-shrink-0"
                  alt={item.author}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
