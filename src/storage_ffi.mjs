
export function saveCode(name, code) {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("animator:" + name, code);
  }
}

export function loadCode(name, fallback) {
  if (typeof localStorage === "undefined") {
    return fallback;
  }
  return localStorage.getItem("animator:" + name) ?? fallback;
}
