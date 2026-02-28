# 📊 AI 패션 분석 대시보드 기술 명세 보고서 (Project Technical Report)

**프로젝트명**: Wizard of Ounce (The AI Fashion Archive)
**마지막 업데이트**: 2026년 2월 27일

본 보고서는 `mainproject_frontend` 코드베이스의 실제 구현체와 기술적 의결 사항을 기록한 공식 명세입니다. 일반적인 패러다임을 넘어, 비동기 데이터 처리 최적화와 브라우저 제약 조건(SSR 충돌 등)을 극복하기 위해 설계된 프론트엔드 관점의 해결 방식들을 중점적으로 설명합니다.

---

## 1. 🏗 시스템 아키텍처 및 데이터 흐름

### 1-1. 분석 파이프라인
사용자가 이미지를 업로드하거나 상품을 선택하면 다음과 같은 단계를 거칩니다.
1. **Model Selection**: 사용자는 분석 모드(512차원 또는 768차원)를 선택하여 엔진의 정밀도를 결정할 수 있습니다.
2. **Context Switching**: 선택된 엔진(`modelModeAtom`)에 따라 전용 API(`imageAnalyze` vs `image768Analyze` 혹은 `getRecommendList` vs `getRecommend768List`)로 동적 라우팅됩니다.
3. **Transition Management**: `React 18`의 `useTransition`을 활용하여 무거운 렌더링 작업 중에도 UI가 멈추지 않고 부드럽게 대기 상태(Skeleton UI)를 표시하도록 최적화했습니다.

### 1-2. 통합 분석 컨테이너 (Studio Container)
과거 분리되어 있던 Upload 화면과 Explore 화면을 하나의 **`Studio.tsx`** 컨테이너로 통합했습니다.
이 구조를 통해 어떤 입력(직접 업로드 vs DB 검색)이 들어오든, 분석 완료 후 나타나는 `AnalysisSection`(진단 보고서)과 `ResultGrid`(추천 리스트) 레이아웃을 100% 동일하게 재사용하며 코드 중복을 제거했습니다.

### 1-3. API 통신 및 데이터 페칭
백엔드(`Spring` 등)와의 통신을 위해 서드파티 라이브러리를 배제하고 Next.js의 Native `fetch` API를 활용하여 네트워크 레이어를 구축했습니다 (`src/app/api`).
*   **Next.js Data Caching**: 전체 지점 매출 데이터(`getSalesRanking`)는 `next: { revalidate: 3600 }` 옵션을 포함하여 캐싱하며, 특정 지점/기간 비교나 지점 목록 동기화(`getShopList`)는 `cache: 'no-store'`로 설정하여 실시간 데이터를 패치합니다.
*   **보안 인증 (JWT)**: `getBookmarkAPI`, `getUserInfoAPI` 등의 회원 서비스는 `Authorization: Bearer ${accessToken}` 헤더를 통해 통신을 수행합니다.
*   **FormData & 에러 핸들링**: 분석 요청 시 바이너리 파일(`File`)을 `FormData` 객체로 감싸 전송하며, 네트워크 장애 시 에러를 Throw하는 대신 `null`이나 `[]`를 반환하도록 설계해 크래시가 발생하지 않고 폴백 화면을 렌더링하도록 처리했습니다.

---

## 2. 🛡 기술적 도전 과제 및 해결 (Engineering Challenges)

### 2-1. Window Object 에러 (Plotly.js SSR 충돌) 방어
*   **문제**: `react-plotly.js`가 내부적으로 브라우저 `window` 객체를 참조하는데, Next.js의 서버 사이드 렌더링(SSR) 환경에서는 `window`가 없으므로 "Window is not defined" 크래시 발생.
*   **해결**: Next.js의 `next/dynamic` 모듈을 사용하여 차트 컴포넌트를 `ssr: false` 옵션으로 동적 임포트(Dynamic Import). 클라이언트 사이드에서만 렌더링되게 하여 에러 원천 차단.

