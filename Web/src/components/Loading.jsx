import React from 'react'

export const Loading = () => {
  return (
    <div className="mx-auto flex w-screen h-screen items-center justify-center">
      <button
        type="button"
        className="grid grid-cols-3 bg-indigo-500 w-40 h-11 rounded-lg text-white font-bold hover:bg-indigo-400 hover:cursor-not-allowed duration-[500ms,800ms]"
        disabled
      >
        <div className="grid-1 my-auto h-5 w-5 mx-3 border-t-transparent border-solid animate-spin rounded-full border-white border-4"></div>
        <div className="grid-2 my-auto -mx-1"> Conectando... </div>
      </button>
    </div>
  )
}
