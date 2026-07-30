import { Shield, Truck, Droplet, Wrench, Clock, CheckCircle2 } from 'lucide-react'

export default function ServicesPage() {
  const services = [
    {
      title: 'Residential Water Purification',
      description: 'Custom installation of under-sink Reverse Osmosis (RO) and whole-home water softening systems to protect your family and plumbing.',
      icon: <Shield className="w-8 h-8 text-sky-500" />,
      features: ['Water hardness testing', 'Professional installation', 'Annual filter replacements']
    },
    {
      title: 'Scheduled Water Delivery',
      description: 'Regular doorstep delivery of pristine 19L mineral-balanced drinking water bottles and 500ml bulk packs for homes and offices.',
      icon: <Truck className="w-8 h-8 text-sky-500" />,
      features: ['Flexible delivery schedules', 'Reusable bottle exchange', 'Contactless drop-off']
    },
    {
      title: 'Institutional Water Systems',
      description: 'Large-scale commercial purification setups designed for schools, hospitals, restaurants, and manufacturing facilities.',
      icon: <Droplet className="w-8 h-8 text-sky-500" />,
      features: ['High-capacity filtration', 'Bacterial sterilization', 'Compliance certified']
    },
    {
      title: 'Maintenance & Repair',
      description: 'Expert servicing, sanitization, and repair for all types of water dispensers, UV sterilizers, and RO purification units.',
      icon: <Wrench className="w-8 h-8 text-sky-500" />,
      features: ['Rapid response times', 'Genuine spare parts', 'System sanitization']
    }
  ]

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-800 text-white p-8 md:p-12 rounded-3xl shadow-xl text-center space-y-4">
        <span className="bg-sky-500/30 text-sky-100 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider border border-sky-400/30">
          Professional Expertise
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold">Our Water Solutions & Services</h1>
        <p className="max-w-2xl mx-auto text-sky-100">
          From residential filtration systems to institutional water treatment and reliable bottled water delivery, Delight Water Shop provides comprehensive care.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, idx) => (
          <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition">
            <div className="space-y-4">
              <div className="bg-sky-50 p-4 rounded-2xl inline-block border border-sky-100">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{service.title}</h3>
              <p className="text-slate-600 leading-relaxed">{service.description}</p>
              <ul className="space-y-2 pt-2">
                {service.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center space-x-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-sky-600 flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Available 6 days a week</span>
              </span>
              <a 
                href="/contact" 
                className="bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold px-4 py-2 rounded-xl transition text-sm"
              >
                Book Service
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
