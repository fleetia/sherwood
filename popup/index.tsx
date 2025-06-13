import React from "react";
import { createRoot } from "react-dom/client";
import { PopupApp } from "./PopupApp";

/**
 * 팝업 진입점 - React 앱을 마운트합니다
 */
function initializePopup() {
  const container = document.getElementById("root");
  if (!container) {
    throw new Error("Root container not found");
  }

  const root = createRoot(container);
  root.render(<PopupApp />);
}

initializePopup(); 