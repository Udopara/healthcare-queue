import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  maxWidth = 'max-w-md'
}) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null


  return (
    <div
      className="fixed inset-0 bg-gray-900/75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
    >
      <div
        className={`relative bg-white rounded-xl shadow-xl ${maxWidth} w-full p-6 transform transition-all`}
      >
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

