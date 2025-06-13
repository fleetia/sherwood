/**
 * Vitest 테스트 설정 파일
 * TESTREF 태그: vitest.dev 사이트 스펙에 따른 설정
 */

import { beforeAll, afterEach, vi } from "vitest";

// 전역 설정
beforeAll(() => {
  // Chrome API 모킹
  (global as any).chrome = {
    runtime: {
      onInstalled: {
        addListener: vi.fn(),
      },
      onMessage: {
        addListener: vi.fn(),
      },
      sendMessage: vi.fn(),
    },
    storage: {
      sync: {
        get: vi.fn(),
        set: vi.fn(),
      },
    },
  };
});

// 각 테스트 후 정리
afterEach(() => {
  vi.clearAllMocks();
}); 