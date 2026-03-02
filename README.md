# 🎩 Wizard of Ounce 🚻

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.18-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Jotai](https://img.shields.io/badge/Jotai-2.16.2-black?style=flat&logo=jotai)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.34.0-0055FF?style=flat&logo=framer&logoColor=white)
![Plotly](https://img.shields.io/badge/Plotly-3.3.1-3F4F75?style=flat&logo=plotly&logoColor=white)

**Next.js 16 (App Router)**와 **Tailwind CSS 4**를 기반으로 구축된 패션 스타일 분석 및 데이터 대시보드 프론트엔드입니다. 백엔드 API(Spring 등)와 연동하여 사용자가 업로드한 이미지를 512/768차원 벡터로 분석한 스타일 분류 결과와, 쇼핑 트렌드 지표, 지점별 매출 랭킹 데이터를 시각화하여 제공합니다.

> 💡 **Tip**
> 자세한 프로젝트 기술 명세 및 구현 결과는 다음 보고서를 참고하세요: [PROJECT_REPORT.md](./PROJECT_REPORT.md)

---

## 🛠 기술 스택 (Tech Stack)

| 구분 | 기술 목록 |
| :--- | :--- |
| **Framework** | Next.js 16.1.6 (App Router), React 19.2.3 |
| **Language** | TypeScript 5.x |
| **Styling** | Tailwind CSS 4.1.18 (PostCSS) |
| **State** | Jotai 2.16.2 (Atomic State) |
| **Visualization** | Plotly.js 3.3.1, Recharts 3.7.0 |
| **Animation** | Framer Motion 12.34.0 |
| **Build Tool** | Turbopack (--turbo) |

---

## 💡 주요 기능 (Key Features)

### 1. 🔍 AI Analysis Studio
두 가지 방식의 분석 입력을 제공합니다.
- **Image Input Engine (Upload)**: 사용자가 업로드한 이미지를 분석하여 유사 스타일 상품 추천
- **Catalog Selection Engine (Curation)**: 데이터베이스 내 기존 상품을 선택하여 유사 스타일 조회
- **Multi-Model Support**: 
  - **512 Dimension Mode**: 512차원 벡터 기반의 스타일 분석 (`imageAnalyze` / `getRecommendList`)
  - **768 Dimension Mode**: 768차원 모델 인코딩을 통한 스타일 분석 (`image768Analyze` / `getRecommend768List`)

### 2. 📊 Analytics Dashboard
매출 랭킹, 쇼핑 트렌드, 그리고 분류된 스타일 분포를 조회할 수 있는 대시보드 구조입니다.
- **Sales Comparison Pipeline**: 최대 2개의 지점을 추가 선택하여 전체 지점 평균과 매출 순위를 나란히 비교할 수 있는 멀티-컬럼 레이아웃(`BestSellersCard`).
- **Latent Space 3D Projections**: `plotly.js`를 이용한 3차원 데이터 시각화(`ScatterPlot.tsx`). 패션 아이템들이 어떤 군집(Cluster)을 형성하는지 렌더링하며, `uirevision` 속성으로 카메라 워킹 동기화를 유지합니다.
- **Trend & Radar Metrics**: `Recharts` 라이브러리를 통해 분석 이미지의 Top 3 스타일 스코어를 방사형(Radar) 차트로 시각화하며, 검색 트렌드 순위와 함께 표시.

### 3. 💾 State Management & Persistence
- **Session History & Backend Bookmark**: `Jotai`를 활용해 최근 분석 이력(History)을 `sessionStorage`에 임시 캐싱하여 페이지 이동 시 유지하고, 북마크(Bookmark)는 사용자 토큰을 통해 백엔드 API와 동기화.
- **Floating Assistant**: 화면 우측 사이드에 고정되는 `FloatingHistory` 컴포넌트를 통해 이전 분석 카드로 이동하거나 뱃지(Badge) 형태의 북마크 개수를 파악할 수 있는 UI 표출.

---

## 📂 폴더 구조 (Directory Structure)

```bash
src/
├── app/
│   ├── api/             # API Service Layer (Native Fetch)
│   ├── (main)/          # Shared-Layout Area
│   │   ├── dashboard/   # Data Visualization Hub
│   │   ├── uploadpage/  # Image Analysis Core
│   │   ├── selectionpage/ # Product Curation
│   └── components/      # UI Atoms & Molecules
├── jotai/               # Global Atomic State
├── types/               # Type Definitions
└── assets/              # Static Assets
```

---

## 🚀 시작하기 (Getting Started)

### 1. 설치 (Installation)
```bash
npm install
```

### 2. 환경 설정 (Configuration)
`.env.local` 파일에 백엔드 API 엔드포인트 및 필요한 환경 변수를 설정하십시오.

### 3. 실행 (Execution)
```bash
npm run dev
```

---
*© 2026 Wizard of Ounce.*
