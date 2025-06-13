import React, { forwardRef } from "react";
import classNames from "classnames/bind";
import styles from "./OptionsSidebar.module.scss";
import { GridSettings, Settings } from "../types";

const cx = classNames.bind(styles);

type OptionsSidebarProps = {
  gridSettings: GridSettings;
  settings: Settings;
  size: number;
  onGridSettingChange: (key: keyof GridSettings, value: number) => Promise<void>;
  onSettingChange: (key: keyof Settings, value: boolean) => Promise<void>;
  onSizeChange: (value: number) => Promise<void>;
  onBackgroundImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
};

/**
 * 새 탭 페이지 설정 사이드바 컴포넌트
 */
export const OptionsSidebar = forwardRef<HTMLElement, OptionsSidebarProps>(({
  gridSettings,
  settings,
  size,
  onGridSettingChange,
  onSettingChange,
  onSizeChange,
  onBackgroundImageChange,
}, ref) => {
  return (
    <section ref={ref} className={cx("option-side")}>
      <h2 className={cx("sectionTitle")}>새 탭 페이지 설정</h2>

      {/* 그리드 설정 */}
      <div className={cx("settingGroup")}>
        <h3 className={cx("groupTitle")}>그리드 설정</h3>
        
        <div className={cx("settingItem")}>
          <label className={cx("settingLabel")}>
            <span className={cx("rangeLabel")}>
              가로 개수: {gridSettings.columns}
            </span>
          </label>
          <input
            type="range"
            min="3"
            max="10"
            value={gridSettings.columns}
            onChange={(e) =>
              onGridSettingChange("columns", parseInt(e.target.value))
            }
            className={cx("rangeInput")}
          />
          <p className={cx("settingDescription")}>
            새 탭 페이지에서 북마크 그리드의 가로 개수를 설정합니다. (3-10개)
          </p>
        </div>

        <div className={cx("settingItem")}>
          <label className={cx("settingLabel")}>
            <span className={cx("rangeLabel")}>
              세로 개수: {gridSettings.rows}
            </span>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={gridSettings.rows}
            onChange={(e) =>
              onGridSettingChange("rows", parseInt(e.target.value))
            }
            className={cx("rangeInput")}
          />
          <p className={cx("settingDescription")}>
            새 탭 페이지에서 북마크 그리드의 세로 개수를 설정합니다. (1-5개)
          </p>
        </div>
      </div>

      {/* 디스플레이 설정 */}
      <div className={cx("settingGroup")}>
        <h3 className={cx("groupTitle")}>디스플레이 설정</h3>

        <div className={cx("settingItem")}>
          <label className={cx("settingLabel")}>
            <span className={cx("rangeLabel")}>사이즈: {size}px</span>
          </label>
          <input
            type="range"
            min="10"
            max="50"
            value={size}
            onChange={(e) => onSizeChange(parseInt(e.target.value))}
            className={cx("rangeInput")}
          />
          <p className={cx("settingDescription")}>
            전체 사이즈를 조정합니다.
          </p>
        </div>

        <div className={cx("settingItem")}>
          <label className={cx("settingLabel")}>
            <span className={cx("rangeLabel")}>배경 이미지</span>
          </label>
          <div className={cx("backgroundImageContainer")}>
            <input
              type="file"
              accept="image/*"
              onChange={onBackgroundImageChange}
              className={cx("fileInput")}
            />
          </div>
          <p className={cx("settingDescription")}>
            새 탭 페이지의 배경 이미지를 변경합니다.
          </p>
        </div>
      </div>
    </section>
  );
}); 