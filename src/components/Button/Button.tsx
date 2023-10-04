import * as Toolbar from "@radix-ui/react-toolbar";
import clsx from "clsx";
import { ReactNode } from "react";

export const ToolbarButton = ({
  children,
  ...rest
}: { children: ReactNode } & Toolbar.ToolbarButtonProps & React.RefAttributes<HTMLButtonElement>) => {
  return (
    <Toolbar.Button
      className={clsx(
        "cursor-pointer p-2 rounded mb-2",
        "shadow-sm shadow-zinc-900 dark:shadow-none dark:border dark:border-zinc-500"
      )}
      {...rest}
    >
      {children}
    </Toolbar.Button>
  );
};

export const Button = ({
  children,
  ...rest
}: { children: ReactNode } & Toolbar.ToolbarButtonProps & React.RefAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={clsx(
        "cursor-pointer p-2 rounded mb-2",
        "shadow-sm shadow-zinc-900 dark:shadow-none dark:border dark:border-zinc-500"
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
