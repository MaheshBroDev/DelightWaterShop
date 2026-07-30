import './globals.css'
import Link from 'next/link'
import { Droplet, Phone } from 'lucide-react'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-water-50 text-slate-800 min-h-screen flex flex-col">
        {/* Navigation Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-sky-100">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="bg-sky-500 text-white p-2.5 rounded-2xl shadow-md">
                <Droplet className="w-6 h-6" />
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
                Delight Water Shop
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8 font-medium text-slate-600">
              <Link href="/" className="hover:text-sky-600 transition">Home</Link>
              <Link href="/catalog" className="hover:text-sky-600 transition">Catalog</Link>
              <Link href="/services" className="hover:text-sky-600 transition">Services</Link>
              <Link href="/contact" className="hover:text-sky-600 transition">Contact</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center text-sm text-slate-600 space-x-1.5 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-100">
                <Phone className="w-4 h-4 text-sky-500" />
                <span>+1 (480) 345-2427</span>
              </div>
              <Link 
                href="/catalog" 
                className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm transition"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-12 mt-16 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center space-x-2 text-white">
                <div className="bg-sky-500 p-2 rounded-xl text-white">
                  <Droplet className="w-4 h-4" />
                </div>
                <span className="font-bold text-lg">Delight Water Shop</span>
              </div>
              <p className="text-sm text-slate-400">Providing pristine drinking water and modern purification systems since inception.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-sky-400 transition">Home</Link></li>
                <li><Link href="/catalog" className="hover:text-sky-400 transition">Product Catalog</Link></li>
                <li><Link href="/services" className="hover:text-sky-400 transition">Our Services</Link></li>
                <li><Link href="/contact" className="hover:text-sky-400 transition">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Contact Us</h4>
              <p className="text-sm">3631 S Vista Pl, Chandler, AZ</p>
              <p className="text-sm mt-1">Phone: +1 (480) 345-2427</p>
              <p className="text-sm mt-1">Email: support@delightwatershop.local</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Self-Hosted Supabase</h4>
              <p className="text-sm">Backed by self-hosted PostgreSQL, Kong API Gateway, and Supabase Auth & Storage.</p>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Delight Water Shop. All rights reserved. Self-hosted with Supabase.
          </div>
        </footer>
      </body>
    </html>
  )
}
