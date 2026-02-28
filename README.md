# 🎩 Wizard of Ounce: AI Fashion Archive & Analytics

**Next.js 16 (App Router)**와 **Tailwind CSS 4**를 기반으로 구축된 패션 스타일 분석 및 데이터 대시보드 프론트엔드입니다. 백엔드 API(Spring 등)와 연동하여 사용자가 업로드한 이미지를 512/768차원 벡터로 분석한 스타일 분류 결과와, 쇼핑 트렌드 지표, 지점별 매출 랭킹 데이터를 시각화하여 제공합니다.

---

## 🛠 Tech Stack (Core Architecture)

- **Frontend Framework**: `Next.js 16+` (App Router, Turbopack)
- **Programming Language**: `TypeScript` (Strictly typed interfaces)
- **Styling Engine**: `Tailwind CSS 4`
- **State Orchestration**: `Jotai`
- **Data Visualization**: 
  - **Plotly.js**: `Style Vector Spaces` 3D projection
  - **Recharts**: Style distribution analytics
- **Visual Continuity**: `Framer Motion` (Layout transitions & animations)
- **Design System**: Glassmorphism UI with Light/Dark Theme

---

## 🚀 Key Engineering Features

### 1. AI Analysis Studio
두 가지 방식의 분석 입력을 제공합니다.
- **Image Input Engine (Upload)**: 사용자가 업로드한 이미지를 분석하여 유사 스타일 상품 추천
- **Catalog Selection Engine (Curation)**: 데이터베이스 내 기존 상품을 선택하여 유사 스타일 조회
- **Multi-Model Support**: 
  - **512 Dimension Mode**: 512차원 벡터 기반의 스타일 분석 (`imageAnalyze` / `getRecommendList`)
  - **768 Dimension Mode**: 768차원 모델 인코딩을 통한 스타일 분석 (`image768Analyze` / `getRecommend768List`)

### 2. Analytics Dashboard
매출 랭킹, 쇼핑 트렌드, 그리고 분류된 스타일 분포를 조회할 수 있는 대시보드 구조입니다.
- **Sales Comparison Pipeline**: 최대 2개의 지점을 추가 선택하여 전체 지점 평균과 매출 순위를 나란히 비교할 수 있는 멀티-컬럼 레이아웃(`BestSellersCard`).
- **Latent Space 3D Projections**: `plotly.js`를 이용한 3차원 데이터 시각화(`ScatterPlot.tsx`). 패션 아이템들이 어떤 군집(Cluster)을 형성하는지 렌더링하며, `uirevision` 속성으로 카메라 워킹 동기화를 유지합니다.
- **Trend & Radar Metrics**: `Recharts` 라이브러리를 통해 분석 이미지의 Top 3 스타일 스코어를 방사형(Radar) 차트로 시각화하며, 검색 트렌드 순위와 함께 표시.
- **Brand Color Gradient**: [진한 보라 - 보라 - 연한 보라]로 이어지는 시퀀스 컬러를 내비게이션 바에 적용하여 테마 구축.

### 3. State Management & Persistence
- **Session History & Backend Bookmark**: `Jotai`를 활용해 최근 분석 이력(History)을 `sessionStorage`에 임시 캐싱하여 페이지 이동 시 유지하고, 북마크(Bookmark)는 사용자 토큰을 통해 백엔드 API와 동기화.
- **Floating Assistant**: 화면 우측 사이드에 고정되는 `FloatingHistory` 컴포넌트를 통해 이전 분석 카드로 이동하거나 뱃지(Badge) 형태의 북마크 개수를 파악할 수 있는 UI 표출.

### 4. Frontend Engineering 
- **Dynamic Chart Import (next/dynamic)**: SSR 렌더링 환경에서 `window` 객체 부재로 발생하는 서드파티 시각화 라이브러리(`react-plotly.js`) 에러 방지를 위해 클라이언트 지연 로딩(dynamic loading) 적용. 
- **Next.js Extended Fetch API**: 서드파티 라이브러리 없이 Next.js의 Native `fetch`를 활용한 API 연동(`src/app/api`). 요구사항에 맞춰 `{ revalidate: 3600 }` (ISR 캐싱) 및 `{ cache: 'no-store' }` (SSR) 옵션을 혼합 적용.
- **Turbopack Build**: 로컬 개발 서버 구동 시 Next.js의 `--turbo` 번들러 옵션을 적용하여 파일 교체 속도(HMR) 단축.
- **Route Groups**: `app/(main)`과 같은 Route Group 폴더 분할 방식을 채택하여 URL 경로(`/`)를 변경하지 않고 공통 레이아웃 분리.

---

## 📂 System Architecture (Directory Structure)

```bash
src/
├── app/
│   ├── api/             # API Service Abstraction (member, product, image, sales)
│   ├── (main)/          # Shared-Layout Application Area
│   │   ├── dashboard/   # Multi-Dimensional Data Visualization (Plotly-map, Stats)
│   │   ├── uploadpage/  # Image-to-Style Analysis Core
│   │   ├── selectionpage/ # Database-driven Product Curation
│   │   └── memberinfo/  # Profile & Credential Management
│   └── components/      # UI Atoms & Molecules (Studio, AnalysisSection, ResultGrid)
├── jotai/               # Global Atoms (State, History, Model-Mode)
├── types/               # Single Source of Truth for TS Interfaces
└── assets/              # Static SVG Assets & Brand Icons
```

---

## 💻 Technical Overview (Development)

1. **Dependency Setup**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   `.env.local` 파일에 백엔드 API 엔드포인트 및 OAuth 클라이언트 정보를 설정하십시오.

3. **Runtime**:
   ```bash
   npm run dev
   ```

---
*© 2026 Wizard of Ounce.*
