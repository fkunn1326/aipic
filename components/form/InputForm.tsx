import React from "react";
import { useTranslation } from 'next-i18next'

export default function InputForm({
  caption,
  state,
  setState,
  batch = false,
  required = false,
}: any) {
  const { t } = useTranslation('common')

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
            {t('InputFormComponent.BatchInput','一括入力')}
          </button>
        )}
      </div>
      <input
        className="border border-gray-300 text-gray-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white sm:text-sm rounded-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-sky-500 w-full p-2.5"
        required={required}
        onChange={(e) => setState(e.target.value)}
        value={state}
        spellCheck="false"
      ></input>
    </div>
  );
}
