import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./PopupApp.module.scss";

const cx = classNames.bind(styles);

type PopupAppProps = {};

/**
 * 크롬 확장프로그램 팝업 메인 컴포넌트
 */
export function PopupApp({}: PopupAppProps) {
  const [isActive, setIsActive] = useState(false);

  function handleToggle() {
    setIsActive(!isActive);
  }

  return (
    <div className={cx("container")}>
      <header className={cx("header")}>
        <h1 className={cx("title")}>sherwood</h1>
        <p className={cx("subtitle")}>Fleetia Chrome Extension</p>
      </header>
      
      <main className={cx("main")}>
        <div className={cx("statusSection")}>
          <div className={cx("statusIndicator", { active: isActive, inactive: !isActive })}>
            {isActive ? "활성화됨" : "비활성화됨"}
          </div>
          <button 
            className={cx("toggleButton")}
            onClick={handleToggle}
          >
            {isActive ? "비활성화" : "활성화"}
          </button>
        </div>
        
        <div className={cx("infoSection")}>
          <p className={cx("infoText")}>
            현재 탭에서 Fleetia 기능을 사용할 수 있습니다.
          </p>
        </div>
      </main>
      
      <footer className={cx("footer")}>
        <button className={cx("optionsButton")}>
          설정
        </button>
      </footer>
    </div>
  );
} 