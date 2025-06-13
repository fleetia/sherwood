# sherwood - Chrome Extension

Fleetia 모노레포의 크롬 확장프로그램 프로젝트입니다.

## 개발 환경 설정

### 의존성 설치
```bash
yarn install
```

### 개발 서버 실행
```bash
yarn dev
```

### 빌드
```bash
yarn build
```

### 확장프로그램 패키징
```bash
yarn pack
```

### 테스트 실행
```bash
# 테스트 실행
yarn test

# 테스트 UI
yarn test:ui

# 테스트 한 번 실행
yarn test:run
```

## 프로젝트 구조

```
src/
├── popup/           # 팝업 UI
├── options/         # 옵션 페이지
├── background/      # 백그라운드 스크립트
├── content/         # 콘텐츠 스크립트
├── components/      # 공통 컴포넌트
└── test/           # 테스트 설정
```

## 기술 스택

- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구
- **SCSS** - 스타일링
- **Vitest** - 테스트 프레임워크
- **Chrome Extension Manifest V3** - 확장프로그램 API

## 확장프로그램 설치 방법

1. `yarn build`로 빌드
2. Chrome 브라우저에서 `chrome://extensions/` 접속
3. "개발자 모드" 활성화
4. "압축해제된 확장 프로그램을 로드합니다" 클릭
5. `dist` 폴더 선택

## 주요 기능

- 팝업 UI를 통한 확장프로그램 제어
- 옵션 페이지에서 설정 관리
- 웹페이지에 콘텐츠 스크립트 주입
- Chrome Storage API를 통한 데이터 저장 