### 2-2. 파일 잠금(File Locking) 및 상태 동기화 이슈
*   **문제**: Windows 환경의 로컬 개발 서버(`npm run dev`)에서 파일 이동/삭제 시 OS 차원의 파일 Lock 현상으로 빌드 충돌 발생.
*   **해결**: `GEMINI.md`에 AI 개발 룰을 추가하여, 물리적 폴더/파일 삭제는 사용자가 GUI로 진행하고 AI는 리팩토링 역할만 수행하도록 시스템 원칙 수립 (에러 제로화).

### 2-3. 상태 관리 및 세션 영속성
*   **History & Bookmark**: `Jotai`의 `atomWithStorage`를 도입하여 사용자의 '최근 분석 히스토리' 데이터를 브라우저 `sessionStorage`에 보존하고, '북마크(찜)' 데이터는 로그인 계정 기반으로 백엔드 API와 동기화하여 데이터를 조회합니다.

---

## 3. 🎨 UI/UX 디자인 시스템 명세

### 3-1. 라이트/다크 테마
*   **Light Mode (Sunlight)**: 태양광 이펙트와 글래스모피즘(Glassmorphism) 적용.
*   **Dark Mode (Celestial)**: `Framer Motion`으로 제어되는 별(Twinkling Stars) 이펙트와 바이올렛 포인트 컬러 중심의 테마.

### 3-2. 시각화 차트 및 데이터 표시
*   **Latent Space 3D Projection (Plotly.js)**: 수천 개의 벡터 데이터를 3차원 공간에서 시각화(`ScatterPlot.tsx`). 클러스터링된 데이터 점들의 분포를 렌더링하기 위해 투명도(opacity)와 마커 사이즈(marker.size) 조절.
*   **Camera Angle Persistence**: 3D 공간 안에서 데이터 렌더링이 갱신될 때마다 `uirevision` 속성을 활용하여 사용자 카메라 상태 유지.
*   **Radar Chart & Style Distribution**: 추출된 Top 3 스타일 점수를 `Recharts` 기반의 방사형(Radar) 차트로 시각화하며, 파이 차트로 카테고리 분포도 매핑.
*   **BestSellers Pipeline**: [전체 지점 + 비교 슬롯 2개] 단위의 데이터 컴포넌트(`BestSellersCard`)를 구축하여, 지점별 매출 랭킹 비교.
*   **북마크 (Floating Bookmark UI)**: 우측 컴포넌트(`FloatingHistory.tsx`)를 통해 북마크(찜)한 아이템 개수를 뱃지로 표시.

### 3-3. UI 레이아웃
*   **App Router Structural Reorganization**: 기존의 경로 라우팅을 Route Group `(main)` 구조로 변경하여, 접속 시 메인 경로(`/`) 경험 제공.
*   **Main Page Navigation (`/`)**: 메인 페이지 진입 시, 3분할 카드 뷰(Upload Studio / Explore Catalog / Analytics Dashboard)를 제공하여 라우팅.
*   **Sequential Color System**: [Violet-800 → 600 → 400]으로 이어지는 보라색 컬러를 커스텀 테마로 적용.

---

## 4. 📂 주요 폴더 구조 및 역할 (Detailed)

- `src/app/(main)/components`: 핵심 UI 조각들. `Studio.tsx` (분석 컨테이너), `FloatingHistory.tsx` (사이드바 히스토리/북마크), `ResultGrid.tsx` (결과 리스트) 등.
- `src/app/(main)/dashboard`: 패션 동향과 데이터 지표, `ScatterPlot.tsx`(3D 데이터 시각화) 등이 모여있는 통계 레이아웃 허브.
- `src/app/(main)/uploadpage & selectionpage`: 사용자가 진입하는 2개의 분리된 엔진 페이지(컨텐츠는 내부적으로 Studio.tsx 공유).
- `src/jotai/`: `historyJotai.ts`, `loginjotai.ts` 등 브라우저 상태를 전역으로 캐싱하고 관리하는 스토리지 모듈.

---
*본 보고서는 2026년 2월 27일 기준 프로젝트 코드베이스의 실제 구현 상태를 바탕으로 작성되었습니다.*
