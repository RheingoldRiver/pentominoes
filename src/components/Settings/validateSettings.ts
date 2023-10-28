import { MAX_DIMENSION_SIZE, SURFACES } from "../../constants";
import { CurrentState } from "./settingsConstants";

export const errorConfig = (currentState: CurrentState) => {
  return (
    errorSphere(currentState) ||
    errorCopyScreenshots(currentState) ||
    errorWidth(currentState) ||
    errorHeight(currentState)
  );
};

export const errorSphere = (currentState: CurrentState) => {
  return currentState.surface === SURFACES.Sphere && currentState.width !== currentState.height;
};

const errorDimension = (dim: number) => {
  if (dim > MAX_DIMENSION_SIZE) return true;
  if (dim < 3) return true;
  return false;
};

export const errorWidth = (currentState: CurrentState) => {
  return errorDimension(currentState.width);
};

export const errorHeight = (currentState: CurrentState) => {
  return errorDimension(currentState.height);
};

export const errorCopyScreenshots = (currentState: CurrentState) => {
  return currentState.copyImage && typeof ClipboardItem === "undefined";
};

export const warnDimensions = (currentState: CurrentState) => {
  return currentState.height * currentState.width < 60;
};

export const gridChangeNeeded = (currentState: CurrentState, height: number, width: number) => {
  return currentState.height !== height || currentState.width !== width;
};
