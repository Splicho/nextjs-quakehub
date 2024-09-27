import Header from '@/components/header'
import React from 'react'

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return (  
    <div>
        <Header />
            {children}
    </div>
  )
}
