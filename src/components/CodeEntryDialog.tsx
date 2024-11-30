import React from 'react'
import { Dialog } from '@headlessui/react'
import { Button } from '@/components/ui/button'

interface CodeEntryDialogProps {
  isOpen: boolean
  hasError: boolean
  onCodeSubmit: (code: string) => void
  successMessage?: string
  onContinue?: () => void
}

const CodeEntryDialog: React.FC<CodeEntryDialogProps> = ({
  isOpen,
  hasError,
  onCodeSubmit,
  successMessage,
  onContinue,
}) => {
  const [code, setCode] = React.useState('')

  const handleSubmit = () => {
    onCodeSubmit(code)
  }
  // Effect to clear code input when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setCode('')
    }
  }, [isOpen])

  // If we have a success message, show only that and the continue button
  if (successMessage) {
    return (
      <Dialog open={isOpen} onClose={() => {}}>
        <div className="fixed inset-0 bg-black bg-opacity-30" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="bg-white rounded p-6">
            <Dialog.Title>Success!</Dialog.Title>
            <div className="mt-4">
              <p className="text-green-500">{successMessage}</p>
              <Button onClick={onContinue} className="mt-2 bg-blue-500 hover:bg-blue-600">
                Continue to Next Challenge
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onClose={() => {}}>
      <div className="fixed inset-0 bg-black bg-opacity-30" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white rounded p-6">
          <Dialog.Title>Enter Secret Code</Dialog.Title>
          <input
            type="text"
            value={code.toUpperCase()}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="border p-2 w-full"
          />
          <div className="mt-2">
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
          {hasError && <p className="text-red-500">Incorrect code, please try again.</p>}
          {successMessage && (
            <div className="mt-4">
              <p className="text-green-500">{successMessage}</p>
              <Button onClick={onContinue} className="mt-2 bg-blue-500 hover:bg-blue-600">
                Continue to Next Challenge
              </Button>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default CodeEntryDialog
