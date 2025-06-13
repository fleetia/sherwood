import { useState, useEffect } from "react";
import { Settings } from "../types";

const isDev = import.meta.env.DEV;

const defaultSettings: Settings = {
  showIcons: true,
  showTitles: true,
  showUrls: true,
  showAddButton: true,
  showDeleteButton: true,
  showEditButton: true,
  showMoveButton: true,
  showBackgroundSettings: true,
  showGridSettings: true,
  showSettings: true,
  backgroundImage: "",
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const loadSettings = async () => {
    try {
      if (isDev) {
        const savedSettings = localStorage.getItem("settings");
        if (savedSettings) {
          setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
        }
      } else {
        const result = await chrome.storage.sync.get("settings");
        if (result.settings) {
          setSettings({ ...defaultSettings, ...result.settings });
        }
      }
    } catch (error) {
      console.error("설정 로드 실패:", error);
    }
  };

  const updateSettings = async (newSettings: Settings) => {
    try {
      if (isDev) {
        localStorage.setItem("settings", JSON.stringify(newSettings));
      } else {
        await chrome.storage.sync.set({ settings: newSettings });
      }
      setSettings(newSettings);
    } catch (error) {
      console.error("설정 업데이트 실패:", error);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    updateSettings,
  };
} 