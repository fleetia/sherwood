import { useState, useEffect } from "react";
import { GridSettings } from "../types";

const isDev = process.env.NODE_ENV === "development";

export function useGridSettings() {
  const [gridSettings, setGridSettings] = useState<GridSettings>({
    columns: 4,
    rows: 3,
    gap: 1,
  });

  const loadGridSettings = async () => {
    try {
      if (isDev) {
        const savedSettings = localStorage.getItem("gridSettings");
        if (savedSettings) {
          setGridSettings(JSON.parse(savedSettings));
        }
      } else {
        const result = await chrome.storage.sync.get("gridSettings");
        if (result.gridSettings) {
          setGridSettings(result.gridSettings);
        }
      }
    } catch (error) {
      console.error("그리드 설정 로드 실패:", error);
    }
  };

  const updateGridSettings = async (newSettings: GridSettings) => {
    try {
      if (isDev) {
        localStorage.setItem("gridSettings", JSON.stringify(newSettings));
        setGridSettings(newSettings);
      } else {
        await chrome.storage.sync.set({ gridSettings: newSettings });
        setGridSettings(newSettings);
      }
    } catch (error) {
      console.error("그리드 설정 업데이트 실패:", error);
    }
  };

  useEffect(() => {
    loadGridSettings();
  }, []);

  return {
    gridSettings,
    updateGridSettings,
  };
} 