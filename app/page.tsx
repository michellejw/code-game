'use client'

import { collections } from '@/lib/data/collections'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 pt-8">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to the Code Challenge Scavenger Hunt
        </h1>
        <p className="text-lg mb-4">
          Choose a collection to start solving coding challenges!
        </p>
        <div className="flex flex-col gap-2 items-center">
          {collections.map((collection) => (
            <Link key={collection.id} href={`/collections/${collection.id}`}>
              <Button className="text-sm">{collection.name}</Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
