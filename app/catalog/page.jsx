'use client'

import { useState } from 'react'
import { Search, ShoppingCart, CheckCircle, Droplet, Settings, Refrigerator, Lightbulb, Filter, Package } from 'lucide-react'

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Pure Drinking Water – 19L Dispenser Bottle', price: 3.50, category: 'Bottled Water', Icon: Droplet, description: 'Reusable 19L bottle, mineral-balanced, TDS 80-120. Exchange program available.' },
  { id: 2, name: 'RO Purification System – 5 Stage', price: 299.00, category: 'Purification Systems', Icon: Settings, description: 'Under-sink RO with sediment, carbon, RO membrane, alkaline filter and UV option.' },
  { id: 3, name: 'Hot & Cold Dispenser – Stainless', price: 145.00, category: 'Dispensers', Icon: Refrigerator, description: 'Floor-standing, 2 taps, 5L hot / 3L cold tank, child lock.' },
  { id: 4, name: 'UV Sterilizer Lamp – 11W', price: 45.00, category: 'Accessories', Icon: Lightbulb, description: 'Replacement UV lamp, 9000h life, compatible with most RO systems.' },
  { id: 5, name: 'Alkaline Filter Cartridge', price: 35.00, category: 'Accessories', Icon: Filter, description: 'Increases pH to 8-9, adds minerals. 6-month lifespan.' },
  { id: 6, name: 'Bottled Water 500ml – Pack of 24', price: 8.99, category: 'Bottled Water', Icon: Package, description: 'Single-use 500ml bottles for events and offices. Recyclable PET.' },
]

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [cart, setCart] = useState([])
  const [notification, setNotification] = useState('')

  const categories = ['All', 'Bottled Water', 'Purification Systems', 'Dispensers', 'Accessories']

  const filteredProducts = INITIAL_PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (product) => {
    setCart([...cart, product])
    setNotification(`Added "${product.name}"`)
    setTimeout(() => setNotification(''), 3000)
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[18px] font-semibold text-slate-900">Products</h1>
          <p className="text-[13px] text-slate-500 mt-1">Inventory for residential and commercial clients. Prices ex-install.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-2.5 rounded-lg text-[12px] font-medium">
            <ShoppingCart className="w-4 h-4" />
            <span>{cart.length} • ${cartTotal}</span>
          </div>
        </div>
      </div>

      {notification && (
        <div className="bg-white border border-slate-200 text-slate-800 px-4 py-3 rounded-lg text-[13px] flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-lg text-[13px] font-medium border transition ${selectedCategory === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid - flat, professional */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white border border-slate-200 rounded-xl flex flex-col">
            <div className="h-36 border-b border-slate-100 flex items-center justify-center bg-slate-50">
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                <product.Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1 gap-3">
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{product.category}</span>
                <h3 className="text-[14px] font-semibold text-slate-900 leading-5">{product.name}</h3>
                <p className="text-[12px] leading-5 text-slate-600">{product.description}</p>
              </div>
              <div className="mt-auto pt-4 flex items-center justify-between">
                <span className="text-[15px] font-semibold text-slate-900">${product.price.toFixed(2)}</span>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 text-[12px] font-medium px-3 py-2 rounded-lg flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl py-16 text-center">
          <p className="text-[14px] text-slate-500">No products found.</p>
        </div>
      )}
    </div>
  )
}
