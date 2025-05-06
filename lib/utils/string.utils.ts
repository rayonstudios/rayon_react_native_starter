export const capitalize = (s: string) => {
  if (typeof s !== "string") return "";
  return s
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const randString = (len: number = 8) =>
  window
    .btoa(
      Array.from(window.crypto.getRandomValues(new Uint8Array(len * 2)))
        .map((b) => String.fromCharCode(b))
        .join("")
    )
    .replace(/[+/]/g, "")
    .substring(0, len);

export const convertLinkToGoogleDocLink = (link: string): string => {
  const encodedUrl = encodeURIComponent(link);
  return `https://docs.google.com/gview?embedded=true&url=${encodedUrl}`;
};
