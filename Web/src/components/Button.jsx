import React from 'react'

export const Button = ({ text, onClick, className, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-white bg-indigo-500 border-0 p-2 focus:outline-none hover:bg-indigo-600 rounded ${className} disabled:bg-indigo-400`}
    >
      {text}
    </button>
  )
}
