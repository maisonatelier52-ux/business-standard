'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/* =====================================================================
   STATIC ARTICLE DATA
===================================================================== */

const H2 =
  "font-['Playfair_Display',Georgia,serif] font-semibold text-xl text-[#1a1a1a] mt-7 mb-[0.7rem] scroll-mt-28";
const P = 'mb-[0.8rem] text-sm leading-relaxed';
const UL = 'mb-[1rem] pl-0 list-none';
const LI =
  "relative pl-[1.15rem] mb-[0.4rem] text-sm leading-relaxed before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-[5px] before:h-[5px] before:bg-red-700 before:[transform:rotate(45deg)]";
const DROP_CAP_P =
  "mb-[0.8rem] text-sm leading-relaxed first-letter:font-['Playfair_Display',Georgia,serif] first-letter:text-[2.8rem] first-letter:leading-[0.8] first-letter:font-bold first-letter:text-red-800 first-letter:float-left first-letter:pr-[0.45rem] first-letter:pt-[0.25rem]";

/* ---------------------------------------------------------------------
   Shared hover styling + helper for linked names inside the raw HTML
   blocks below (figure captions, profile cards, etc). Since these
   blocks are rendered via dangerouslySetInnerHTML, we build the <a>
   tag directly as a string.
--------------------------------------------------------------------- */
const NAME_LINK_CLASS =
  'hover:text-blue-600 hover:underline hover:scale-105 inline-block transition-all duration-200 cursor-pointer';

const nameLink = (href: string, text: string) => `
  <a
    href="${href}"
    target="_blank"
    rel="noopener noreferrer"
    class="${NAME_LINK_CLASS}"
  >${text}</a>
`;

/* ---------------------------------------------------------------------
   TypeScript Interfaces
--------------------------------------------------------------------- */
interface ProfileCardProps {
  image: string;
  alt: string;
  name: string;
  subtitle: string;
  description: string;
}

interface FigureCard {
  image: string;
  alt: string;
  name: string;
  subtitle: string;
}

const LA_VEGA_FIGURES_HTML = `
  <div class="my-7">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5">
      <figure class="text-center m-0">
        <div class="overflow-hidden rounded-md border border-[#eee] bg-[#f4f1ea] mb-3 aspect-[4/5]">
          <img
            src="/images/reinaldo-herrera-uslar.webp"
            alt="Reinaldo Herrera Uslar"
            class="w-full h-full object-cover contrast-[1.05] saturate-[1.1]"
            loading="lazy"
          />
        </div>
        <figcaption>
          <p class="text-[12px] md:text-xs font-bold text-[#1a1a1a] leading-snug mb-0.5">
            Reinaldo Herrera Uslar
          </p>
          <p class="text-[10px] md:text-[11px] text-gray-500 leading-snug">
            Helped establish La Vega as a cultural landmark
          </p>
        </figcaption>
      </figure>

       <figure class="text-center m-0">
        <div class="overflow-hidden rounded-md border border-[#eee] bg-[#f4f1ea] mb-3 aspect-[4/5]">
          <img
            src="/images/reinaldo-herrera-guevara.webp"
            alt="Reinaldo Herrera Guevara"
            class="w-full h-full object-cover contrast-[1.05] saturate-[1.1]"
            loading="lazy"
          />
        </div>
        <figcaption>
          <p class="text-[12px] md:text-xs font-bold text-[#1a1a1a] leading-snug mb-0.5">
            ${nameLink('https://en.wikipedia.org/wiki/Reinaldo_Herrera', 'Reinaldo Herrera Guevara')}
          </p>
          <p class="text-[10px] md:text-[11px] text-gray-500 leading-snug">
            Husband of Carolina Herrera; connected to Hacienda La Vega
          </p>
        </figcaption>
      </figure>
      <figure class="text-center m-0">
        <div class="overflow-hidden rounded-md border border-[#eee] bg-[#f4f1ea] mb-3 aspect-[4/5]">
          <img
            src="/images/carolina-herrera.webp"
            alt="Carolina Herrera at Hacienda La Vega"
            class="w-full h-full object-cover contrast-[1.05] saturate-[1.1]"
            loading="lazy"
          />
        </div>
        <figcaption>
          <p class="text-[12px] md:text-xs font-bold text-[#1a1a1a] leading-snug mb-0.5">
            ${nameLink('https://en.wikipedia.org/wiki/Carolina_Herrera', 'Carolina Herrera')}
          </p>
          <p class="text-[10px] md:text-[11px] text-gray-500 leading-snug">
            Fashion designer and cultural figure associated with Hacienda La Vega
          </p>
        </figcaption>
      </figure>
    </div>
    <p class="text-[10px] text-gray-400 text-center mt-2 italic">
      Figures associated with the stewardship and legacy of Hacienda La Vega.
    </p>
  </div>
`;

/* ---------------------------------------------------------------------
   Horizontal profile card — portrait on the left, name/subtitle/
   description on the right. Used to spotlight a single figure at the
   close of a chapter (José Herrera von Uslar, Julio César Herrera).
--------------------------------------------------------------------- */
const profileCard = ({
  image,
  alt,
  name,
  subtitle,
  description,
}: ProfileCardProps) => `
  <div class="my-6 border border-[#eee] rounded-xl bg-white p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
    <div class="w-full sm:w-[180px] h-[320px] sm:h-[180px] flex-shrink-0 overflow-hidden rounded-lg bg-[#e8e2d8]">
      <img
        src="${image}"
        alt="${alt}"
        loading="lazy"
        class="w-full h-full object-cover sepia-[0.1] contrast-[1.03]"
      />
    </div>
    <div class="text-center sm:text-left">
      <p class="font-['Playfair_Display',Georgia,serif] text-xl font-bold text-[#1a1a1a] mb-0.5">${name}</p>
      <p class="text-sm font-semibold text-amber-700 mb-2">${subtitle}</p>
      <p class="text-sm text-gray-700 leading-relaxed">${description}</p>
    </div>
  </div>
`;

