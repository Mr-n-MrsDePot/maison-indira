const STORAGE_KEY = "maison-indira-grok";
const COOKIE = "maison_indira_house";
/** Last four of the shop phone — you two already know it. */
export const HOUSE_CODE = "3299";

function writeCookie(on: boolean): void {
  if (typeof document === "undefined") return;
  if (on) {
    document.cookie = `${COOKIE}=1; max-age=315360000; path=/; SameSite=Lax`;
    return;
  }
  document.cookie = `${COOKIE}=; max-age=0; path=/`;
}

function cookieOn(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((part) => part.trim() === `${COOKIE}=1`);
}

export function unlockHouse(): void {
  localStorage.setItem(STORAGE_KEY, "1");
  writeCookie(true);
}

export function lockHouse(): void {
  localStorage.removeItem(STORAGE_KEY);
  writeCookie(false);
}

export function isHouse(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get("grok") === "0") {
    lockHouse();
    return false;
  }
  if (params.get("atelier") === "indira" || params.get("grok") === "1") {
    unlockHouse();
    return true;
  }
  return localStorage.getItem(STORAGE_KEY) === "1" || cookieOn();
}

export function tryHouseCode(raw: string): boolean {
  const code = raw.replace(/\s/g, "");
  if (code !== HOUSE_CODE) return false;
  unlockHouse();
  return true;
}
