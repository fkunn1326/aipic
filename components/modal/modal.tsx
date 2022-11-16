import { Dialog, Transition } from "@headlessui/react";
import React from "react";
import { Fragment, ReactNode } from "react";

type Props = {
  children: ReactNode;
  isOpen: boolean;
  onClose: VoidFunction;
};

const Modal = ({ isOpen, children, onClose }: Props) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overscroll-contain"
        onClose={onClose}
      >
        <div className="h-screen sm:px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-200 bg-opacity-50 backdrop-blur-sm" />
          </Transition.Child>

          <span
            className="inline-block h-screen align-bottom sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="bottom-0 inline-block w-full sm:w-4/6 rounded-t-2xl sm:rounded-xl h-[87%] sm:h-5/6 p-6 sm:my-8 overflow-auto text-left align-middle transition-all transform bg-white dark:bg-slate-900 shadow-xl">
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
