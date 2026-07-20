"use client";

import { useEffect } from "react";

export function CertificateAutoPrint() {
  useEffect(() => {
    let cancelled = false;

    const waitForImages = Promise.all(
      Array.from(document.images).map((image) => {
        if (image.complete) {
          return Promise.resolve();
        }

        return new Promise<void>((resolve) => {
          image.addEventListener("load", () => resolve(), { once: true });
          image.addEventListener("error", () => resolve(), { once: true });
        });
      })
    );

    const fontsReady =
      "fonts" in document ? document.fonts.ready.catch(() => undefined) : Promise.resolve();
    const fastFallback = new Promise<void>((resolve) => {
      window.setTimeout(resolve, 250);
    });

    Promise.race([Promise.all([waitForImages, fontsReady]), fastFallback]).then(() => {
      window.requestAnimationFrame(() => {
        if (!cancelled) {
          window.print();
        }
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
