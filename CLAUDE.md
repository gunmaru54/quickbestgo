# QuickBestGo — Claude Code 지침

## 개발자 프로필

- **경력**: 30년차 시니어 풀스택 개발자
- **성향**: 단순하고 명확한 코드를 선호. 과도한 추상화나 불필요한 복잡성을 지양.
- **기대 수준**: 코드 변경 시 이유와 트레이드오프를 명확히 설명할 것. 자명한 코드에는 주석 불필요.

---

## 프로젝트 개요

- **기술 스택**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **빌드 방식**: `output: 'export'` — 정적 HTML 빌드, Next.js 서버 없음
- **배포**: Cloudflare Pages (GitHub 연동 자동 배포)
- **다국어**: `src/app/[lang]/` — ko, en, es, ja, pt 5개 언어 지원

### 디렉토리 구조

```
src/
├── app/
│   ├── layout.tsx          # 루트 레이아웃 (AdSense, 메타데이터)
│   ├── page.tsx            # 루트 페이지 (/ → /en 렌더링)
│   └── [lang]/
│       ├── layout.tsx      # 언어별 레이아웃 (ThemeProvider 포함)
│       ├── page.tsx        # 홈 (툴 목록)
│       └── [tool]/page.tsx # 각 툴 페이지
├── components/
│   ├── tools/              # 툴별 클라이언트 컴포넌트
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ThemeProvider.tsx
└── lib/
    ├── i18n.ts             # 다국어 사전 로더
    └── seo.ts              # 메타데이터 생성 유틸
```

---

## 코딩 규칙

### 일반 원칙
- 요청된 범위만 수정. 관련 없는 코드 정리 금지.
- 새 파일 생성 전에 기존 파일 수정 가능한지 먼저 검토.
- `npm run build` 성공이 모든 변경의 완료 조건.

### 정적 빌드 제약 (`output: 'export'`)
- `next/script strategy="beforeInteractive"` 사용 금지 → 정적 HTML에 삽입되지 않음
- 서버 전용 API (`headers()`, `cookies()` 등) 사용 불가
- 외부 스크립트 삽입 시 반드시 일반 `<script>` 태그 사용

### 다국어 페이지 작성 규칙
- 모든 tool page는 `generateStaticParams`에서 동일한 5개 언어를 반환해야 함
- 언어 목록이 변경될 경우 `src/lib/i18n.ts`의 `SUPPORTED_LOCALES`를 단일 소스로 유지

### 컴포넌트 분리 기준
- 클라이언트 상태(`useState`, `useEffect`)가 필요한 경우에만 `"use client"` 선언
- 공통 레이아웃 반복이 3개 이상의 페이지에 걸칠 때 컴포넌트 추출 검토

---

## 유지보수 지침

### 새 툴 추가 절차
1. `src/app/[lang]/[tool-slug]/page.tsx` 생성
2. `src/components/tools/[ToolName].tsx` 클라이언트 컴포넌트 생성
3. `src/lib/tools.ts`의 툴 목록 배열에 항목 추가
4. 각 언어 사전 파일(`src/dictionaries/`)에 번역 키 추가
5. `src/app/sitemap.ts`에 새 경로 등록
6. `npm run build`로 전체 빌드 검증

### 언어 추가 절차
1. `src/lib/i18n.ts`의 `SUPPORTED_LOCALES`에 언어 코드 추가
2. `src/dictionaries/[lang].json` 사전 파일 생성
3. `src/lib/seo.ts`의 `getLanguageAlternates`, `getOgLocale` 업데이트

### AdSense 관련 주의사항
- `src/app/layout.tsx`의 AdSense 스크립트는 일반 `<script>` 태그로 유지 (next/script 사용 금지)
- `public/ads.txt`의 publisher ID와 layout.tsx의 `ca-pub-*` 값이 일치해야 함
- CSP 헤더는 `public/_headers`에서 관리 (Cloudflare Pages가 읽음)

### 배포 프로세스
- `main` 브랜치에 push → GitHub → Cloudflare Pages 자동 빌드/배포
- 로컬 검증: `npm run build` → `out/` 디렉토리 생성 확인
- 빌드 실패 시 Cloudflare Pages 대시보드에서 빌드 로그 확인

---

## 리팩토링 원칙

- **중복 제거**: 동일 코드가 3곳 이상이면 추출 검토
- **단일 소스**: 상수(언어 목록, 툴 목록)는 한 곳에서만 정의
- **점진적 개선**: 한 번에 하나의 패턴만 리팩토링. 대규모 일괄 변경 지양.
- **빌드 검증 필수**: 각 리팩토링 단계마다 `npm run build` 실행
- **변경 요약 제공**: 수정 완료 후 변경 파일 목록과 변경 이유 간략히 정리
