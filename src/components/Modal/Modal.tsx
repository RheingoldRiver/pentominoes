import * as Dialog from "@radix-ui/react-dialog";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export const Modal = ({
  children,
  trigger,
  onOpenAutoFocus,
  open,
  onOpenChange,
}: {
  children: ReactNode;
  trigger: ReactNode;
  onOpenAutoFocus?: () => void;
  open?: boolean | undefined;
  onOpenChange?: Dispatch<SetStateAction<boolean>> | undefined;
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button>{trigger}</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={clsx("bg-gray-900 opacity-40 dark:opacity-80 fixed inset-0")} />
        <Dialog.Content
          onOpenAutoFocus={onOpenAutoFocus}
          className={clsx(
            "bg-gray-300 dark:bg-gray-800 dark:text-gray-50",
            "rounded-lg pt-8 pb-0 shadow-md shadow-gray-500 dark:shadow-none",
            "fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]",
            "max-h-[90vh] overflow-y-auto w-[min(90vw,_40rem)]"
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
