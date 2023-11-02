import { Dimensions, SOLVE_AREA } from "./../../constants";
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

export const errorSphere = (draftState: CurrentState) => {
  return draftState.surface === SURFACES.Sphere && draftState.width !== draftState.height;
};

const errorDimension = (dim: number) => {
  if (dim > MAX_DIMENSION_SIZE) return true;
  if (dim < 3) return true;
  return false;
};

export const errorWidth = (draftState: CurrentState) => {
  return errorDimension(draftState.width);
};

export const errorHeight = (newState: CurrentState) => {
  return errorDimension(newState.height);
};

export const errorCopyScreenshots = (draftState: CurrentState) => {
  return draftState.copyImage && typeof ClipboardItem === "undefined";
};

export const warnDimensions = (draftState: CurrentState) => {
  return draftState.height * draftState.width < SOLVE_AREA;
};

export const gridChangeNeeded = (draftState: Dimensions & Partial<CurrentState>, prevDimensions: Dimensions) => {
  return draftState.height !== prevDimensions.height || draftState.width !== prevDimensions.width;
};
