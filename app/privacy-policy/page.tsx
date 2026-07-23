import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Business Standard',
  description: 'Privacy Policy and data protection guidelines for Business Standard.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6">
      <div className="mt-6">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <Link href="/" className="text-red-600 hover:underline">
            Home
          </Link>{' '}
          / Privacy Policy
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="border-b pb-2 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold">
                Privacy Policy
              </h1>
              <div className="w-28 h-[2px] bg-red-600 mt-2"></div>
            </div>

            <div className="text-[18px] leading-8 text-gray-900 space-y-6">
              <p className="text-sm text-gray-500">
                Effective Date: March 2026
              </p>

              <p>
                Business Standard respects your privacy and is committed to protecting any personal data you share with us.
              </p>

              <h2 className="text-xl font-bold mt-6">1. Information We Collect</h2>
              <p>
                When you subscribe to our newsletter or submit comments, we collect your name and email address. This data is stored securely on our server-side JSON storage system and is never sold or shared with third parties.
              </p>

              <h2 className="text-xl font-bold mt-6">2. How We Use Information</h2>
              <p>
                We use your email address exclusively to send you requested news alerts, executive digests, and editorial updates.
              </p>

              <h2 className="text-xl font-bold mt-6">3. Server Storage & Privacy</h2>
              <p>
                All data operations remain on our secure servers without storing private tracking data in browser localStorage or sessionStorage.
              </p>
            </div>
          </div>

          {/* Right Sidebar */}
          <div>
            <div className="border p-5 mb-6">
              <h3 className="text-lg font-bold border-b pb-2 mb-3">
                Privacy Inquiries
              </h3>
              <p className="text-sm mb-3">
                Have a question about your personal data?
              </p>
              <p className="text-red-600 font-semibold mb-1 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                privacy@businessstandard.com
              </p>
            </div>

            <div className="bg-gray-100 p-4 text-sm border">
              <span className="font-semibold">See also</span>
              <ul className="mt-2 space-y-1">
                <li><Link href="/terms-and-conditions" className="text-red-600 hover:underline">Terms & Conditions</Link></li>
                <li><Link href="/about" className="text-red-600 hover:underline">About Us</Link></li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
