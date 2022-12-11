import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useRouter } from "next/router";
import { t } from "../utils/Translation"

export default function PopOver({ id, type }) {
  const router = useRouter();
  
  return (
    <div>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="">
            <EllipsisHorizontalIcon className="w-8 h-8" />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {type && (
              <div className="pt-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      } group flex w-full items-center px-3 py-2 text-sm`}
                      onClick={() => router.push(`/edit/${id}`)}
                    >
                      {t('PopOver.Edit','編集する')}
                    </button>
                  )}
                </Menu.Item>
              </div>
            )}
            <div className="pb-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    className={`${
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } group flex w-full items-center px-3 py-2 text-sm`}
                    href={`https://docs.google.com/forms/d/e/1FAIpQLSfTt9ODMK8b0_zJTl3XhnBbtgBKCLQWskq-QwcOHKi7vGRyKw/viewform?usp=pp_url&entry.750653281=https://www.aipic.app/artworks/${id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="報告する"
                  >
                    {t('PopOver.Report','問題を報告する')}
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
