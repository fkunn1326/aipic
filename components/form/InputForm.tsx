import React from "react";

export default function InputForm({
  caption,
  state,
  setState,
  batch = false,
  required = false,
}: any) {
  return (
    <div>
      <div className="flex mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {caption}
        {required && <p className="text-red-500 ml-1">*</p>}
        {batch && (
          <button
            type="button"
            className="text-sky-500 ml-2"
            onClick={() => {
              batch(state);
            }}
          >
            一括入力
          </button>
        )}
      </div>
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5"
        required={required}
        onChange={(e) => setState(e.target.value)}
        value={state}
        spellCheck="false"
      ></input>
    </div>
  );
}
