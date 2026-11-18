"use client";

import { useLayoutEffect } from "react";

// Marks <html data-page="..."> for page-level backgrounds. cacheComponents keeps left pages in the DOM
// (hidden by <Activity>), so `html:has(.page-class)` would keep matching them; this cleanup runs on hide.
export function PageTheme({ name }: { name: string }) {
  useLayoutEffect(() => {
    const html = document.documentElement;
    html.dataset.page = name;
    return () => {
      if (html.dataset.page === name) delete html.dataset.page;
    };
  }, [name]);
  return null;
}
