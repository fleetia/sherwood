/**
 * 크롬 확장프로그램 콘텐츠 스크립트
 * 웹페이지에 주입되어 실행됩니다
 */

console.log("sherwood 콘텐츠 스크립트가 로드되었습니다.");

// 확장프로그램 상태 확인
let isExtensionActive = false;

/**
 * 확장프로그램 초기화
 */
function initializeContentScript() {
  // 백그라운드 스크립트에서 상태 조회
  chrome.runtime.sendMessage({ action: "get-status" }, (response) => {
    if (response?.success) {
      isExtensionActive = response.isActive;
      if (isExtensionActive) {
        activateFeatures();
      }
    }
  });

  // 백그라운드 스크립트로부터 메시지 수신
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
      case "status-changed":
        isExtensionActive = request.isActive;
        if (isExtensionActive) {
          activateFeatures();
        } else {
          deactivateFeatures();
        }
        sendResponse({ success: true });
        break;
    }
  });
}

/**
 * 확장프로그램 기능 활성화
 */
function activateFeatures() {
  console.log("sherwood 기능이 활성화되었습니다.");
  
  // 여기에 실제 기능 구현
  // 예: DOM 조작, 이벤트 리스너 추가 등
  addFleetiaIndicator();
}

/**
 * 확장프로그램 기능 비활성화
 */
function deactivateFeatures() {
  console.log("sherwood 기능이 비활성화되었습니다.");
  
  // 활성화된 기능들 정리
  removeFleetiaIndicator();
}

/**
 * Fleetia 인디케이터 추가
 */
function addFleetiaIndicator() {
  // 이미 존재하는 경우 제거
  removeFleetiaIndicator();
  
  const indicator = document.createElement("div");
  indicator.id = "fleetia-indicator";
  indicator.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #667eea;
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    z-index: 10000;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  `;
  indicator.textContent = "Fleetia 활성화됨";
  
  document.body.appendChild(indicator);
}

/**
 * Fleetia 인디케이터 제거
 */
function removeFleetiaIndicator() {
  const existing = document.getElementById("fleetia-indicator");
  if (existing) {
    existing.remove();
  }
}

// DOM이 로드되면 초기화
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeContentScript);
} else {
  initializeContentScript();
} 