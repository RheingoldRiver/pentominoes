import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode, useContext } from "react";
import { AppStateContext } from "../AppStateProvider/AppStateProvider";
import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export const Modal = ({ children, button }: { children: ReactNode; button: ReactNode }) => {
  const darkMode = useContext(AppStateContext);
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button>{button}</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className={clsx(darkMode ? "dark" : "", "bg-gray-900 opacity-40 self-dark:opacity-80 fixed inset-0")}
        />
        <Dialog.Content
          className={clsx(
            darkMode ? "dark" : "",
            "bg-gray-400 self-dark:bg-gray-800 self-dark:text-gray-50",
            "rounded-lg p-8 shadow-md shadow-gray-500 dark:shadow-none",
            "fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]",
            "max-h-[90vh] overflow-y-auto w-[min(90vw,_48rem)]"
          )}
        >
          {children}
          <Dialog.Close asChild>
            <button className="absolute top-3 right-3 hover:text-red-600" aria-label="Close">
              <XMarkIcon className="text-black dark:text-gray-50 h-6 w-6" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
