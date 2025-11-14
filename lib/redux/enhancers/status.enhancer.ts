import {
  Action,
  isFulfilled,
  isPending,
  isRejected,
  isRejectedWithValue,
  StoreEnhancer,
} from "@reduxjs/toolkit";
import { ThunkStatus } from "@/lib/types/misc";

export const statusHandlerEnhancer: StoreEnhancer =
  (createStore) =>
  (reducer, preloadedState) => {
    const statusHandlerReducer = (state: any, action: any) => {
      const newState = reducer(state, action);

      //get slicename and type value from action.type
      const split = action.type.split("/");
      const sliceName = split[0];
      const type = split[1];
      let status: ThunkStatus | undefined;

      //change newState based on the sliceName, type and the status conveyed by the action
      if (isPending(action)) status = ThunkStatus.LOADING;
      else if (isFulfilled(action)) status = ThunkStatus.IDLE;
      else if (isRejected(action) || isRejectedWithValue(action))
        status = ThunkStatus.FAILED;

      if (status && newState && typeof newState === "object")
        return {
          ...newState,
          [sliceName]: { ...(newState as any)[sliceName], [type + "Status"]: status },
        };

      return newState;
    };

    return createStore(statusHandlerReducer as any, preloadedState);
  };
