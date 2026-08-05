import './globals.css'
import Link from 'next/link'
import { Droplet, Phone, Mail } from 'lucide-react'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-slate-50 text-slate-800 min-h-screen flex flex-col">
        {/* Header - fixed height to prevent cropping */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex h-[68px] items-center justify-between gap-4">
              <Link href="/" className="flex items-center gap-3 shrink-0">
                <div className="bg-sky-600 text-white p-2.5 rounded-lg flex items-center justify-center shrink-0">
                  <Droplet className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold leading-none tracking-tight text-slate-900">
                    Delight Water Shop
                  </span>
                  <span className="text-[11px] leading-none mt-1 text-slate-500 uppercase tracking-wide font-medium">
                    Pure Water Solutions
                  </span>
                </div>
              </Link>

              <nav className="hidden md:flex items-center gap-7 text-[14px] font-medium text-slate-600">
                <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
                <Link href="/catalog" className="hover:text-slate-900 transition-colors">Products</Link>
                <Link href="/services" className="hover:text-slate-900 transition-colors">Services</Link>
                <Link href="/contact" className="hover:text-slate-900 transition-colors">Contact</Link>
              </nav>

              <div className="flex items-center gap-2.5 shrink-0">
                <a href="tel:+14803452427" className="hidden lg:inline-flex items-center gap-2 text-[13px] text-slate-600 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>+1 (480) 345-2427</span>
                </a>
                <Link
                  href="/catalog"
                  className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg transition-colors"
                >
                  View Products
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
          {children}
        </main>

        {/* Footer - simple, flat */}
        <footer className="bg-white border-t border-slate-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="bg-sky-600 p-1.5 rounded-md text-white flex items-center justify-center">
                  <Droplet className="w-4 h-4" />
                </div>
                <span className="font-semibold text-slate-900 text-[14px]">Delight Water Shop</span>
              </div>
              <p className="text-[13px] leading-6 text-slate-500">
                Professional water purification, dispenser systems and bottled water delivery for homes and businesses in Chandler, AZ.
              </p>
            </div>
            <div>
              <h4 className="text-[13px] font-semibold text-slate-900 mb-3 uppercase tracking-wide">Products</h4>
              <ul className="space-y-2 text-[13px] text-slate-600">
                <li><Link href="/catalog" className="hover:text-slate-900">Bottled Water (19L & 500ml)</Link></li>
                <li><Link href="/catalog" className="hover:text-slate-900">RO Purification Systems</Link></li>
                <li><Link href="/catalog" className="hover:text-slate-900">Dispensers & Coolers</Link></li>
                <li><Link href="/catalog" className="hover:text-slate-900">Filters & Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-semibold text-slate-900 mb-3 uppercase tracking-wide">Company</h4>
              <ul className="space-y-2 text-[13px] text-slate-600">
                <li><Link href="/services" className="hover:text-slate-900">Services</Link></li>
                <li><Link href="/contact" className="hover:text-slate-900">Contact Us</Link></li>
                <li><span className="text-slate-400">3631 S Vista Pl, Chandler, AZ</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-semibold text-slate-900 mb-3 uppercase tracking-wide">Contact</h4>
              <ul className="space-y-2 text-[13px] text-slate-600">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +1 (480) 345-2427</li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@delightwatershop.local</li>
                <li className="text-slate-400 text-[12px] mt-3">Mon-Fri 9AM-5PM, Sat 9AM-1PM</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-[12px] text-slate-500">
              <span>© {new Date().getFullYear()} Delight Water Shop. All rights reserved.</span>
              <span>Self-hosted • PostgreSQL • Supabase Stack</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
