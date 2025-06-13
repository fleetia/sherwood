import { useState, useEffect } from "react";
import { Bookmark } from "../types";
import { useGridSettings } from "./useGridSettings";

const isDev = import.meta.env.DEV;

export function useBookmarks() {
  const { gridSettings } = useGridSettings();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadBookmarks = async () => {
    try {
      if (isDev) {
        const savedBookmarks = localStorage.getItem("bookmarks");
        if (savedBookmarks) {
          const parsedBookmarks = JSON.parse(savedBookmarks);
          setBookmarks(parsedBookmarks);
          setTotalPages(Math.ceil(parsedBookmarks.length / (gridSettings.columns * gridSettings.rows)));
        } else {
          // 기본 북마크 설정
          const defaultBookmarks = [
            {
              id: "1",
              title: "Buy me a coffee",
              url: "https://coff.ee/starlight.space",
              favicon:
                "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://buymeacoffee.com&size=32",
            },
          ];
          setBookmarks(defaultBookmarks);
          setTotalPages(Math.ceil(defaultBookmarks.length / (gridSettings.columns * gridSettings.rows)));
          localStorage.setItem("bookmarks", JSON.stringify(defaultBookmarks));
        }
      } else {
        const result = await chrome.storage.sync.get("bookmarks");
        if (result.bookmarks) {
          setBookmarks(result.bookmarks);
          setTotalPages(Math.ceil(result.bookmarks.length / (gridSettings.columns * gridSettings.rows)));
        } else {
          // 기본 북마크 설정
          const defaultBookmarks = [
            {
              id: "1",
              title: "Buy me a coffee",
              url: "https://coff.ee/starlight.space",
              favicon:
                "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://buymeacoffee.com&size=32",
            },
          ];
          setBookmarks(defaultBookmarks);
          setTotalPages(Math.ceil(defaultBookmarks.length / (gridSettings.columns * gridSettings.rows)));
          await chrome.storage.sync.set({ bookmarks: defaultBookmarks });
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error("북마크 로드 실패:", error);
      setIsLoading(false);
    }
  };

  const handleAddBookmark = async (bookmark: Bookmark) => {
    try {
      const updatedBookmarks = [...bookmarks, bookmark];
      if (isDev) {
        localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
      } else {
        await chrome.storage.sync.set({ bookmarks: updatedBookmarks });
      }
      setBookmarks(updatedBookmarks);
      const newTotalPages = Math.ceil(updatedBookmarks.length / (gridSettings.columns * gridSettings.rows));
      setTotalPages(newTotalPages);

      // 현재 페이지가 꽉 찼는지 확인
      const currentPageBookmarks = updatedBookmarks.slice(
        currentPage * (gridSettings.columns * gridSettings.rows),
        (currentPage + 1) * (gridSettings.columns * gridSettings.rows)
      );
      
      // 현재 페이지가 꽉 찼다면 다음 페이지로 이동
      if (currentPageBookmarks.length >= gridSettings.columns * gridSettings.rows) {
        setCurrentPage(currentPage + 1);
      }
    } catch (error) {
      console.error("북마크 추가 실패:", error);
    }
  };

  const handleDeleteBookmark = async (bookmarkId: string) => {
    try {
      const updatedBookmarks = bookmarks.filter((bookmark) => bookmark.id !== bookmarkId);
      if (isDev) {
        localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
      } else {
        await chrome.storage.sync.set({ bookmarks: updatedBookmarks });
      }
      setBookmarks(updatedBookmarks);
      const newTotalPages = Math.ceil(updatedBookmarks.length / (gridSettings.columns * gridSettings.rows));
      setTotalPages(newTotalPages);
      
      // 현재 페이지가 비어있다면 이전 페이지로 이동
      if (displayBookmarks.length === 1 && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("북마크 삭제 실패:", error);
    }
  };

  const handleBookmarkClick = (url: string) => {
    window.location.href = url;
  };

  const handlePageChange = (direction: "prev" | "next") => {
    if (direction === "prev" && currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === "next" && currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // 초기 로드
  useEffect(() => {
    loadBookmarks();
  }, []);

  // gridSettings가 변경될 때마다 북마크를 다시 계산
  useEffect(() => {
    const newTotalPages = Math.ceil(bookmarks.length / (gridSettings.columns * gridSettings.rows));
    setTotalPages(newTotalPages);
    
    // 현재 페이지가 새로운 totalPages를 초과하지 않도록 조정
    if (currentPage >= newTotalPages) {
      setCurrentPage(Math.max(0, newTotalPages - 1));
    }
  }, [gridSettings.columns, gridSettings.rows, bookmarks]);

  const maxBookmarks = gridSettings.columns * gridSettings.rows;
  const startIndex = currentPage * maxBookmarks;
  const endIndex = startIndex + maxBookmarks;
  const displayBookmarks = bookmarks.slice(startIndex, endIndex);
  const isLastPage = currentPage === totalPages - 1;
  const isLastItemInPage = displayBookmarks.length >= maxBookmarks;
  const isEmpty = bookmarks.length === 0;

  // 마지막 페이지가 꽉 찼을 때만 새로운 페이지 추가
  useEffect(() => {
    if (isLastPage && isLastItemInPage) {
      setTotalPages(prev => prev + 1);
    }
  }, [isLastPage, isLastItemInPage]);

  return {
    bookmarks,
    currentPage,
    totalPages,
    displayBookmarks,
    isLastPage,
    isLastItemInPage,
    isEmpty,
    handleBookmarkClick,
    handleAddBookmark,
    handleDeleteBookmark,
    handlePageChange,
  };
} 