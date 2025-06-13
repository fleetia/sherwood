console.log("sherwood 콘텐츠 스크립트가 로드되었습니다.");let t=!1;function i(){chrome.runtime.sendMessage({action:"get-status"},e=>{e!=null&&e.success&&(t=e.isActive,t&&o())}),chrome.runtime.onMessage.addListener((e,s,a)=>{switch(e.action){case"status-changed":t=e.isActive,t?o():c(),a({success:!0});break}})}function o(){console.log("sherwood 기능이 활성화되었습니다."),d()}function c(){console.log("sherwood 기능이 비활성화되었습니다."),n()}function d(){n();const e=document.createElement("div");e.id="fleetia-indicator",e.style.cssText=`
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
  `,e.textContent="Fleetia 활성화됨",document.body.appendChild(e)}function n(){const e=document.getElementById("fleetia-indicator");e&&e.remove()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",i):i();
