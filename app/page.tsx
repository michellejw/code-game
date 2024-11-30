'use client'

import { collections } from '@/lib/data/collections'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Python Challenge Collections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Link href={`/collections/${collection.id}`} key={collection.id}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle>{collection.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{collection.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}