import React from "react";
import { createRoot } from "react-dom/client";
import { NewTabApp } from "./NewTabApp";

import "@fleetia/ui/ui.css"

/**
 * 새 탭 페이지 진입점 - React 앱을 마운트합니다
 */
function initializeNewTab() {
  const container = document.getElementById("root");
  if (!container) {
    throw new Error("Root container not found");
  }

  const root = createRoot(container);
  root.render(<NewTabApp />);
}

initializeNewTab(); 