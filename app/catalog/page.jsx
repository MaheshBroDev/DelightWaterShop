'use client'

import { useState } from 'react'
import { Search, ShoppingCart, CheckCircle, Plus } from 'lucide-react'

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Delight Pure Drinking Water (19L Dispenser Bottle)', price: 3.50, category: 'Bottled Water', image: '💧', description: 'Pristine mineral-balanced drinking water in a reusable 19L bottle.' },
  { id: 2, name: 'Advanced Reverse Osmosis (RO) Purification System', price: 299.00, category: 'Purification Systems', image: '⚙️', description: 'High-efficiency 5-stage RO water purification system for homes.' },
  { id: 3, name: 'Hot & Cold Water Dispenser (Stainless Steel)', price: 145.00, category: 'Dispensers', image: '🧊', description: 'Floor-standing hot and cold water dispenser with stainless steel tanks.' },
  { id: 4, name: 'UV Water Sterilizer Lamp Replacement', price: 45.00, category: 'Accessories', image: '💡', description: '11W UV replacement bulb for water sterilization systems.' },
  { id: 5, name: 'Alkaline Mineral Filter Cartridge', price: 35.00, category: 'Accessories', image: '🧪', description: 'Enhances water pH and adds essential beneficial minerals.' },
  { id: 6, name: 'Delight 500ml Bottled Water (Pack of 24)', price: 8.99, category: 'Bottled Water', image: '📦', description: 'Convenient 500ml pure drinking water bottles, pack of 24.' },
]

export default function CatalogPage() {
  const [products] = useState(INITIAL_PRODUCTS)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [cart, setCart] = useState([])
  const [notification, setNotification] = useState('')

  const categories = ['All', 'Bottled Water', 'Purification Systems', 'Dispensers', 'Accessories']

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (product) => {
    setCart([...cart, product])
    setNotification(`Added "${product.name}" to cart!`)
    setTimeout(() => setNotification(''), 3000)
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)

  return (
    <div className="space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Product Catalog</h1>
          <p className="text-slate-600 text-sm mt-1">Explore our range of pristine water solutions and purification equipment.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search catalog..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl font-medium shadow-sm flex items-center space-x-2 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              selectedCategory === cat 
                ? 'bg-sky-600 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-sky-50 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col justify-between hover:shadow-md transition">
            <div className="p-6 text-center bg-sky-50/30 text-6xl py-12">
              {product.image}
            </div>
            <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
              <div>
                <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">{product.category}</span>
                <h3 className="font-bold text-slate-900 mt-1 text-lg">{product.name}</h3>
                <p className="text-slate-600 text-sm mt-2">{product.description}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-2xl font-extrabold text-slate-900">${product.price.toFixed(2)}</span>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-4 py-2.5 rounded-xl transition shadow-sm flex items-center space-x-1.5"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-500 text-lg">No products found matching your search.</p>
        </div>
      )}
    </div>
  )
}
