import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import React, { Fragment } from "react";
<<<<<<< HEAD
import { t } from "../../utils/Translation"
=======
>>>>>>> parent of d4a7aab (Add: CloudFlare Pages対応)

export default function SelectMenu({
  caption,
  state,
  setState,
  object,
  batch = false,
  required = false,
}: any) {
<<<<<<< HEAD

=======
>>>>>>> parent of d4a7aab (Add: CloudFlare Pages対応)
  return (
    <div className="w-full">
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
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
      </label>
      <Listbox value={state} onChange={setState}>
        <div className="relative mt-1">
          <Listbox.Button className="outline-none relative w-full cursor-default rounded-lg bg-gray-50 py-2 pl-3 pr-10 text-left border border-gray-300  dark:border-slate-600 dark:bg-slate-800 dark:text-white">
            <span className="block truncate">{state?.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:border dark:border-slate-600 dark:bg-slate-800">
              {object.map((model, modelIdx) => (
                <Listbox.Option
                  key={modelIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 text-gray-900 ${
                      active ? "bg-sky-100 dark:bg-slate-700" : ""
                    }`
                  }
                  value={model}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate dark:text-white ${
                          selected ? "font-medium " : "font-normal"
                        }`}
                      >
                        {model.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
