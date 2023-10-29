import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";
import { AppStateContext } from "../AppStateProvider/AppStateProvider";

export const DarkModeButton = () => {
  const { darkMode, updateDarkMode } = useContext(AppStateContext);
  const ChangeIcon = darkMode === true ? SunIcon : MoonIcon;
  return (
    <ChangeIcon
      className="cursor-pointer h-10 w-10 text-gray-800 dark:text-gray-300"
      onClick={() => {
        updateDarkMode(!darkMode);
      }}
    />
  );
};
