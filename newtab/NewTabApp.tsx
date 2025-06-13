import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames/bind";
import styles from "./NewTabApp.module.scss";
import { IconButton } from "@fleetia/ui";
import { Bookmark, GridSettings, Settings } from "./types";
import { useBookmarks } from "./hooks/useBookmarks";
import { useGridSettings } from "./hooks/useGridSettings";
import { useSettings } from "./hooks/useSettings";
import { useBackgroundImage } from "./hooks/useBackgroundImage";
import { OptionsSidebar } from "./components/OptionsSidebar";

const cx = classNames.bind(styles);

type NewTabAppProps = {};

/**
 * 크롬 새 탭 페이지 메인 컴포넌트
 */
export function NewTabApp({}: NewTabAppProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBookmark, setNewBookmark] = useState({ title: "", url: "" });
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    bookmarkId: string;
  } | null>(null);
  const [openOptionsMenu, setOpenOptionsMenu] = useState<boolean>(false);
  const [size, setSize] = useState(20); // 기본값 20em
  const optionsSidebarRef = useRef<HTMLElement>(null);

  const {
    bookmarks,
    currentPage,
    totalPages,
    displayBookmarks,
    isLastPage,
    isLastItemInPage,
    handleBookmarkClick,
    handleAddBookmark: addBookmark,
    handleDeleteBookmark,
    handlePageChange,
    isEmpty,
  } = useBookmarks();

  const { gridSettings, updateGridSettings } = useGridSettings();
  const { settings, updateSettings } = useSettings();
  const { backgroundImage, updateBackgroundImage } = useBackgroundImage();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      
      // 컨텍스트 메뉴 닫기
      if (contextMenu) {
        setContextMenu(null);
      }
      
      // 사이드바가 열려있을 때만 체크
      if (!openOptionsMenu) return;
      
      // 사이드바 내부 클릭이 아닌 경우에만 닫기
      if (optionsSidebarRef.current && !optionsSidebarRef.current.contains(target)) {
        setOpenOptionsMenu(false);
        // 옵션창이 닫힐 때 페이지 새로고침
        window.location.reload();
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openOptionsMenu, contextMenu]);

  /**
   * 북마크 추가
   */
  async function handleAddBookmark(e: React.FormEvent) {
    e.preventDefault();
    if (newBookmark.title.trim() && newBookmark.url.trim()) {
      const bookmark: Bookmark = {
        id: Date.now().toString(),
        title: newBookmark.title.trim(),
        url: newBookmark.url.trim(),
        favicon: `https://www.google.com/s2/favicons?domain=${new URL(newBookmark.url.trim()).hostname}&sz=32`,
      };

      await addBookmark(bookmark);
      setNewBookmark({ title: "", url: "" });
      setShowAddForm(false);

      // If current page is full, move to next page
      if (isLastItemInPage) {
        handlePageChange("next");
      }
    }
  }

  /**
   * 우클릭 컨텍스트 메뉴
   */
  function handleContextMenu(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    bookmarkId: string,
  ) {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      bookmarkId,
    });
  }

  /**
   * 사이즈 변경 핸들러
   */
  async function handleSizeChange(value: number) {
    setSize(value);
    document.documentElement.style.setProperty("--em", `${value}px`);

    try {
      await chrome.storage.sync.set({ size: value });
    } catch (error) {
      console.error("사이즈 설정 저장 실패:", error);
    }
  }

  /**
   * 배경 이미지 변경 핸들러
   */
  const handleBackgroundImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일을 URL로 변환
      const imageUrl = URL.createObjectURL(file);
      await updateBackgroundImage(imageUrl);
    }
  };

  /**
   * 설정 변경 핸들러
   */
  async function handleSettingChange(key: keyof Settings, value: boolean) {
    const newSettings = { ...settings, [key]: value };
    await updateSettings(newSettings);
  }

  /**
   * 그리드 설정 변경 핸들러
   */
  async function handleGridSettingChange(
    key: keyof GridSettings,
    value: number,
  ) {
    const newValue = Math.max(1, Math.min(key === "columns" ? 10 : 5, value));
    const newGridSettings = { ...gridSettings, [key]: newValue };
    await updateGridSettings(newGridSettings);
  }

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setOpenOptionsMenu((prev) => !prev);
  };

  return (
    <div className={cx("container")}>
      <div className={cx("background")} />

      {/* 메인 콘텐츠 */}
      <main className={cx("main")}>
        {/* 북마크 섹션 */}
        <section className={cx("bookmarksSection")}>
          {currentPage > 0 && (
            <button
              onClick={() => handlePageChange("prev")}
              className={cx("pageButton", "prevButton")}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          <div
            className={cx("bookmarkGrid")}
            style={{
              gridTemplateColumns: `repeat(${gridSettings.columns}, minmax(min-content, 1fr))`,
              gridTemplateRows: `repeat(${gridSettings.rows}, 1fr)`,
            }}
          >
            {displayBookmarks.map((bookmark) => (
              <IconButton
                key={bookmark.id}
                type={"normal"}
                name={bookmark.title}
                iconUrl={bookmark.favicon}
                onClick={() => handleBookmarkClick(bookmark.url)}
                onContextMenu={(e) => handleContextMenu(e, bookmark.id)}
              />
            ))}
            {isLastPage && !isLastItemInPage && (
              <IconButton type={"empty"} onClick={() => setShowAddForm(true)} />
            )}
          </div>

          {currentPage < totalPages - 1 && (
            <button
              onClick={() => handlePageChange("next")}
              className={cx("pageButton", "nextButton")}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6L15 12L9 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </section>
      </main>

      {/* 옵션 버튼 */}
      <button
        className={cx("optionsButton")}
        onClick={handleOptionsClick}
        title="옵션"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* 옵션 사이드바 */}
      {openOptionsMenu && (
        <OptionsSidebar
          ref={optionsSidebarRef}
          gridSettings={gridSettings}
          settings={settings}
          size={size}
          onGridSettingChange={handleGridSettingChange}
          onSettingChange={handleSettingChange}
          onSizeChange={handleSizeChange}
          onBackgroundImageChange={handleBackgroundImageChange}
        />
      )}

      {/* 북마크 추가 모달 */}
      {showAddForm && (
        <div className={cx("modal")}>
          <div className={cx("modalContent")}>
            <h3 className={cx("modalTitle")}>북마크 추가</h3>
            <form onSubmit={handleAddBookmark} className={cx("addForm")}>
              <input
                type="text"
                placeholder="제목"
                value={newBookmark.title}
                onChange={(e) =>
                  setNewBookmark((prev) => ({ ...prev, title: e.target.value }))
                }
                className={cx("formInput")}
                required
              />
              <input
                type="url"
                placeholder="URL (https://example.com)"
                value={newBookmark.url}
                onChange={(e) =>
                  setNewBookmark((prev) => ({ ...prev, url: e.target.value }))
                }
                className={cx("formInput")}
                required
              />
              <div className={cx("formButtons")}>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className={cx("cancelButton")}
                >
                  취소
                </button>
                <button type="submit" className={cx("submitButton")}>
                  추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 컨텍스트 메뉴 */}
      {contextMenu && (
        <div
          className={cx("contextMenu")}
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => handleDeleteBookmark(contextMenu.bookmarkId)}
            className={cx("contextMenuItem")}
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
