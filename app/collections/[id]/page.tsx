'use client'

import { collections } from '@/lib/data/collections'
import PythonEditor from '@/components/PythonEditor'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export default function CollectionPage({
  params,
}: {
  params: { id: string }
}) {
  const collection = collections.find(col => col.id === params.id)
  
  if (!collection) {
    notFound()
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link href="/">
          <Button variant="outline" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Back to Collections
          </Button>
        </Link>
      </div>
      <PythonEditor collectionId={params.id} />
    </div>
  )
} 