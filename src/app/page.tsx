import PythonEditor from '@/components/PythonEditor'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  weight: ['400', '700'], // include the weights you need
  subsets: ['latin'],
})

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <h1
          className={`text-4xl font-bold text-black-600 text-center mb-6 ${poppins.className}`}
        >
          Python Treasure Hunt! 🗺️
        </h1>
        <PythonEditor />
      </div>
    </main>
  )
}
