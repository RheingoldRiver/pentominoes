import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useContext } from "react";
import { AppStateContext } from "../AppStateProvider/AppStateProvider";

export const DarkModeButton = () => {
  const { darkMode, updateDarkMode } = useContext(AppStateContext);
  const ChangeIcon = darkMode === true ? SunIcon : MoonIcon;
  return (
    <ChangeIcon
      className=" cursor-pointer"
      width={25}
      onClick={() => {
        updateDarkMode(!darkMode);
      }}
    />
  );
};
