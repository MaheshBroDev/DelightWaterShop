'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: 'Bottled Water Delivery', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="bg-sky-100 text-sky-700 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
          Get in Touch
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900">Contact Delight Water Shop</h1>
        <p className="max-w-xl mx-auto text-slate-600">
          Have questions about our water purification systems or want to schedule a delivery? Reach out to our team today.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Card */}
        <div className="bg-gradient-to-br from-sky-600 to-blue-800 text-white p-8 rounded-3xl shadow-xl space-y-8 lg:col-span-1">
          <div>
            <h3 className="text-xl font-bold mb-2">Contact Information</h3>
            <p className="text-sky-100 text-sm">We are here to help and answer any questions you might have.</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <MapPin className="w-6 h-6 text-sky-300 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-sm">Location</h4>
                <p className="text-sky-100 text-sm mt-0.5">3631 S Vista Pl, Chandler, AZ 85248</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Phone className="w-6 h-6 text-sky-300 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-sm">Phone</h4>
                <p className="text-sky-100 text-sm mt-0.5">+1 (480) 345-2427</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Mail className="w-6 h-6 text-sky-300 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-sm">Email</h4>
                <p className="text-sky-100 text-sm mt-0.5">support@delightwatershop.local</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Clock className="w-6 h-6 text-sky-300 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-sm">Working Hours</h4>
                <p className="text-sky-100 text-sm mt-0.5">Mon - Fri: 9:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 lg:col-span-2">
          {submitted ? (
            <div className="py-16 text-center space-y-4">
              <div className="bg-emerald-100 text-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Message Sent Successfully!</h3>
              <p className="text-slate-600 max-w-md mx-auto">
                Thank you for reaching out. One of our water specialists will get back to you within 24 hours.
              </p>
              <button 
                onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', service: 'Bottled Water Delivery', message: '' }); }}
                className="mt-4 bg-sky-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-sky-700 transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Send Us a Message</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1 (480) 000-0000"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Service Interested In</label>
                  <select 
                    value={formData.service}
                    onChange={e => setFormData({...formData, service: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Bottled Water Delivery">Bottled Water Delivery</option>
                    <option value="RO Purification System">RO Purification System</option>
                    <option value="Water Dispenser">Water Dispenser</option>
                    <option value="Institution Solution">Institution Solution</option>
                    <option value="Maintenance & Repair">Maintenance & Repair</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea 
                  rows="4"
                  required
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  placeholder="Tell us about your water requirements..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3.5 px-6 rounded-xl transition shadow-md flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
