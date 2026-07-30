'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Droplet, ShieldCheck, Truck, Phone, ShoppingCart, Search, CheckCircle } from 'lucide-react'

export default function Home() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Delight Pure Drinking Water (19L Dispenser Bottle)', price: 3.50, category: 'Bottled Water', image: '💧', in_stock: true },
    { id: 2, name: 'Advanced Reverse Osmosis (RO) Purification System', price: 299.00, category: 'Purification Systems', image: '⚙️', in_stock: true },
    { id: 3, name: 'Hot & Cold Water Dispenser (Stainless Steel)', price: 145.00, category: 'Dispensers', image: '🧊', in_stock: true },
    { id: 4, name: 'UV Water Sterilizer Lamp Replacement', price: 45.00, category: 'Accessories', image: '💡', in_stock: true },
    { id: 5, name: 'Alkaline Mineral Filter Cartridge', price: 35.00, category: 'Accessories', image: '🧪', in_stock: true },
    { id: 6, name: 'Delight 500ml Bottled Water (Pack of 24)', price: 8.99, category: 'Bottled Water', image: '📦', in_stock: true },
  ])
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)

  const addToCart = (product) => {
    setCart([...cart, product])
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-sky-500 text-white p-2 rounded-xl shadow-md">
              <Droplet className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
              Delight Water Shop
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center text-sm text-slate-600 space-x-1">
              <Phone className="w-4 h-4 text-sky-500" />
              <span>Support: +1 (480) 345-2427</span>
            </div>
            <div className="relative bg-sky-50 px-4 py-2 rounded-xl border border-sky-100 flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-sky-600" />
              <span className="font-semibold text-sky-900">{cart.length} items</span>
              <span className="text-sky-600 font-bold">${cartTotal}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-sky-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <span className="bg-sky-500/30 text-sky-100 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider border border-sky-400/30">
            Pure & Safe Hydration Solutions
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Refresh Your Life with Pure Water
          </h1>
          <p className="max-w-2xl mx-auto text-sky-100 text-lg">
            Providing high-efficiency water purification systems, dispensers, and pristine bottled water for homes and institutions.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <a href="#catalog" className="bg-white text-sky-700 font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-sky-50 transition">
              Shop Products
            </a>
            <a href="#features" className="bg-sky-700/60 text-white border border-sky-400 font-semibold px-6 py-3 rounded-xl hover:bg-sky-700 transition">
              Our Services
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start space-x-4 p-4 rounded-xl bg-sky-50/50">
            <div className="bg-sky-500 text-white p-3 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">100% Certified Pure</h3>
              <p className="text-sm text-slate-600">Advanced multi-stage purification removing all contaminants and heavy metals.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-4 rounded-xl bg-sky-50/50">
            <div className="bg-sky-500 text-white p-3 rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Fast Home Delivery</h3>
              <p className="text-sm text-slate-600">Reliable scheduled delivery for bottled water and replacement filters right to your door.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-4 rounded-xl bg-sky-50/50">
            <div className="bg-sky-500 text-white p-3 rounded-xl">
              <Droplet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Institution Solutions</h3>
              <p className="text-sm text-slate-600">Custom water treatment systems installed for schools, hospitals, and factories.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog & Search */}
      <main id="catalog" className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold text-slate-900">Our Water Solutions Catalog</h2>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col justify-between hover:shadow-md transition">
              <div className="p-6 text-center bg-sky-50/30 text-5xl py-12">
                {product.image}
              </div>
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">{product.category}</span>
                  <h3 className="font-bold text-slate-900 mt-1 text-lg">{product.name}</h3>
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                  <span className="text-2xl font-extrabold text-slate-900">${product.price.toFixed(2)}</span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-4 py-2 rounded-xl transition shadow-sm flex items-center space-x-1"
                  >
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Simulation */}
        {cart.length > 0 && (
          <div className="mt-12 bg-white p-6 rounded-2xl shadow-lg border border-sky-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Ready to complete your order?</h3>
              <p className="text-slate-600 text-sm">Total items: {cart.length} | Amount: ${cartTotal}</p>
            </div>
            <button 
              onClick={() => { setOrderPlaced(true); setCart([]); }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl transition shadow-md flex items-center space-x-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Checkout Now</span>
            </button>
          </div>
        )}

        {orderPlaced && (
          <div className="mt-6 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-center font-medium">
            🎉 Order successfully placed! Thank you for choosing Delight Water Shop. We will contact you shortly regarding delivery.
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-white mb-4">
              <Droplet className="w-5 h-5 text-sky-400" />
              <span className="font-bold text-lg">Delight Water Shop</span>
            </div>
            <p className="text-sm">Providing pristine drinking water and modern purification systems since inception.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact Us</h4>
            <p className="text-sm">3631 S Vista Pl, Chandler, AZ</p>
            <p className="text-sm">Phone: +1 (480) 345-2427</p>
            <p className="text-sm">Email: support@delightwatershop.local</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Self-Hosted Supabase</h4>
            <p className="text-sm">Backed by self-hosted PostgreSQL, Kong API Gateway, and Supabase Auth & Storage.</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-slate-800 text-center text-xs">
          © {new Date().getFullYear()} Delight Water Shop. All rights reserved. Self-hosted with Supabase.
        </div>
      </footer>
    </div>
  )
}