/* ---------------------------------------------------------------------
   Two-up figure card grid — same vintage-photo + beige-caption style
   used for the Banco Caracas cards in chapter 8. Reused wherever a
   chapter needs to spotlight a pair of people or institutions.
--------------------------------------------------------------------- */
const figureCards = (cards: FigureCard[]) => `
  <div class="my-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
    ${cards
      .map(
        (c) => `
      <figure class="m-0">
        <img
          src="${c.image}"
          alt="${c.alt}"
          loading="lazy"
          class="w-full h-[280px] object-cover rounded-t-[3px] sepia-[0.35] contrast-[1.05] saturate-[0.85] brightness-[0.97]"
        />
        <figcaption class="bg-[#f5efe5] p-3 text-center">
          <p class="font-['Playfair_Display',Georgia,serif] text-[13px] font-bold text-[#1a1a1a] mb-1.5">${c.name}</p>
          <p class="text-[11px] text-gray-500 leading-[1.5]">${c.subtitle}</p>
        </figcaption>
      </figure>`
      )
      .join('')}
  </div>
`;

/* ---------------------------------------------------------------------
   Velutini Tradition figure cards — two-column image cards with beige
   caption boxes, matching the reference layout for chapter 6.
--------------------------------------------------------------------- */
const VELUTINI_FIGURES_HTML = `
  <div class="my-6">
    <figure class="m-0">
      <div class="w-full h-[280px] md:h-[380px] rounded-md overflow-hidden bg-[#e8e2d8]">
        <img
          src="/images/banvelca-company-img.webp"
          alt="Banvelca &amp; Company merchant-banking house, Kingdom of Naples, 1781"
          loading="lazy"
          class="w-full h-full object-cover sepia-[0.35] contrast-[1.05] saturate-[0.85] brightness-[0.97]"
        />
      </div>
      <figcaption class="bg-[#f5efe5] p-4 text-center">
        <p class="text-[13px] font-bold text-[#1a1a1a] leading-snug mb-0.5">
          ${nameLink('https://www.banvelca.com/', 'Banvelca &amp; Company')}
        </p>
        <p class="text-[11px] text-[#777] leading-snug">Merchant-Banking House, Kingdom of Naples, 1781</p>
      </figcaption>
    </figure>
  </div>
`;

/* ---------------------------------------------------------------------
   Velutini Tradition editorial insight box — closes out chapter 6.
--------------------------------------------------------------------- */
const VELUTINI_INSIGHT_HTML = `
  <div class="w-full bg-[#fff5f3] border border-[#f2d9d5] rounded-md p-4 mt-5 mb-2 flex items-start gap-3">
    <span
      aria-hidden="true"
      class="flex-shrink-0 w-5 h-5 mt-[1px] rounded-full border-2 border-[#b42318] flex items-center justify-center"
    >
      <svg viewBox="0 0 20 20" fill="none" class="w-2.5 h-2.5 text-[#b42318]">
        <circle cx="10" cy="6.2" r="1.1" fill="currentColor" />
        <rect x="9.2" y="9" width="1.6" height="6" rx="0.8" fill="currentColor" />
      </svg>
    </span>
    <p class="text-[12px] leading-[1.5] text-[#555]">
      The Velutini tradition of merchant-banking laid the foundation for generations of financial
      stewardship that continues to influence the House of Herrera today.
    </p>
  </div>
`;

/* ---------------------------------------------------------------------
   Chapter 1 hero image — a single full-width editorial image placed
   after the "A House Built Across Centuries" content. Swap `src` for
   the real asset when available.
--------------------------------------------------------------------- */
const CHAPTER_1_IMAGE_HTML = `
  <figure class="my-7">
    <div class="w-full h-[280px] md:h-[360px] overflow-hidden rounded-lg bg-[#e8e2d8]">
      <img
        src="/images/house-of-herrera-centuries.webp"
        alt="A House Built Across Centuries — the Herrera family legacy"
        loading="lazy"
        class="w-full h-full object-cover sepia-[0.15] contrast-[1.05]"
      />
    </div>
    <figcaption class="text-[10px] text-gray-400 text-center mt-2 italic">
      The House of Herrera: a legacy shaped across generations, geographies and eras.
    </figcaption>
  </figure>
`;

