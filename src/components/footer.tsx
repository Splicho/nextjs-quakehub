import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-background text-foreground py-4 border-t">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} QuakeHub. API provided by <Link href="https://quakelist.net" target="_blank" className="underline text-primary hover:text-primary/70 transition-colors">Quakelist</Link> | Built by <Link href="https://github.com/splicho" target="_blank" className="underline text-primary hover:text-primary/70 transition-colors">isevendeuce</Link> using Next.js and TailwindCSS</p>
      </div>
    </footer>
  )
}
