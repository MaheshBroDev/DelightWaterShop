import { ShieldCheck, Truck, Droplet, Wrench, Clock, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function ServicesPage() {
  const services = [
    {
      title: 'Residential Purification',
      description: 'Under-sink RO and whole-home softening. Hardness test, install and annual filter change.',
      icon: ShieldCheck,
      features: ['Water test included', 'Professional install', 'Annual service']
    },
    {
      title: 'Scheduled Delivery',
      description: '19L and 500ml bottled water delivered to home or office on flexible schedule.',
      icon: Truck,
      features: ['Weekly / bi-weekly', 'Reusable bottle exchange', 'Contactless drop']
    },
    {
      title: 'Commercial Systems',
      description: 'High-capacity systems for schools, hospitals, restaurants and factories.',
      icon: Droplet,
      features: ['500L–5000L/day', 'UV sterilization', 'Compliance docs']
    },
    {
      title: 'Maintenance & Repair',
      description: 'Sanitization and repair for dispensers, UV and RO units of all major brands.',
      icon: Wrench,
      features: ['<24h response', 'OEM parts', 'System sanitization']
    }
  ]

  return (
    <div className="space-y-8">
      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <h1 className="text-[20px] font-semibold text-slate-900">Services</h1>
        <p className="text-[13px] text-slate-600 mt-2 max-w-2xl leading-6">
          Complete water solutions from testing and installation to delivery and maintenance. Licensed, insured and serving Chandler and Greater Phoenix.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services.map((s, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div className="w-9 h-9 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                <s.icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium px-2 py-1 rounded bg-slate-50 border border-slate-200 text-slate-600 flex items-center gap-1">
                <Clock className="w-3 h-3" /> 6 days/week
              </span>
            </div>
            <h3 className="text-[15px] font-semibold text-slate-900 mt-4">{s.title}</h3>
            <p className="text-[13px] text-slate-600 mt-1.5 leading-6">{s.description}</p>
            <ul className="mt-4 space-y-2">
              {s.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-[12px] text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-900" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link href="/contact" className="text-[12px] font-medium text-slate-900 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 inline-block">Book Service</Link>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-[14px] font-semibold">Need a site assessment?</h3>
          <p className="text-[13px] text-slate-300 mt-1">Free TDS and hardness test for homes and offices. Report in 24h.</p>
        </div>
        <Link href="/contact" className="bg-white text-slate-900 text-[13px] font-medium px-4 py-2 rounded-lg">Schedule Visit</Link>
      </div>
    </div>
  )
}
