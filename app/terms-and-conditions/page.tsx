import Link from 'next/link';

export const metadata = {
  title: 'Terms and Conditions | Business Standard',
  description: 'Terms and Conditions of use for Business Standard website.',
};

export default function TermsPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6">
      <div className="mt-6">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <Link href="/" className="text-red-600 hover:underline">
            Home
          </Link>{' '}
          / Terms and Conditions
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Content (Left 2 Cols) */}
          <div className="md:col-span-2">
            <div className="border-b pb-2 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold">
                Terms and Conditions
              </h1>
              <div className="w-28 h-[2px] bg-red-600 mt-2"></div>
            </div>

            <div className="text-[18px] leading-8 text-gray-900 space-y-6">
              <p className="text-sm text-gray-500">
                Last updated: June 24, 2026
              </p>

              <p>
                Welcome to Business Standard. These Terms and Conditions govern access to and use of the Business Standard website, mobile services, newsletters, social media accounts, and any digital products operated by Business Standard. By accessing or using this website, you agree to comply with these Terms and Conditions. If you do not agree with any part of these terms, you should cease using the website and related services.
              </p>

              <h2 className="text-xl font-bold mt-6">Use of the Website</h2>
              <p>
                The content published by Business Standard is intended strictly for informational and editorial purposes. Users agree to use the website in accordance with applicable laws and regulations and shall not:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-[16px]">
                <li>Use the website for unlawful purposes.</li>
                <li>Attempt to gain unauthorized access to our systems or networks.</li>
                <li>Interfere with the operation or security of the website.</li>
                <li>Introduce viruses, malware, or harmful code.</li>
                <li>Use automated tools to scrape, copy, or extract content without authorization.</li>
              </ul>

              <h2 className="text-xl font-bold mt-6">Intellectual Property</h2>
              <p>
                All content published on Business Standard, including articles, photographs, videos, graphics, logos, databases, and trademarks, is protected by applicable intellectual property laws. Reproduction without prior written permission is strictly prohibited.
              </p>

              <h2 className="text-xl font-bold mt-6">Contact Us</h2>
              <p>Inquiries regarding these Terms and Conditions may be directed to:</p>
              <ul className="space-y-1 text-[16px]">
                <li>General Inquiries: <a href="mailto:info@businessstandard.com" className="text-red-600 hover:underline">info@businessstandard.com</a></li>
                <li>Editorial Desk: <a href="mailto:editor@businessstandard.com" className="text-red-600 hover:underline">editor@businessstandard.com</a></li>
                <li>Legal Affairs: <a href="mailto:legal@businessstandard.com" className="text-red-600 hover:underline">legal@businessstandard.com</a></li>
              </ul>

            </div>
          </div>

          {/* Right Sidebar */}
          <div>
            <div className="border p-5 mb-6">
              <h3 className="text-lg font-bold border-b pb-2 mb-3">
                Digital Subscription Helpline
              </h3>
              <p className="text-sm mb-3">
                Have an issue with your digital subscription or access?
              </p>
              <p className="text-red-600 font-semibold mb-1 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email us at
              </p>
              <p className="text-red-600 text-sm mb-4">assist@bsmail.in</p>
              <div className="border-t pt-3 mt-3">
                <h4 className="font-semibold mb-1">Business Hours</h4>
                <p className="text-sm">
                  Monday to Friday - 9 am to 6 pm
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Outside business hours and on holidays, responses may be delayed.
                </p>
              </div>
            </div>

            <div className="bg-gray-100 p-4 text-sm border">
              <span className="font-semibold">See also</span>
              <ul className="mt-2 space-y-1">
                <li><Link href="/privacy-policy" className="text-red-600 hover:underline">Privacy Policy</Link></li>
                <li><Link href="/about" className="text-red-600 hover:underline">About Us</Link></li>
                <li><Link href="/our-team" className="text-red-600 hover:underline">Our Team</Link></li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
