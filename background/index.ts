/**
 * 크롬 확장프로그램 백그라운드 서비스 워커
 */

// 확장프로그램 설치 시 실행
chrome.runtime.onInstalled.addListener(() => {
  console.log("sherwood 확장프로그램이 설치되었습니다.");
  
  // 기본 설정 초기화
  chrome.storage.sync.set({
    isActive: false,
    settings: {
      autoActivate: false,
      notifications: true,
    },
  });
});

// 메시지 리스너
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("백그라운드에서 메시지 수신:", request);
  
  switch (request.action) {
    case "toggle-active":
      handleToggleActive(sendResponse);
      return true; // 비동기 응답을 위해 true 반환
      
    case "get-status":
      handleGetStatus(sendResponse);
      return true;
      
    default:
      sendResponse({ error: "알 수 없는 액션입니다." });
  }
});

/**
 * 활성화 상태 토글 처리
 */
async function handleToggleActive(sendResponse: (response: any) => void) {
  try {
    const result = await chrome.storage.sync.get(["isActive"]);
    const newState = !result.isActive;
    
    await chrome.storage.sync.set({ isActive: newState });
    
    sendResponse({ 
      success: true, 
      isActive: newState 
    });
  } catch (error) {
    sendResponse({ 
      success: false, 
      error: "상태 변경에 실패했습니다." 
    });
  }
}

/**
 * 현재 상태 조회 처리
 */
async function handleGetStatus(sendResponse: (response: any) => void) {
  try {
    const result = await chrome.storage.sync.get(["isActive", "settings"]);
    
    sendResponse({
      success: true,
      isActive: result.isActive || false,
      settings: result.settings || {},
    });
  } catch (error) {
    sendResponse({
      success: false,
      error: "상태 조회에 실패했습니다.",
    });
  }
} 