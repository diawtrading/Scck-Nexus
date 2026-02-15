import React from 'react'

// Simple reusable modal
export default function Modal({ isOpen, title, onClose, children }) {
  if (!isOpen) return null
  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="bg-dark-card border border-dark-border rounded-xl shadow-xl max-w-2xl w-full mx-4 p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-white">Close</button>
        </div>
        <div className="text-white">{children}</div>
      </div>
    </div>
  )
}
