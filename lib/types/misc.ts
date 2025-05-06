export enum ThunkStatus {
  IDLE = "idle",
  LOADING = "loading",
  FAILED = "failed",
}

export type GenericObject = Record<string, any>;
export type KeyValuePair = Record<string, string>;
