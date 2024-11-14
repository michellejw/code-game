"use client";

import React, { useState, useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Play, RotateCcw } from 'lucide-react';

// Define Pyodide types
declare global {
  interface Window {
    loadPyodide: (config: {
      indexURL: string;
      stdout?: (text: string) => void;
      stderr?: (text: string) => void;
    }) => Promise<PyodideInterface>;
  }
}

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
}

interface OutputEntry {
  type: 'input' | 'output' | 'error' | 'success';
  content: string;
}

const PythonChallenge = () => {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [output, setOutput] = useState<OutputEntry[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);

  const initialCode = `def add_numbers(a, b):
    # Your code here
    pass

# Test your function
result = add_numbers(5, 3)
print(result)`;

  const [code, setCode] = useState(initialCode);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
    script.async = true;

    script.onload = async () => {
      try {
        if (window.loadPyodide) {
          const pyodideInstance = await window.loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
            stdout: (text: string) => {
              setOutput(prev => [...prev, { type: 'output', content: text }]);
            },
            stderr: (text: string) => {
              setOutput(prev => [...prev, { type: 'error', content: text }]);
            }
          });
          setPyodide(pyodideInstance);
          setLoading(false);
        }
      } catch (err) {
        const error = err as Error;
        setOutput([{ type: 'error', content: 'Failed to load Pyodide: ' + error.message }]);
        setLoading(false);
      }
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const runCode = async () => {
    if (!pyodide || !code.trim()) return;

    setOutput([{ type: 'input', content: 'Running code...' }]);

    try {
      // First run their code to define the function
      await pyodide.runPythonAsync(code);

      // Then run validation code
      const validationCode = `
import sys
from io import StringIO

try:
    # Test cases
    test_cases = [
        (5, 3, 8),
        (10, -5, 5),
        (0, 0, 0)
    ]
    
    results = []
    for a, b, expected in test_cases:
        try:
            result = add_numbers(a, b)
            passed = result == expected
            results.append({
                'input': f'{a}, {b}',
                'expected': expected,
                'got': result,
                'passed': passed
            })
        except Exception as e:
            results.append({
                'input': f'{a}, {b}',
                'error': str(e)
            })

    # Convert results to string for output
    for r in results:
        if 'error' in r:
            print(f"Test ({r['input']}) failed with error: {r['error']}")
        else:
            print(f"Test ({r['input']}): {'✓' if r['passed'] else '✗'} Expected {r['expected']}, got {r['got']}")
    
    # Return overall success
    all_passed = all(r.get('passed', False) for r in results)
    print("\\n" + ("🎉 All tests passed!" if all_passed else "❌ Some tests failed. Keep trying!"))
    all_passed

except Exception as e:
    print(f"Error running tests: {str(e)}")
    False
`;

      const testResult = await pyodide.runPythonAsync(validationCode);

      if (testResult === true) {
        setOutput(prev => [
          ...prev,
          { type: 'success', content: "Great job! The next clue is hidden under the soap dispenser! 🧼" }
        ]);
      }
    } catch (err) {
      const error = err as Error;
      setOutput(prev => [...prev, { type: 'error', content: error.message }]);
    }
  };

  const resetEnvironment = async () => {
    if (!pyodide) return;

    setCode(initialCode);
    setOutput([]);

    try {
      await pyodide.runPythonAsync(`
        import sys
        user_modules = [m for m in sys.modules.keys() if not m.startswith('_')]
        for m in user_modules:
            del sys.modules[m]
        for key in list(globals().keys()):
            if not key.startswith('_'):
                del globals()[key]
      `);
      setOutput([{ type: 'output', content: 'Environment reset successfully!' }]);
    } catch (err) {
      const error = err as Error;
      setOutput([{ type: 'error', content: 'Error resetting environment: ' + error.message }]);
    }
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            Python Challenge
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={runCode}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Run
            </Button>
            <Button
              onClick={resetEnvironment}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            Write a function called &apos;add_numbers&apos; that takes two parameters and returns their sum.
          </AlertDescription>
        </Alert>

        {/* Code Editor */}
        <div className="space-y-2">
          <div className="font-medium text-sm text-gray-500">Your Code</div>
          <CodeMirror
            value={code}
            height="200px"
            theme={vscodeDark}
            extensions={[python()]}
            onChange={(value) => setCode(value)}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightSpecialChars: true,
              history: true,
              foldGutter: true,
              drawSelection: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              syntaxHighlighting: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              rectangularSelection: true,
              crosshairCursor: true,
              highlightActiveLine: true,
              highlightSelectionMatches: true,
              closeBracketsKeymap: true,
              defaultKeymap: true,
              searchKeymap: true,
              historyKeymap: true,
              foldKeymap: true,
              completionKeymap: true,
              lintKeymap: true,
            }}
          />
        </div>

        {/* Output Section */}
        <div className="space-y-2">
          <div className="font-medium text-sm text-gray-500">Output</div>
          <div
            ref={outputRef}
            className="h-48 p-4 bg-gray-900 rounded-md overflow-y-auto font-mono"
          >
            {loading ? (
              <div className="text-blue-400">Loading Python environment...</div>
            ) : (
              <div className="space-y-1 text-sm">
                {output.map((entry, i) => (
                  <div
                    key={i}
                    className={
                      entry.type === 'input' ? 'text-white' :
                      entry.type === 'error' ? 'text-red-400' :
                      entry.type === 'success' ? 'text-yellow-400 font-bold' :
                      'text-green-400'
                    }
                  >
                    {entry.content}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PythonChallenge;