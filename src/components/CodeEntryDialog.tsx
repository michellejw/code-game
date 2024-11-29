import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface CodeEntryDialogProps {
  isOpen: boolean
  hasError?: boolean
  onCodeSubmit: (code: string) => void
}

const CodeEntryDialog: React.FC<CodeEntryDialogProps> = ({
  isOpen,
  hasError,
  onCodeSubmit,
}) => {
  const [code, setCode] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCodeSubmit(code.toUpperCase())
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter the secret code!</DialogTitle>
          <DialogDescription>
            {hasError
              ? "That code wasn't quite right. Check the clue and try again! 🔍"
              : 'Enter the code you found from the clue'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Type the code here..."
            className={`text-center text-xl uppercase ${hasError ? 'border-red-500' : ''}`}
          />
          <Button type="submit" className="w-full">
            Submit Code
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CodeEntryDialog
