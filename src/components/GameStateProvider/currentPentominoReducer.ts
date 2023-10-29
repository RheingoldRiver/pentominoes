import { produce } from "immer";
import { Orientation } from "../../constants";
import { Reducer } from "react";

export enum RotationDirection {
  Left,
  Right,
}

export enum ReflectionDirection {
  X,
  Y,
}

export enum OrientationActionType {
  rotate = "ROTATE",
  reflect = "REFLECT",
  replace = "REPLACE",
}

export interface OrientationAction {
  type: OrientationActionType;
  direction?: RotationDirection | ReflectionDirection;
  newOrientation?: Orientation;
}

export const orientationReducer: Reducer<Orientation, OrientationAction> = (
  currentOrientation: Orientation,
  action: OrientationAction
) => {
  switch (action.type) {
    case OrientationActionType.rotate:
      return produce(currentOrientation, (o: Orientation) => {
        const direction = action.direction === RotationDirection.Left ? -1 : 1;
        o.rotation = (4 + o.rotation + direction) % 4;
      });
    case OrientationActionType.reflect:
      return produce(currentOrientation, (o: Orientation) => {
        o.reflection = (o.reflection + 1) % 2;
        const direction = action.direction === ReflectionDirection.Y ? 0 : 1;
        if (o.rotation % 2 === direction) o.rotation = (o.rotation + 2) % 4;
      });
    case OrientationActionType.replace:
      return action.newOrientation ? { ...action.newOrientation } : { rotation: 0, reflection: 0 };
  }
};
