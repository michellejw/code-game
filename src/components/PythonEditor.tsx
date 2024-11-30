'use client'

import React, { useState, useEffect, useRef } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Play, HelpCircle, Home } from 'lucide-react'
import { challenges } from '@/lib/data/challenges/index'
import CodeEntryDialog from '@/components/CodeEntryDialog'
import { getClueById } from '@/lib/data/clueUtils'
import { collections } from '@/lib/data/collections/index'
import '@/../app/globals.css'
import Link from 'next/link'

// Extend the Window interface to include Pyodide loader
// This allows TypeScript to recognize the loadPyodide function that gets injected by the Pyodide script
declare global {
  interface Window {
    // Define the loadPyodide function that takes a config object and returns a Promise of PyodideInterface
    loadPyodide: (config: {
      indexURL: string // URL where Pyodide files are hosted
      stdout?: (text: string) => void // Optional handler for standard output
      stderr?: (text: string) => void // Optional handler for error output
    }) => Promise<PyodideInterface>
  }
}

// Define interfaces for Pyodide JavaScript bridge
interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>
  _module: {
    stdout: (text: string) => void
    stderr: (text: string) => void
  }
}

// Define types for code output entries
interface OutputEntry {
  type: 'input' | 'output' | 'error' | 'success'
  content: string
}

// Props interface for PythonEditor component
interface PythonEditorProps {
  collectionId: string
}

