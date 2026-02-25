"use client";

import { useEffect } from "react";

const KNOWN_ATTRS = ["data-temp-mail-org", "cz-shortcut-listen", "data-gramm"];

export default function CleanupAttrs() {
  useEffect(() => {
    try {
      // Remove known injected attributes from the document and inputs
      KNOWN_ATTRS.forEach((attr) => {
        // body
        if (document.body.hasAttribute && document.body.hasAttribute(attr)) {
          document.body.removeAttribute(attr);
        }
        // any element with the attribute
        const els = document.querySelectorAll(`[${attr}]`);
        els.forEach((el) => el.removeAttribute(attr));
      });

      // Clean inline background-image styles from inputs/selects that may be added client-side
      const inputs = document.querySelectorAll("input, select, textarea");
      inputs.forEach((el) => {
        try {
          const style = (el as HTMLElement).style;
          if (style && style.backgroundImage && style.backgroundImage.includes("data:image/svg+xml")) {
            style.backgroundImage = "";
            style.backgroundRepeat = "";
            style.backgroundPosition = "";
            style.backgroundSize = "";
          }
        } catch (e) {
          // ignore
        }
      });

      // As a fallback, remove attributes that start with common extension prefixes
      const allEls = document.querySelectorAll("*[data-]");
      allEls.forEach((el) => {
        Array.from(el.attributes).forEach((a) => {
          if (a.name.startsWith("data-temp-") || a.name.startsWith("data-gramm")) {
            el.removeAttribute(a.name);
          }
        });
      });
    } catch (err) {
      // swallow errors
      // console.debug("CleanupAttrs error", err);
    }
    // run once on mount
  }, []);

  return null;
}