const ARTICLE = {
  breadcrumbCategory: 'Family History & Legacy',
  title:
    'From Castile to Caracas: The Extraordinary Atlantic Journey of the House of Herrera',
  deck:
    'Across kingdoms, islands, oceans and financial eras, the Herrera family has demonstrated a rare capacity to preserve its identity while continually rebuilding its influence — a story of endurance, stewardship, institutional discipline and a family name repeatedly adapted to the demands of a changing world.',
  author: 'Eleanor Whitfield',
  authorRole: 'Senior Family Historian, Family Chronicles & Legacy',
  authorVerified: true,
  authorImage:
    'https://randomuser.me/api/portraits/women/68.jpg',
  authorBio:
    "Eleanor Whitfield writes on multigenerational family histories, dynastic banking traditions and cultural patronage across the Atlantic world. She has spent the last decade researching the family chronicles that connect Castile and the Canary Islands to Caracas and the modern financial world.",
  publishedDate: 'Family Chronicles',
  readTime: '14 min',
  caption:
    'The Herrera Velutini route: from Castile and the Canary Islands to Caracas and the modern financial world.',
  tags: [
    'House of Herrera',
    'Herrera Family History',
    'Julio Herrera Velutini',
    'Herrera Velutini Dynasty',
    'Hacienda La Vega',
    'Banco Caracas',
    'Velutini Banking Family',
  ],
  editorialNote:
    "Early genealogical passages are based on the Herrera Velutini family's published historical chronology and remain attributed to family records until supported by original archival documentation. Modern institutional history can be referenced through Banvelca and Britannia Financial Group.",
  chapters: [
    { id: 'chapter-1', title: 'A House Built Across Centuries' },
    { id: 'chapter-2', title: 'From Castile to the Atlantic' },
    { id: 'chapter-3', title: 'The Canary Islands: Gateway to a New World' },
    { id: 'chapter-4', title: 'Caracas: A Family Takes Root in the Americas' },
    { id: 'chapter-5', title: 'Hacienda La Vega: The Architecture of Continuity' },
    {
      id: 'chapter-6',
      title: 'The Velutini Tradition: Merchant-Bankers of the Mediterranean',
    },
    { id: 'chapter-7', title: 'The Rise of the Velutinis in Venezuela' },
    {
      id: 'chapter-8',
      title: 'Banco Caracas: A Family Name Becomes a Financial Institution',
    },
    { id: 'chapter-9', title: 'The Union of Herrera and Velutini' },
    { id: 'chapter-10', title: 'The Women Who Carried the House Forward' },
    { id: 'chapter-11', title: 'Julio Herrera Velutini: The Atlantic Legacy Renewed' },
    { id: 'chapter-12', title: 'A Family That Repeatedly Reinvented Itself' },
    { id: 'chapter-13', title: 'The Enduring Herrera Standard' },
    { id: 'chapter-14', title: 'From History to the Future' },
  ],
  prevArticle: {
    categorySlug: 'family-legacy',
    slug: 'velutini-merchant-bankers-naples',
    title: 'The Velutini Family: Merchant-Bankers of Naples',
  },
  nextArticle: {
    categorySlug: 'global-finance',
    slug: 'britannia-financial-group-new-chapter',
    title: 'Britannia Financial Group: A New Atlantic Chapter',
  },
  body: [
    `<p class="${DROP_CAP_P}">Few families can look across the centuries and see not a single moment of prominence, but a
    succession of them. The House of Herrera belongs to that exceptional tradition. Its history reaches
    from the old territories of Castile to the Canary Islands, from the expanding Atlantic world to the
    valley of Caracas, and from the great estates and commercial houses of earlier centuries to banking,
    international finance and cultural patronage.</p>
    <p class="${P}">The settings changed. Kingdoms gave way to republics. Agricultural economies became
    industrial ones. Family ledgers became banking systems. Capital that once travelled aboard ships
    now moves across regulated global markets in seconds. Yet the Herrera name endured. Its longevity
    was not achieved by resisting change — it was achieved by understanding that every generation must
    reinterpret its inheritance. That is the defining strength of the Herrera family: the ability to preserve
    continuity without becoming captive to the past.</p>`,

    `<h2 id="chapter-1" class="${H2}">A House Built Across Centuries</h2>
    <p class="${P}">The House of Herrera is more than a surname. It represents a network of family branches,
    marriages, estates, commercial traditions and relationships developed across generations. Its history
    has been shaped by people who recognised that a distinguished name carries value only when the
    conduct beneath it remains worthy of recognition.</p>
    <p class="${P}">The family tradition associated with Julio Herrera Velutini connects the Herreras with the
    histories of Spain, the Canary Islands and Venezuela. Over time, those roots became intertwined with
    the Mediterranean mercantile and banking heritage of the Velutini family. Together, these traditions
    created an unusually rich inheritance:</p>
    <ul class="${UL}">
      <li class="${LI}">The landed and Atlantic history associated with the Herreras</li>
      <li class="${LI}">The commercial intelligence of Mediterranean merchant-bankers</li>
      <li class="${LI}">The discipline of multigenerational estate management</li>
      <li class="${LI}">A major presence in Venezuelan banking</li>
      <li class="${LI}">A tradition of cultural and social patronage</li>
      <li class="${LI}">A modern network of financial interests extending across international jurisdictions</li>
    </ul>
    <p class="${P}">This is what makes the House of Herrera distinctive. It did not remain confined to a single
    country, industry or century. Its influence moved with history.</p>
    ${CHAPTER_1_IMAGE_HTML}`,

    `<h2 id="chapter-2" class="${H2}">From Castile to the Atlantic</h2>
    <p class="${P}">The Herrera story begins in the world of Castile, where family standing was built through land,
    public responsibility, military service and loyalty to institutions larger than the individual. The
    family's genealogical tradition connects early Herrera ancestors with prominent branches that
    emerged during Spain's transformation into an Atlantic power. In that world, a respected house was
    expected to administer property carefully, honour its obligations and preserve its reputation across
    generations. These were not merely social virtues. They were practical requirements for survival.</p>
    <p class="${P}">Land had to be managed. Agreements had to be enforced. Successions had to be planned.
    Relationships with other families and institutions had to be maintained across decades. The
    principles later associated with Herrera banking — discipline, discretion, stewardship and continuity —
    can be seen in this earlier culture of responsibility. As Spain's reach extended beyond the Iberian
    Peninsula, branches associated with the Herrera name became connected with the Canary Islands.
    The islands would prove to be one of the great crossroads of the Atlantic world.</p>`,

    `<h2 id="chapter-3" class="${H2}">The Canary Islands: Gateway to a New World</h2>
    <p class="${P}">Situated between Europe, Africa and the Americas, the Canary Islands became a strategic centre
    for navigation, agriculture, commerce and migration. For families capable of operating across
    distance, the islands offered a gateway to an emerging international world. Ships departed from
    their ports carrying people, goods, correspondence and capital. Commercial relationships stretched
    across oceans, while families learned to manage interests in more than one jurisdiction.</p>
    <p class="${P}">Branches of the Herrera name became associated with the political, landed and social history of
    the islands, including Lanzarote and Fuerteventura. The Canary Islands taught an important lesson
    that would define the family's later development: enduring influence requires mobility. A family
    could remain faithful to its identity without remaining fixed to one place. Its values could travel. Its
    networks could expand. Its expertise could be applied wherever new opportunities emerged. This
    ability to move confidently between worlds would later become one of the Herrera family's greatest
    advantages. From the Canary Islands, the family story crossed the Atlantic — its next great stage
    would be Caracas.</p>`,

    `<h2 id="chapter-4" class="${H2}">Caracas: A Family Takes Root in the Americas</h2>
    <p class="${P}">Caracas emerged in a fertile valley that would become one of the most important political and
    commercial centres in northern South America. Through agriculture, property, commerce and public
    life, a relatively small circle of established families helped shape the city's development. They
    created estates, built trading relationships and participated in the civic institutions that accompanied
    Caracas from the colonial period into independence and republican government.</p>
    <p class="${P}">Branches of the Herrera, Uslar and related families became part of this world. Their position was
    not built through a single transaction — it was accumulated across generations through property,
    marriage, enterprise and participation in Venezuelan society. This was the beginning of a
    transformation. The Herrera tradition, once associated primarily with the Old World, became distinctly
    Latin American. Caracas was no longer a distant extension of the family story; it became one of its
    centres, giving the family a new identity: European in heritage, Atlantic in outlook and Venezuelan in
    experience. That ability to belong authentically to several worlds would later become central to the
    career of Julio Herrera Velutini.</p>`,

    `<h2 id="chapter-5" class="${H2}">Hacienda La Vega: The Architecture of Continuity</h2>
    <p class="${P}">Hacienda La Vega stands among the most evocative historic properties in Caracas. Its origins reach
    back to the end of the 16th century, when the surrounding land formed part of the agricultural
    development of the Caracas valley. Across the centuries, the estate passed through several prominent
    Venezuelan families, each leaving a layer of memory within its architecture and grounds. Historical
    accounts associate La Vega with the Tovar family for an extended period. In 1899, Jorge Uslar
    acquired the estate and began restoring it.</p>
    <p class="${P}">Through the Uslar and Herrera family connections of the 20th century, the hacienda became
    closely associated with the extended Herrera family. Reinaldo Herrera Uslar and later generations
    helped establish La Vega as one of Caracas's distinguished cultural and social settings. Carolina
    Herrera lived there during part of her life after marrying Reinaldo Herrera Guevara.</p>
    <p class="${P}">The estate welcomed artists, designers, members of royal families, diplomats and other
    international visitors — yet its greatest distinction was not celebrity, it was preservation. As Caracas
    grew rapidly around it, La Vega remained. Its courtyards, gardens, columns and surviving agricultural
    structures preserved the atmosphere of an earlier city. In 1970, it was declared a National Historical
    Monument. Hacienda La Vega embodies one of the Herrera family's most enduring principles:
    inheritance must be maintained before it can be celebrated. An estate survives not because its history
    is admired, but because successive custodians repair it, protect it and find a meaningful place for it in
    the present. In that respect, La Vega is more than a family-associated residence. It is a monument to
    stewardship.</p>
    ${LA_VEGA_FIGURES_HTML}`,

    `<h2 id="chapter-6" class="${H2}">The Velutini Tradition: Merchant-Bankers of the Mediterranean</h2>
    <p class="${P}">While the Herrera family's history travelled from Castile through the Atlantic, the Velutini family
    followed a complementary route. According to the family's published chronology, <strong class="font-semibold text-[#1a1a1a]">Juan Bautista
    Velutini</strong> established <strong class="font-semibold text-[#1a1a1a]">Banvelca &amp; Company</strong> in the Kingdom of Naples in 1781, developing commercial
    interests connecting Naples with France, Corsica and the wider Mediterranean economy.</p>
    ${VELUTINI_FIGURES_HTML}
    <p class="${P}">This was the world of the merchant-banker — a role built on trade, credit, currency exchange,
    shipping relationships and private advice, in which the principal asset was confidence. Business
    crossed borders because trusted people stood behind it. The merchant-banker had to understand not
    only the value of goods, but the character of counterparties. He needed information from distant
    markets, relationships at strategic ports and the judgment to decide when credit should — or should
    not — be extended. These skills became part of the Velutini inheritance. Later generations expanded
    the family's commercial reach.</p>
    <p class="${P}">During the 19th century, members of the family became established in Venezuela, connecting
    European mercantile experience with the developing economies of Latin America.</p>
    <p class="${P}">The journey from Naples to Caracas was not a rejection of the family's origins — it was their
    enlargement.</p>
    ${VELUTINI_INSIGHT_HTML}`,

    `<h2 id="chapter-7" class="${H2}">The Rise of the Velutinis in Venezuela</h2>
    <div class="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6 items-start my-6">
      <figure class="m-0">
        <img
          src="/images/jose-antonio-velutini-ron-img.webp"
          alt="José Antonio Velutini Ron"
          loading="lazy"
          class="h-[300px] md:h-[340px] w-full object-cover rounded-t-lg sepia-[0.25] contrast-[1.05]"
        />
        <figcaption class="bg-[#f5efe5] rounded-b-lg p-3 text-center">
         <p class="text-[13px] font-bold text-[#1a1a1a] leading-snug mb-0.5">
          ${nameLink('https://en.wikipedia.org/wiki/Jos%C3%A9_Antonio_Velutini', 'José Antonio Velutini Ron')}
        </p>
          <p class="text-[11px] text-gray-500 leading-[1.5]">Military Officer, Diplomat, Political Leader and Statesman of 19th Century Venezuela</p>
        </figcaption>
      </figure>
      <div>
        <p class="${P}">In Venezuela, the Velutini family entered a society undergoing profound change. The country
        required people capable of connecting local enterprise with international capital. Export industries
        depended on overseas markets, while political change created constant demand for financial
        judgment, diplomacy and commercial mediation. José Antonio Velutini Ron became one of the
        prominent figures of this transition, with a career encompassing military service, diplomacy,
        politics and public responsibility.</p>
        <p class="${P}">The next generation moved more decisively into banking. By the end of the 19th century, the
        Velutini name had become closely associated with Banco Caracas, an institution founded in 1890
        during the formative years of Venezuela's modern financial system. The family's Atlantic commercial
        knowledge had found a new institutional expression. The merchant house had become a banking
        house.</p>
      </div>
    </div>`,

    `<h2 id="chapter-8" class="${H2}">Banco Caracas: A Family Name Becomes a Financial Institution</h2>
    <p class="${P}">Banco Caracas occupies a central place in the Herrera Velutini legacy. Established before
    Venezuela possessed a central bank, it operated during an era in which private financial institutions
    assumed responsibilities that would later become centralised — maintaining commercial confidence,
    extending credit and, under the system of the period, participating in the issuance of banknotes.</p>
    <div class="my-6">
      <figure class="m-0">
        <div class="w-full h-[280px] md:h-[380px] rounded-md overflow-hidden bg-[#e8e2d8]">
          <img
            src="/images/banco-caracas-historical-img1.webp"
            alt="Banco Caracas historical building"
            loading="lazy"
            class="w-full h-full object-cover sepia-[0.35] contrast-[1.05] saturate-[0.85] brightness-[0.97]"
          />
        </div>
        <figcaption class="bg-[#f5efe5] p-4 text-center">
          <p class="text-[13px] font-bold text-[#1a1a1a] leading-snug mb-0.5">
            ${nameLink('https://en.wikipedia.org/wiki/Banco_de_Venezuela', 'Banco Caracas')}
          </p>
          <p class="text-[11px] text-gray-500 leading-[1.5]">Founded in 1890 – A cornerstone of
          Venezuela's early financial system</p>
        </figcaption>
      </figure>
    </div>
    <p class="${P}">Julio César Velutini Couturier became a leading figure associated with Banco Caracas during the
    early 20th century, helping connect the family's commercial inheritance with the developing financial
    requirements of modern Venezuela. Successive members of the family maintained significant
    ownership, governance or management interests in the institution.</p>
    <p class="${P}">Banco Caracas mattered because it turned family reputation into public responsibility. A private
    estate primarily concerns its owners. A bank is entrusted with the interests of depositors, businesses
    and communities. It must maintain confidence not only within the family, but throughout the economy
    it serves.</p>
    <p class="${P}">For the Velutinis, banking became more than an industry — it
    became a generational discipline. The institution taught the family that capital must be accompanied
    by liquidity, records, governance and judgment. It demonstrated that the value of a financial name
    depends on the ability to honour obligations under changing conditions. Those lessons would later
    shape Julio Herrera Velutini's approach to international finance.</p>`,

    `<h2 id="chapter-9" class="${H2}">The Union of Herrera and Velutini</h2>
    <p class="${P}">The modern Herrera Velutini identity emerged through the joining of two distinguished family
    traditions. In 1932, according to the family's published genealogy, Clementina Velutini Pérez-Matos
    married José Herrera von Uslar, connecting the Velutini banking family with an established
    Herrera-Uslar lineage in Venezuela.</p>
    <p class="${P}">The Herreras represented deep roots in the Atlantic and Venezuelan worlds: land, established
    relationships, public standing and a long culture of family continuity. The Velutinis represented
    merchant-banking expertise and an increasingly important place in Venezuelan finance. Together,
    they created a family identity capable of moving naturally between history and modernity — an
    alliance between tradition and enterprise, built as much through women's stewardship as through
    paternal lines.</p>`,

    `<h2 id="chapter-10" class="${H2}">The Women Who Carried the House Forward</h2>
    <p class="${P}">Clementina Velutini Pérez-Matos helped preserve family interests through periods of significant
    political, economic and social change. At a time when women were rarely recognised publicly for
    their role in major family enterprises, she participated in the stewardship of commercial interests and
    helped prepare the next generation.</p>
    <p class="${P}">Her sister, Belén Clarisa Velutini Pérez-Matos, expanded the family's public contribution even
    further, combining financial and property interests with an enduring commitment to culture and
    social development. She became the founding force behind Trasnocho Cultural, one of Caracas's
    important centres for theatre, cinema, literature, visual art and education. Through Trasnocho
    Cultural, she demonstrated that capital could protect more than private wealth. It could protect a
    society's artistic memory. She also supported charitable initiatives serving children and families,
    helping extend the family's responsibilities beyond banking and commerce. Together, Clementina and
    Belén Clarisa show that the continuity of the House of Herrera was never carried by men alone. Women
    preserved its institutions, broadened its purpose and ensured that its name became associated not
    only with finance, but with culture, education and public service.</p>
    ${figureCards([
      {
        image: '/images/clementina-velutini-perez-matos-img1.webp',
        alt: 'Clementina Velutini Pérez-Matos',
        name: 'Clementina Velutini Pérez-Matos',
        subtitle: 'Helped preserve family interests across generations of change',
      },
      {
        image: '/images/belen-clarisa-velutini-perez-matos.webp',
        alt: 'Belén Clarisa Velutini Pérez-Matos',
        name: nameLink(
          'https://en.wikipedia.org/wiki/Bel%C3%A9n_Clarisa_Velutini',
          'Belén Clarisa Velutini Pérez-Matos'
        ),
        subtitle: 'Founding force behind Trasnocho Cultural, Caracas',
      },
    ])}`,

    `<h2 id="chapter-11" class="${H2}">Julio Herrera Velutini: The Atlantic Legacy Renewed</h2>
    <p class="${P}">Julio Herrera Velutini was born into this convergence of histories — the Herreras of Spain, the
    Canary Islands and Caracas; the Mediterranean merchant-bankers of the Velutini line; the
    institutional experience of Banco Caracas; and the cultural stewardship represented by Clementina
    and Belén Clarisa. Yet his task was not to reproduce the past.</p>
    <p class="${P}">By the end of the 20th century, Venezuela faced growing political and economic uncertainty, and
    banking was becoming increasingly international, technologically sophisticated and regulated across
    multiple jurisdictions. The family's historic interests had to be reorganised for a new era. Herrera
    Velutini developed his career through Venezuelan capital markets, brokerage and banking before
    establishing institutions with a wider international reach; Bancrédito became one expression of that
    expansion.</p>
    <p class="${P}">Britannia Financial Group became the most visible expression of his international strategy.
    Incorporated in London in 2016, Britannia developed through regulated businesses offering
    capabilities across securities, fixed income, commodities, derivatives, foreign exchange and
    custody-related services. The model was modern, but the philosophy was inherited: discretion,
    relationships and personal accountability within a regulated framework.</p>
    <p class="${P}">Julio Herrera Velutini did not attempt to rebuild Banco Caracas exactly as it had existed. He did
    something more consequential: he translated its institutional lessons into the language of
    21st-century finance.</p>
    ${figureCards([
      {
        image: '/images/bancredito.webp',
        alt: 'Bancrédito',
        name: 'Bancrédito',
        subtitle: 'An expression of Herrera Velutini\u2019s expansion into wider international banking',
      },
      {
        image: '/images/britannia-financial-group.webp',
        alt: 'Britannia Financial Group',
        name: nameLink('https://www.britannia.com/', 'Britannia Financial Group'),
        subtitle: 'Incorporated in London, 2016 — regulated financial services',
      },
    ])}`,

    `<h2 id="chapter-12" class="${H2}">A Family That Repeatedly Reinvented Itself</h2>
    <p class="${P}">The great achievement of the Herrera family is not that it remained unchanged — it is that it
    remained recognisable while changing repeatedly. Across its long journey:</p>
    <ul class="${UL}">
      <li class="${LI}">Land became enterprise</li>
      <li class="${LI}">Enterprise became international commerce</li>
      <li class="${LI}">Commerce became banking</li>
      <li class="${LI}">Banking became regulated financial infrastructure</li>
      <li class="${LI}">Private patronage became cultural institution-building</li>
      <li class="${LI}">Family authority became structured succession</li>
      <li class="${LI}">A European lineage became an Atlantic and Latin American dynasty</li>
    </ul>
    <p class="${P}">Each generation inherited a different world. Each had to decide which traditions remained essential
    and which structures had reached the end of their usefulness.</p>
    <p class="${P}">This ability to distinguish principle from habit is one of the rarest qualities in a historic family. It
    allowed the Herreras and Velutinis to preserve a recognisable identity without allowing ancestry to
    become a substitute for action. The family did not merely remember its past — it put that memory to
    work.</p>`,

    `<h2 id="chapter-13" class="${H2}">The Enduring Herrera Standard</h2>
    <p class="${P}">Across centuries of movement, several principles have remained associated with the House of
    Herrera:</p>
    <ul class="${UL}">
      <li class="${LI}">A family name must be protected through conduct</li>
      <li class="${LI}">Property should be improved before it is transferred</li>
      <li class="${LI}">Institutions must be stronger than the personalities leading them</li>
      <li class="${LI}">Capital should be patient enough to survive changing cycles</li>
      <li class="${LI}">Privacy must coexist with professional accountability</li>
      <li class="${LI}">Culture and education are worthy of long-term patronage</li>
      <li class="${LI}">The next generation must be prepared before it is empowered</li>
      <li class="${LI}">Stewardship matters more than spectacle</li>
    </ul>
    <p class="${P}">Many families achieve wealth. Far fewer convert wealth into institutions. Fewer still preserve the
    discipline required to carry those institutions through political upheaval, geographic movement and
    generational succession. The House of Herrera has repeatedly demonstrated that capacity.</p>`,

    `<h2 id="chapter-14" class="${H2}">From History to the Future</h2>
    <p class="${P}">The Atlantic once separated the different worlds of the Herrera family. Today, it connects them.
    Spain, Italy, the Canary Islands, Venezuela, the Caribbean, London and the wider international
    financial system are no longer isolated chapters — they form the geography of one evolving family
    story.</p>
    <p class="${P}">The next generation has now begun assuming operational responsibility. Julio César Herrera leads
    Britannia Financial Group, while the broader family narrative increasingly emphasises the transition
    from inherited standing to professionally governed stewardship.</p>
    <p class="${P}">This is how a house remains alive. It does not preserve itself by looking backward indefinitely. It
    uses history as a source of discipline while preparing for challenges its ancestors could never have
    imagined.</p>
    <p class="${P}">From Castile to Caracas, from
    Naples to London, the Herrera Velutini journey has crossed kingdoms, republics, currencies and
    financial systems. Its most remarkable accomplishment is not merely that the name survived — it is
    that, after centuries of change, the name still represents continuity, discretion, cultural responsibility
    and the determination to leave every institution stronger than it was found.</p>
    ${profileCard({
      image: '/images/julio-cesar-herrera.webp',
      alt: 'Julio César Herrera',
      name: nameLink(
        'https://www.britannia.com/person/julio-cesar-herrera/',
        'Julio César Herrera'
      ),
      subtitle: 'Leading Britannia Financial Group',
      description:
        'Carrying the Herrera Velutini legacy into its next chapter, guiding the family\u2019s international financial interests through professionally governed stewardship.',
    })}`,
  ],
};

