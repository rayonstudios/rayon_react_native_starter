import Toast from "react-native-toast-message";

export const getErrorMessage = (
  error: any,
  fallback = "An unknown error occurred!"
): string => {
  try {
    if (!error) return fallback;

    // If error is a string, attempt to parse it as JSON.
    if (typeof error === "string") {
      try {
        const parsed = JSON.parse(error);
        if (Array.isArray(parsed)) {
          const messages = parsed
            .map((item: any) => item.message)
            .filter((msg: any) => Boolean(msg));
          if (messages.length > 0) {
            // Return only the first error message.
            return messages[0];
            // If you prefer to join all messages, use:
            // return messages.join(", ");
          }
        }
      } catch {
        // If parsing fails, just return the string.
        return error;
      }
      return error;
    }

    // If error is an array, assume each element might have a message.
    if (Array.isArray(error)) {
      const messages = error
        .map((item: any) => item.message)
        .filter((msg: any) => Boolean(msg));
      if (messages.length > 0) {
        return messages[0];
      }
      return JSON.stringify(error);
    }

    // If error has an 'error' property that is a string, try to parse it.
    if (error.error && typeof error.error === "string") {
      try {
        const parsed = JSON.parse(error.error);
        if (Array.isArray(parsed)) {
          const messages = parsed
            .map((item: any) => item.message)
            .filter((msg: any) => Boolean(msg));
          if (messages.length > 0) {
            return messages[0];
          }
        }
      } catch {
        // If JSON parsing fails, return the plain string.
        return error.error;
      }
    }

    // If error has a 'message' property, use it.
    if (error.message) {
      return error.message;
    }

    // As a fallback, try to extract a message from the first property of the object.
    const firstKey = Object.keys(error)[0];
    if (firstKey) {
      return getErrorMessage(error[firstKey], fallback);
    }

    return JSON.stringify(error);
  } catch {
    return fallback;
  }
};

export const globalErrorHandler = (error: any) => {
  const errorMsg = getErrorMessage(error);
  console.error("error coming from API: ", errorMsg);
  Toast.show({
    type: "error",
    text1: "Error",
    text2: errorMsg,
  });
};
