import { useState, useEffect } from "react";

const isDev = import.meta.env.DEV;

export function useBackgroundImage() {
  const [backgroundImage, setBackgroundImage] = useState<string>("");

  const loadBackgroundImage = async () => {
    try {
      if (isDev) {
        const savedImage = localStorage.getItem("backgroundImage");
        if (savedImage) {
          setBackgroundImage(savedImage);
          document.documentElement.style.setProperty("--background-image", `url(${savedImage})`);
        }
      } else {
        const result = await chrome.storage.sync.get("backgroundImage");
        if (result.backgroundImage) {
          setBackgroundImage(result.backgroundImage);
          document.documentElement.style.setProperty("--background-image", `url(${result.backgroundImage})`);
        }
      }
    } catch (error) {
      console.error("배경 이미지 로드 실패:", error);
    }
  };

  const updateBackgroundImage = async (imageUrl: string) => {
    try {
      if (isDev) {
        localStorage.setItem("backgroundImage", imageUrl);
      } else {
        await chrome.storage.sync.set({ backgroundImage: imageUrl });
      }
      setBackgroundImage(imageUrl);
      // 배경 이미지가 변경되면 즉시 적용
      document.documentElement.style.setProperty("--background-image", `url(${imageUrl})`);
    } catch (error) {
      console.error("배경 이미지 업데이트 실패:", error);
    }
  };

  useEffect(() => {
    loadBackgroundImage();
  }, []);

  // 배경 이미지가 변경될 때마다 CSS 변수 업데이트
  useEffect(() => {
    if (backgroundImage) {
      document.documentElement.style.setProperty("--background-image", `url(${backgroundImage})`);
    }
  }, [backgroundImage]);

  return {
    backgroundImage,
    updateBackgroundImage,
  };
} 