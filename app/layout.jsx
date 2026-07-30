import './globals.css'

export const metadata = {
  title: 'Delight Water Shop | Pure & Safe Drinking Water Solutions',
  description: 'High-quality water purification systems, bottled water, dispensers, and maintenance services.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-water-50 text-slate-800">
        {children}
      </body>
    </html>
  )
}