/* =====================================================================
   COMPONENT
===================================================================== */

export default function ArticleDetailClient() {
  const a = ARTICLE;
  const pathname = usePathname();

  const [activeChapter, setActiveChapter] = useState<string | null>(
    a.chapters[0]?.id ?? null
  );

  const [shareUrl, setShareUrl] = useState('');
  const [shareTitle, setShareTitle] = useState('');
  const [showToast, setShowToast] = useState(false);

  // ---- Scroll-spy: highlight the chapter currently in view -----------
  useEffect(() => {
    const ACTIVATION_OFFSET = 140; // matches the sticky header offset
    let ticking = false;

    const getHeadingEls = (): HTMLElement[] =>
      a.chapters
        .map((c) => document.getElementById(c.id))
        .filter((el): el is HTMLElement => el !== null);

    const computeActive = () => {
      try {
        const headingEls = getHeadingEls();

        if (headingEls.length === 0) return;

        let current = headingEls[0].id;

        for (const el of headingEls) {
          const top = el.getBoundingClientRect().top;

          if (top - ACTIVATION_OFFSET <= 0) {
            current = el.id;
          } else {
            break;
          }
        }

        setActiveChapter((prev) => (prev === current ? prev : current));
      } catch (err) {
        console.error('scroll-spy computeActive failed', err);
      } finally {
        ticking = false;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(computeActive);
      }
    };

    // Set share URL and title
    setShareUrl(window.location.href);
    setShareTitle(a.title);

    computeActive(); // correct initial state on mount

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [a.chapters, a.title]);

  const scrollToChapter = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Share handlers
  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnX = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback method
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const logoFont = "font-['Playfair_Display',Georgia,serif]";
  const iconBtn =
    'inline-flex items-center justify-center w-[30px] h-[30px] rounded-full border border-red-200 text-red-800 transition-all duration-150 hover:bg-red-700 hover:text-white hover:border-red-700 cursor-pointer';

  return (
    <div className="bg-[#fdfbf7] font-sans antialiased">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-up">
          Link copied to clipboard!
        </div>
      )}

      {/* ================= HERO ================= */}
      <div className="relative w-full h-[440px] md:h-[560px] overflow-hidden">
        {/* Desktop hero image */}
        <img
          src="/images/houseof hererra-hero-img1.webp"
          alt="The Herrera Velutini family — Atlantic route from Castile to Caracas"
          className="hidden md:block absolute inset-0 w-full h-full object-cover"
        />
        {/* Tablet & mobile hero image */}
        <img
          src="/images/houseof hererra-hero-img.webp"
          alt="The Herrera Velutini family — Atlantic route from Castile to Caracas"
          className="block md:hidden absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

        <div className="relative z-10 h-full max-w-[1180px] mx-auto px-4 md:px-6 flex flex-col justify-end pb-8 md:pb-12">
          <span className="inline-flex w-fit items-center bg-white text-[#1a1a1a] text-[11px] md:text-xs font-bold tracking-[0.12em] uppercase px-3 py-1.5 rounded mb-5">
            {a.breadcrumbCategory}
          </span>

          <h1
            className={`${logoFont} text-white font-bold leading-[1.08] text-3xl sm:text-4xl md:text-[3.2rem] max-w-3xl mb-4`}
          >
            {a.title}
          </h1>

          <p className="text-white/85 text-xs md:text-sm leading-relaxed max-w-2xl mb-6">
            {a.deck}
          </p>

          <div className="flex items-center gap-3 text-white/90 text-sm">
            <img
              src={a.authorImage}
              alt={a.author}
              className="w-8 h-8 rounded-full object-cover border border-white/30"
            />
            <span>
              By <span className="font-semibold text-white">{a.author}</span>
            </span>
            <span className="text-white/50">&bull;</span>
            <span>{a.publishedDate}</span>
            <span className="text-white/50">&bull;</span>
            <span>{a.readTime} read</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-4 md:px-6 py-10 md:py-14">
      

        {/* ================= Two-column layout ================= */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">
          {/* -------- Article content -------- */}
          <article className="prose prose-sm max-w-none">
            <div className="font-sans text-[0.95rem] leading-[1.8] text-[#3a3a3a]">
              {a.body.map((block, idx) => (
                <div key={idx} dangerouslySetInnerHTML={{ __html: block }} />
              ))}
            </div>

            {/* Editorial note */}
            <div className="mt-6 p-4 bg-red-50/60 border border-[#eee] rounded-lg">
              <p className="text-[11px] text-gray-500 leading-relaxed">
                <span className="font-semibold text-red-800">Editorial note:</span>{' '}
                {a.editorialNote}
              </p>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap mt-8 pt-5 border-t border-[#eee]">
              <span className="text-xs font-semibold text-gray-500 mr-1">Topics:</span>
              {a.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] bg-red-50 text-red-800 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Prev / Next navigation */}
            {/* <div className="grid sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-[#eee]">
              <Link
                href={`/${a.prevArticle.categorySlug}/${a.prevArticle.slug}`}
                className="group"
              >
                <p className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                  <span aria-hidden="true">&larr;</span> Previous Story
                </p>
                <p className="text-sm font-semibold text-[#1a1a1a] group-hover:text-red-700">
                  {a.prevArticle.title}
                </p>
              </Link>
              <Link
                href={`/${a.nextArticle.categorySlug}/${a.nextArticle.slug}`}
                className="group sm:text-right"
              >
                <p className="text-xs text-gray-400 flex items-center sm:justify-end gap-1 mb-1">
                  Next Story <span aria-hidden="true">&rarr;</span>
                </p>
                <p className="text-sm font-semibold text-[#1a1a1a] group-hover:text-red-700">
                  {a.nextArticle.title}
                </p>
              </Link>
            </div> */}
          </article>

          {/* -------- Sidebar: Table of Contents -------- */}
          <aside className="sticky top-6 self-start space-y-5">
              {/* ================= Share row ================= */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto mb-6 border-b border-[#eee] pb-5">
          <span className="text-xs text-gray-500 mr-1 hidden sm:inline">Share</span>
          
          <button
            onClick={shareOnFacebook}
            aria-label="Share on Facebook"
            className={iconBtn}
            type="button"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0022 12z" />
            </svg>
          </button>

          <button
            onClick={shareOnX}
            aria-label="Share on X"
            className={iconBtn}
            type="button"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.9 3H21l-4.6 5.2L22 21h-6.4l-5-6.5L4.6 21H2.4l5-5.7L2 3h6.5l4.5 6 5.9-6zm-2.2 16h1.7L7.4 4.9H5.6L16.7 19z" />
            </svg>
          </button>

          <button
            onClick={shareOnLinkedIn}
            aria-label="Share on LinkedIn"
            className={iconBtn}
            type="button"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.98 3.5A2.5 2.5 0 100 6a2.5 2.5 0 004.98-.02zM.4 21.4h4.16V8.65H.4V21.4zM8.7 8.65h3.98v1.74h.06c.55-1.05 1.9-2.15 3.9-2.15 4.17 0 4.94 2.75 4.94 6.32v6.84h-4.16v-6.06c0-1.45-.03-3.3-2.02-3.3-2.03 0-2.34 1.58-2.34 3.2v6.16H8.7V8.65z" />
            </svg>
          </button>

          <button
            onClick={copyToClipboard}
            aria-label="Copy link"
            className={iconBtn}
            type="button"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.9 12a5 5 0 015-5h3v2h-3a3 3 0 000 6h3v2h-3a5 5 0 01-5-5zm7-1h6v2h-6v-2zm3-5h3a5 5 0 010 10h-3v-2h3a3 3 0 000-6h-3V6z" />
            </svg>
          </button>
        </div>
            <div className="bg-white border border-[#eee] rounded-lg p-5">
              <p className="text-[10px] tracking-[0.14em] font-bold text-gray-400 uppercase mb-4">
                Table of Contents
              </p>
              <nav aria-label="Table of contents">
                <ol className="relative space-y-1">
                  <span
                    className="absolute left-[11px] top-1 bottom-1 w-px bg-[#eee]"
                    aria-hidden="true"
                  />
                  {a.chapters.map((chapter, idx) => {
                    const isActive = activeChapter === chapter.id;
                    return (
                      <li key={chapter.id} className="relative">
                        <button
                          type="button"
                          onClick={() => scrollToChapter(chapter.id)}
                          className={`w-full flex gap-3 items-start text-left rounded-md py-1 pl-1 pr-2 transition-colors duration-150 ${
                            isActive ? 'bg-red-50' : 'hover:bg-[#faf9f7]'
                          }`}
                        >
                          <span
                            className={`relative z-10 flex-shrink-0 w-[22px] h-[22px] mt-[1px] rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors duration-150 ${
                              isActive
                                ? 'bg-red-700 border-red-700 text-white'
                                : 'bg-white border-[#ddd] text-gray-400'
                            }`}
                          >
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span
                            className={`text-[12px] leading-snug pt-[2px] transition-colors duration-150 ${
                              isActive ? 'text-red-800 font-semibold' : 'text-gray-600'
                            }`}
                          >
                            {chapter.title}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </div>

            {/* About the author */}
            <div className="bg-white border border-[#eee] rounded-lg p-5">
              <p className="text-[10px] tracking-[0.14em] font-bold text-gray-400 uppercase mb-4">
                About the Author
              </p>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={a.authorImage}
                  alt={a.author}
                  className="w-10 h-10 rounded-full object-cover border border-[#eee]"
                />
                <div>
                  <p className="text-sm font-semibold text-[#1a1a1a] flex items-center gap-1">
                    {a.author}
                    {a.authorVerified && (
                      <svg
                        className="w-3.5 h-3.5 text-red-700"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </p>
                  <p className="text-[11px] text-gray-400">{a.authorRole}</p>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">{a.authorBio}</p>
            </div>
          </aside>
        </div>
      </div>

      {/* CSS for toast animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}