import { useEffect, useState, type FormEvent } from "react";
import { brand } from "../data/products.ts";
import { isHouse, tryHouseCode } from "../lib/house.ts";

const HELP_PROMPT = `Maison Indira (Indira) pressed the Grok button on the website. Help with Stripe checkout, orders, or the site. Stripe live account Maison Indira is already connected. Project folder: maison-indira.`;

export function GrokHelp() {
  const [allowed, setAllowed] = useState(false);
  const [open, setOpen] = useState(false);
  const [askCode, setAskCode] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);

  useEffect(() => {
    setAllowed(isHouse());
    function onAsk() {
      if (isHouse()) {
        setAllowed(true);
        setOpen(true);
        return;
      }
      setAskCode(true);
    }
    window.addEventListener("maison-house", onAsk);
    return () => window.removeEventListener("maison-house", onAsk);
  }, []);

  useEffect(() => {
    if (!open && !askCode) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setAskCode(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [askCode, open]);

  function submitCode(event: FormEvent) {
    event.preventDefault();
    if (!tryHouseCode(code)) {
      setCodeError(true);
      return;
    }
    setCodeError(false);
    setCode("");
    setAskCode(false);
    setAllowed(true);
    setOpen(true);
  }

  async function callGrok() {
    try {
      await navigator.clipboard.writeText(HELP_PROMPT);
    } catch {
      /* clipboard may be blocked */
    }
    const mail = new URL(`mailto:${brand.helpEmail}`);
    mail.searchParams.set("cc", brand.helpCc);
    mail.searchParams.set("subject", "MAISON INDIRA — CALL GROK");
    mail.searchParams.set(
      "body",
      `${HELP_PROMPT}\n\nPaste that into Grok if the chat is already open.`,
    );
    window.open(brand.grokUrl, "_blank", "noopener,noreferrer");
    window.location.href = mail.toString();
  }

  return (
    <>
      {allowed ? (
        <button
          className="grok-fab"
          type="button"
          aria-label="Call Grok for help"
          onClick={() => setOpen(true)}
        >
          Grok
        </button>
      ) : null}
      {askCode ? (
        <>
          <div className="drawer-backdrop" onClick={() => setAskCode(false)} />
          <aside className="grok-sheet" role="dialog" aria-modal="true" aria-label="House code">
            <p className="eyebrow">House</p>
            <h2>For you two only.</h2>
            <p>Enter the last four of the shop phone. This device will keep Grok after that.</p>
            <form className="grok-code" onSubmit={submitCode}>
              <input
                inputMode="numeric"
                autoComplete="off"
                maxLength={4}
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  setCodeError(false);
                }}
                aria-label="House code"
              />
              <button className="btn" type="submit">
                Keep Grok on this phone
              </button>
            </form>
            {codeError ? <p className="checkout-error">That is not the house code.</p> : null}
          </aside>
        </>
      ) : null}
      {allowed && open ? (
        <>
          <div className="drawer-backdrop" onClick={() => setOpen(false)} />
          <aside className="grok-sheet" role="dialog" aria-modal="true" aria-label="Call Grok">
            <p className="eyebrow">On call</p>
            <h2>Need Grok?</h2>
            <p>
              This stays on this phone. Press Call Grok if checkout, orders, or the site is stuck.
            </p>
            <button className="btn" type="button" onClick={() => void callGrok()}>
              Call Grok
            </button>
            <button className="btn ghost" type="button" onClick={() => setOpen(false)}>
              Not now
            </button>
          </aside>
        </>
      ) : null}
    </>
  );
}