// Main PythonEditor component
const PythonEditor: React.FC<PythonEditorProps> = ({ collectionId }) => {
  // State management for Pyodide instance and loading
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null)
  const [loading, setLoading] = useState(true)

  // State for code execution and output
  const [output, setOutput] = useState<OutputEntry[]>([])
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [code, setCode] = useState(challenges[0].initialCode)

  // UI state management
  const [showCodeEntry, setShowCodeEntry] = useState(false)
  const [codeSuccess, setCodeSuccess] = useState(false)
  const [showClue, setShowClue] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [codeError, setCodeError] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  // Refs for DOM and output tracking
  const outputRef = useRef<HTMLDivElement>(null)
  const currentOutputRef = useRef('')

  // Get current collection data
  const currentCollection = collections.find((col) => col.id === collectionId)

  if (!currentCollection) {
    return <div>Collection not found</div>
  }

  // Initialize Pyodide on component mount
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'
    script.async = true

    script.onload = async () => {
      try {
        if (window.loadPyodide) {
          const pyodideInstance = await window.loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
            stdout: (text: string) => {
              currentOutputRef.current = text
              setOutput((prev) => [...prev, { type: 'output', content: text }])
            },
            stderr: (text: string) => {
              setOutput((prev) => [...prev, { type: 'error', content: text }])
            },
          })
          setPyodide(pyodideInstance)
          setLoading(false)
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error'
        setOutput([
          { type: 'error', content: 'Failed to load Pyodide: ' + errorMessage },
        ])
        setLoading(false)
      }
    }

    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  // Reset state when challenge changes
  useEffect(() => {
    setCode(challenges[currentChallenge].initialCode)
    setOutput([])
    setCodeSuccess(false)
    setShowHint(false)
    currentOutputRef.current = ''
  }, [currentChallenge])

  // Handle code execution
  const runCode = async () => {
    if (!pyodide || !code.trim()) return

    const challenge = challenges[currentChallenge]
    console.log('Starting code execution with:', code)
    setOutput([{ type: 'input', content: 'Running your code...' }])
    setShowClue(false)
    setShowHint(false)
    currentOutputRef.current = ''

    try {
      await pyodide.runPythonAsync(code)
      console.log('Code execution complete, output:', currentOutputRef.current)

      // Check if required code is present
      if (challenge.requiredCode && !code.includes(challenge.requiredCode)) {
        setOutput((prev) => [
          ...prev,
          {
            type: 'error',
            content: "Don't forget to use print to make the computer talk!",
          },
        ])
        return
      }

      console.log(
        'Attempting validation with output:',
        currentOutputRef.current
      )
      const isValid = challenge.validateOutput(currentOutputRef.current)
      console.log('Validation result:', isValid)

      // Handle successful code execution
      if (isValid) {
        const clue = getClueById(challenges[currentChallenge].clueId)
        setOutput((prev) => [
          ...prev,
          { type: 'success', content: '🎉 Great job!' },
          { type: 'output', content: '-------' },
          { type: 'output', content: clue?.clue || 'No clue available.' },
        ])
        setCodeSuccess(true)
        setShowClue(true)
      } else {
        setOutput((prev) => [
          ...prev,
          {
            type: 'error',
            content:
              "That's not quite right. Want to try again? Click the hint button if you need help! 🤔",
          },
        ])
        setShowHint(true)
      }
    } catch (error) {
      console.error('Code execution error:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Oops! Something's not quite right. Want to try again? 🎈"

      setOutput((prev) => [
        ...prev,
        {
          type: 'error',
          content: errorMessage,
        },
      ])
      setShowHint(true)
    }
  }

  // Handle unlock code submission
  const handleCodeSubmit = (code: string) => {
    if (code === challenges[currentChallenge].unlockCode) {
      setCodeError(false)
      if (currentChallenge < challenges.length - 1) {
        setCurrentChallenge((prev) => prev + 1)
        setShowCodeEntry(false)
      } else {
        setIsCompleted(true)
        setShowCodeEntry(false)
      }
    } else {
      setCodeError(true)
    }
  }

  // UI handlers
  const handleShowClue = () => {
    setShowCodeEntry(true)
  }

  const handleShowHint = () => {
    const challenge = challenges[currentChallenge]
    if (challenge.hint) {
      setOutput((prev) => [
        ...prev,
        { type: 'success', content: '💡 Hint: ' + challenge.hint },
      ])
    }
  }

  // Render completion screen
  if (isCompleted) {
    const finalClue = getClueById(challenges[challenges.length - 1].clueId)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8 text-center space-y-6">
            <h1 className="text-4xl font-bold mb-4">🎉 Congratulations! 🎉</h1>
            <p className="text-2xl">You have solved all the code puzzles!</p>
            <p className="text-xl font-medium text-purple-600">
              {finalClue?.clue || 'No final prize location available.'}
            </p>
            <Link href="/">
              <Button className="mt-6 bg-green-500 hover:bg-green-600 text-lg flex items-center gap-2">
                <Home className="h-4 w-4" />
                Try Another Collection
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main editor UI
  return (
    <>
      {currentCollection && (
        <div>
          <h2 className="text-2xl font-bold">{currentCollection.name}</h2>
          <p className="text-lg">{currentCollection.description}</p>
        </div>
      )}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {challenges[currentChallenge].title}
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription className="text-lg">
              {challenges[currentChallenge].description}
            </AlertDescription>
          </Alert>

          <CodeMirror
            value={code}
            height="100px"
            theme={vscodeDark}
            extensions={[python()]}
            onChange={(value) => setCode(value)}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              syntaxHighlighting: true,
              bracketMatching: true,
              autocompletion: false,
              defaultKeymap: true,
            }}
          />

          <div className="flex gap-2">
            {showHint && (
              <Button
                onClick={handleShowHint}
                variant="outline"
                className="flex items-center gap-2"
              >
                <HelpCircle className="h-4 w-4" />
                Need a hint?
              </Button>
            )}
            <Button
              onClick={runCode}
              disabled={loading}
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-lg"
            >
              <Play className="h-4 w-4" />
              Run My Code!
            </Button>
          </div>

          <div className="space-y-4">
            <div
              ref={outputRef}
              className="p-4 bg-gray-900 rounded-md font-mono text-lg"
            >
              {output.map((entry, i) => (
                <div
                  key={i}
                  className={
                    entry.type === 'error'
                      ? 'text-red-400'
                      : entry.type === 'success'
                        ? 'text-yellow-400 font-bold'
                        : 'text-green-400'
                  }
                >
                  {entry.content}
                </div>
              ))}
            </div>

            {showClue && (
              <Button
                onClick={handleShowClue}
                className="w-full bg-green-500 hover:bg-green-600 text-lg"
              >
                Enter the secret code! 🔓
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <CodeEntryDialog
        isOpen={showCodeEntry && codeSuccess}
        hasError={codeError}
        onCodeSubmit={handleCodeSubmit}
      />
    </>
  )
}

export default PythonEditor
