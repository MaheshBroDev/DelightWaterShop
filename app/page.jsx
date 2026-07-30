import Link from 'next/link'
import { Droplet, ShoppingCart, Sparkles, Shield, Truck, Phone, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-sky-600 via-sky-700 to-blue-800 text-white rounded-3xl p-8 md:p-16 shadow-xl">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Droplet className="w-96 h-96" />
        </div>
        <div className="max-w-2xl space-y-6 relative z-10">
          <span className="inline-flex items-center space-x-2 bg-sky-500/30 text-sky-100 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider border border-sky-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pure & Safe Hydration Solutions</span>
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Refresh Your Life with Pure Water
          </h1>
          <p className="text-sky-100 text-lg leading-relaxed">
            Providing high-efficiency water purification systems, smart dispensers, and pristine bottled water for homes, offices, and institutions.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link 
              href="/catalog" 
              className="bg-white text-sky-700 font-semibold px-6 py-3.5 rounded-xl shadow-lg hover:bg-sky-50 transition flex items-center space-x-2"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/services" 
              className="bg-sky-700/60 text-white border border-sky-400 font-semibold px-6 py-3.5 rounded-xl hover:bg-sky-700 transition"
            >
              Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-4">
          <div className="bg-sky-500 text-white p-3 rounded-xl shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">100% Certified Pure</h3>
            <p className="text-sm text-slate-600 mt-1">Advanced multi-stage purification removing all contaminants, bacteria, and heavy metals.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-4">
          <div className="bg-sky-500 text-white p-3 rounded-xl shadow-md">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Fast Home Delivery</h3>
            <p className="text-sm text-slate-600 mt-1">Reliable scheduled delivery for bottled water and replacement filters right to your doorstep.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-4">
          <div className="bg-sky-500 text-white p-3 rounded-xl shadow-md">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Institution Solutions</h3>
            <p className="text-sm text-slate-600 mt-1">Custom water treatment systems installed and maintained for schools, hospitals, and factories.</p>
          </div>
        </div>
      </section>

      {/* Featured Banner */}
      <section className="bg-gradient-to-br from-slate-900 to-sky-950 text-white rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        <div className="space-y-4 max-w-xl">
          <span className="text-sky-400 font-semibold text-sm uppercase tracking-wider">Special Offer</span>
          <h2 className="text-3xl md:text-4xl font-bold">Get Your First Month of Water Delivery Free!</h2>
          <p className="text-slate-300">Sign up for our regular 19L dispenser bottle subscription and receive a complimentary premium water pump.</p>
          <Link 
            href="/catalog" 
            className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-xl transition shadow-md"
          >
            Claim Offer Now
          </Link>
        </div>
        <div className="text-8xl p-8 bg-sky-900/40 rounded-3xl border border-sky-800/50">
          💧
        </div>
      </section>
    </div>
  )
}
