import { useEffect, useCallback, useReducer } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { EventRegister } from "react-native-event-listeners";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null]
): UseStateHook<T> {
  return useReducer(
    (
      state: [boolean, T | null],
      action: T | null = null
    ): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

export async function getStorageItemAsync(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error("Local storage is unavailable:", e);
      return null;
    }
  } else {
    return SecureStore.getItemAsync(key);
  }
}

export async function setStorageItemAsync(key: string, value: string | null) {
  if (Platform.OS === "web") {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error("Local storage is unavailable:", e);
    }
  } else {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
  EventRegister.emit("secure-storage-key-change", { key, value });
}

export function useStorageState(key: string): UseStateHook<string> {
  // Public
  const [state, setState] = useAsyncState<string>();

  // Get
  useEffect(() => {
    (async () => {
      const value = await getStorageItemAsync(key);
      setState(value);
    })();

    EventRegister.addEventListener(
      "secure-storage-key-change",
      ({ key: storageKey, value }) => {
        if (key === storageKey) {
          setState(value);
        }
      }
    );
    return () => {
      EventRegister.removeEventListener("secure-storage-key-change");
    };
  }, [key]);

  // Set
  const setValue = useCallback(
    (value: string | null) => {
      setStorageItemAsync(key, value);
    },
    [key]
  );

  return [state, setValue];
}
