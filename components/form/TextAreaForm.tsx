import React from "react"

export default function TextAreaForm({caption, state, setState, batch=false, required=false}: any) {
    const handleChange = (e) => {
        setState(e.target.value);
    };

    return (
      <div>
        <div className="flex mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {caption}{required && <p className="text-red-500 ml-1">*</p>}{batch && <button type="button" className="text-sky-500 ml-2" onClick={() => {batch(state)}}>一括入力</button>}
        </div>
        <textarea
          className="bg-gray-50 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block h-32 w-full p-2.5 resize-none"
          id="prompt"
          onChange={(e) => {
            handleChange(e);
          }}
          required={required}
          value={state}
          spellCheck="false"
        ></textarea>
      </div>
    )
}