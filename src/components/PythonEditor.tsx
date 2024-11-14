'use client'

import React, { useState, useEffect, useRef } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Play } from 'lucide-react'
import { challenges } from '@/lib/challenges'
import CodeEntryDialog from '@/components/CodeEntryDialog'

declare global {
  interface Window {
    loadPyodide: (config: {
      indexURL: string
      stdout?: (text: string) => void
      stderr?: (text: string) => void
    }) => Promise<PyodideInterface>
  }
}

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>
}

interface OutputEntry {
  type: 'input' | 'output' | 'error' | 'success'
  content: string
}

const KidPythonChallenge: React.FC = () => {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null)
  const [loading, setLoading] = useState(true)
  const [output, setOutput] = useState<OutputEntry[]>([])
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [code, setCode] = useState(challenges[0].initialCode)
  const [showCodeEntry, setShowCodeEntry] = useState(false)
  const [codeSuccess, setCodeSuccess] = useState(false)
  const [showClue, setShowClue] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)
  const [codeError, setCodeError] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

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

  useEffect(() => {
    setCode(challenges[currentChallenge].initialCode)
    setOutput([])
    setCodeSuccess(false)
  }, [currentChallenge])

  const runCode = async () => {
    if (!pyodide || !code.trim()) return

    const challenge = challenges[currentChallenge]
    console.log('Starting challenge:', challenge) // Debug log
    setOutput([{ type: 'input', content: 'Running your code...' }])
    setShowClue(false)

    try {
      await pyodide.runPythonAsync(code)
      console.log('Code ran successfully') // Debug log

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

      setOutput((prev) => [
        ...prev,
        { type: 'output', content: '-------' },
        { type: 'output', content: challenges[currentChallenge].nextClue },
      ])

      console.log('Setting code success and show clue') // Debug log
      setCodeSuccess(true)
      setShowClue(true)
    } catch (error) {
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
    }
  }

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

  const handleShowClue = () => {
    setShowCodeEntry(true)
  }

  if (isCompleted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8 text-center space-y-6">
            <h1 className="text-4xl font-bold mb-4">🎉 Congratulations! 🎉</h1>
            <p className="text-2xl">You have solved all the code puzzles!</p>
            <p className="text-xl font-medium text-purple-600">
              {challenges[challenges.length - 1].finalPrizeLocation}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {challenges[currentChallenge].title}
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
            <Button
              onClick={runCode}
              disabled={loading}
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600"
            >
              <Play className="h-4 w-4" />
              Run My Code!
            </Button>
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

          <div className="space-y-4">
            <div
              ref={outputRef}
              className="h-32 p-4 bg-gray-900 rounded-md overflow-y-auto font-mono text-lg"
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
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Show Next Clue! 🎯
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

export default KidPythonChallenge
