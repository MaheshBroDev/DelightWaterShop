import Link from 'next/link'
import { Droplet, ShieldCheck, Truck, Wrench, ArrowRight, Check } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero - flat, professional, no 3D */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center bg-white border border-slate-200 rounded-xl p-8 md:p-12">
        <div className="lg:col-span-3 space-y-6">
          <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-100 text-sky-700 text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Serving Chandler, AZ since 2010
          </div>
          <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-slate-900 leading-[1.1]">
            Reliable water purification and delivery for homes and businesses
          </h1>
          <p className="text-[15px] leading-7 text-slate-600 max-w-2xl">
            Delight Water Shop provides certified RO systems, stainless-steel hot & cold dispensers, and scheduled 19L bottled water delivery. Installation, maintenance and filter replacement included.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/catalog" className="inline-flex items-center gap-2 bg-slate-900 text-white text-[14px] font-medium px-5 py-3 rounded-lg hover:bg-slate-800">
              Browse Products <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-[14px] font-medium px-5 py-3 rounded-lg hover:bg-slate-50">
              Get a Quote
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-6 pt-4 text-[13px] text-slate-600">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Certified technicians</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Same-week installation</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Filter subscription</span>
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
          <h3 className="text-[13px] font-semibold uppercase tracking-wide text-slate-700">Water Quality Report</h3>
          <div className="space-y-4">
            {[
              { label: 'TDS Removal', value: '98%' },
              { label: 'Bacteria & Virus', value: '99.9% removed' },
              { label: 'Lead & Heavy Metals', value: 'NSF Certified' },
              { label: 'Service Response', value: '< 24h' },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-[13px] border-b border-slate-200 last:border-0 pb-3 last:pb-0">
                <span className="text-slate-500">{row.label}</span>
                <span className="font-medium text-slate-900">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="pt-2">
            <Link href="/services" className="text-[13px] font-medium text-sky-700 hover:text-sky-800">View independent lab results →</Link>
          </div>
        </div>
      </section>

      {/* Features - flat cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: ShieldCheck,
            title: 'Certified Purification',
            desc: '5-stage RO, UV sterilization and alkaline filter. NSF certified components.'
          },
          {
            icon: Truck,
            title: 'Scheduled Delivery',
            desc: '19L reusable bottles and 500ml packs. Flexible weekly/bi-weekly slots.'
          },
          {
            icon: Wrench,
            title: 'Full Service',
            desc: 'Installation, sanitization and repair for all major dispenser brands.'
          }
        ].map((f) => (
          <div key={f.title} className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="w-9 h-9 bg-slate-900 text-white rounded-lg flex items-center justify-center mb-4">
              <f.icon className="w-4 h-4" />
            </div>
            <h3 className="text-[15px] font-semibold text-slate-900 mb-1.5">{f.title}</h3>
            <p className="text-[13px] leading-6 text-slate-600">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Why Us + CTA - minimal */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-8">
          <h2 className="text-[18px] font-semibold text-slate-900 mb-6">What we handle</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-[13px]">
            <ul className="space-y-2.5 text-slate-600">
              <li className="flex gap-2"><span className="text-slate-900">•</span> Residential RO systems</li>
              <li className="flex gap-2"><span className="text-slate-900">•</span> Whole-home softeners</li>
              <li className="flex gap-2"><span className="text-slate-900">•</span> Office dispensers</li>
              <li className="flex gap-2"><span className="text-slate-900">•</span> Restaurant filtration</li>
            </ul>
            <ul className="space-y-2.5 text-slate-600">
              <li className="flex gap-2"><span className="text-slate-900">•</span> UV lamp replacement</li>
              <li className="flex gap-2"><span className="text-slate-900">•</span> Filter cartridges</li>
              <li className="flex gap-2"><span className="text-slate-900">•</span> Bottle exchange</li>
              <li className="flex gap-2"><span className="text-slate-900">•</span> Water testing</li>
            </ul>
          </div>
        </div>
        <div className="bg-slate-900 text-white rounded-xl p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-[18px] font-semibold mb-2">First month free</h2>
            <p className="text-[13px] leading-6 text-slate-300">Start a 19L subscription and get complimentary pump + free delivery for 30 days. No contract.</p>
          </div>
          <div className="mt-6 flex gap-3">
            <Link href="/catalog" className="bg-white text-slate-900 text-[13px] font-medium px-4 py-2.5 rounded-lg">Claim Offer</Link>
            <Link href="/contact" className="border border-slate-700 text-slate-200 text-[13px] font-medium px-4 py-2.5 rounded-lg hover:bg-slate-800">Talk to team</Link>
          </div>
        </div>
      </section>

      {/* Address bar */}
      <section className="border border-slate-200 bg-white rounded-xl px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[13px] text-slate-600">
        <span className="flex items-center gap-2"><Droplet className="w-4 h-4 text-sky-600" /> 3631 S Vista Pl, Chandler, AZ 85248 — Licensed & insured</span>
        <span className="text-slate-500">Mon–Fri 9am–5pm • Sat 9am–1pm</span>
      </section>
    </div>
  )
}
