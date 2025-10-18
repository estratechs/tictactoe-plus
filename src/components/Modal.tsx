
import { motion, AnimatePresence } from 'framer-motion'
import React from 'react'

export default function Modal({ open, onClose, children }:{
  open: boolean, onClose: () => void, children: React.ReactNode
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog" aria-modal="true"
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          className="modal-backdrop" onClick={onClose}
        >
          <motion.div
            initial={{ y:20, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:10, opacity:0 }}
            className="modal-card" onClick={e=>e.stopPropagation()}>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
