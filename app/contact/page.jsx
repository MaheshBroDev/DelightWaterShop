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
    <div className="space-y-8 max-w-5xl">
      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <h1 className="text-[20px] font-semibold text-slate-900">Contact</h1>
        <p className="text-[13px] text-slate-600 mt-2 leading-6 max-w-2xl">
          Questions about pricing, installation or delivery schedule? Send us a message. We reply within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Info - flat */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div>
            <h3 className="text-[14px] font-semibold text-slate-900">Delight Water Shop</h3>
            <p className="text-[12px] text-slate-500 mt-1 leading-5">3631 S Vista Pl, Chandler, AZ 85248</p>
          </div>
          <div className="space-y-4 text-[13px]">
            <div className="flex gap-3">
              <MapPin className="w-4 h-4 text-slate-700 mt-0.5" />
              <div className="leading-5"><span className="font-medium text-slate-900 block text-[12px]">Office</span><span className="text-slate-600">Chandler, AZ – By appointment</span></div>
            </div>
            <div className="flex gap-3">
              <Phone className="w-4 h-4 text-slate-700 mt-0.5" />
              <div className="leading-5"><span className="font-medium text-slate-900 block text-[12px]">Phone</span><span className="text-slate-600">+1 (480) 345-2427</span></div>
            </div>
            <div className="flex gap-3">
              <Mail className="w-4 h-4 text-slate-700 mt-0.5" />
              <div className="leading-5"><span className="font-medium text-slate-900 block text-[12px]">Email</span><span className="text-slate-600">support@delightwatershop.local</span></div>
            </div>
            <div className="flex gap-3">
              <Clock className="w-4 h-4 text-slate-700 mt-0.5" />
              <div className="leading-5"><span className="font-medium text-slate-900 block text-[12px]">Hours</span><span className="text-slate-600">Mon–Fri 9AM–5PM, Sat 9AM–1PM</span></div>
            </div>
          </div>
        </div>

        {/* Form - simple */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 lg:col-span-2">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-[15px] font-semibold text-slate-900">Message sent</h3>
              <p className="text-[13px] text-slate-600 max-w-md mx-auto leading-6">We will contact you within 24 hours. For urgent service call +1 (480) 345-2427.</p>
              <button onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', service: 'Bottled Water Delivery', message: '' }) }} className="mt-2 text-[13px] font-medium border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50">New message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-slate-700 mb-1.5">Name</label>
                  <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Full name" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-slate-700 mb-1.5">Email</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="you@company.com" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-slate-700 mb-1.5">Phone</label>
                  <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 (480) 000-0000" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-slate-700 mb-1.5">Service</label>
                  <select value={formData.service} onChange={e => setFormData({ ...formData, service: e.target.value })} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-slate-900">
                    <option>Bottled Water Delivery</option>
                    <option>RO Purification System</option>
                    <option>Dispenser</option>
                    <option>Maintenance & Repair</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-slate-700 mb-1.5">Message</label>
                <textarea required rows={4} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder="Describe your requirement, address and preferred timing..." className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-slate-900" />
              </div>
              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-medium py-3 rounded-lg flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
