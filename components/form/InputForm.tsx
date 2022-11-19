import React from "react"

export default function InputForm({caption, state, setState, required=false}) {
    return (
      <div>
        <div className="flex mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {caption}{required && <p className="text-red-500 ml-1">*</p>}
        </div>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5"
          required={required}
          onChange={(e) => setState(e.target.value)}
          value={state}
          spellCheck="false"
        ></input>
      </div>
    )
}