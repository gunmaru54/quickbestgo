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

### 실제 프로젝트 루트

> **중요**: 소스 코드는 `quickBestGo/` 서브디렉토리에 있음. 파일 경로 참조 시 항상 `quickBestGo/src/`를 기준으로 할 것.

```
QuickBestGo/           ← git root (CLAUDE.md 위치)
└── quickBestGo/       ← 실제 Next.js 프로젝트 루트 (npm run build 실행 위치)
    ├── src/
    ├── public/
    └── package.json
```

### 디렉토리 구조
```
quickBestGo/src/
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
    ├── tools.ts            # 툴 목록 단일 소스 (TOOLS 배열)
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

### TypeScript 규칙
- `any` 타입 사용 금지. 타입을 모를 경우 `unknown`으로 받고 좁혀나갈 것.
- `tsconfig.json`의 `strict: true` 위반 코드 절대 추가 금지.
- 외부 라이브러리 타입이 없을 경우 `@types/` 패키지 탐색 후 없으면 최소한의 `declare module` 작성.

### 의존성 관리
- 패키지 추가 전 번들 크기 영향 검토 (`bundlephobia.com` 참고). 정적 사이트이므로 JS 크기가 곧 사용자 경험.
- 동일 기능이 있다면 새 패키지 추가보다 기존 코드 확장 우선.
- `npm audit` 결과 high/critical 취약점은 즉시 수정. moderate는 다음 릴리즈에서 처리.
- `package-lock.json` 커밋 필수. 버전 고정이 재현 가능한 빌드의 전제조건.

---

## 유지보수 지침

### 새 툴 추가 절차
1. `quickBestGo/src/app/[lang]/[tool-slug]/page.tsx` 생성
2. `quickBestGo/src/components/tools/[ToolName].tsx` 클라이언트 컴포넌트 생성
3. `quickBestGo/src/lib/tools.ts`의 TOOLS 배열에 항목 추가
4. 각 언어 사전 파일(`quickBestGo/src/dictionaries/`)에 번역 키 추가
   - 필수 키: `title`, `meta_title`, `meta_description`, `about_title`, `about_p1~p3`
   - **GEO 필수 키**: `faq_title`, `faq` (Q&A 배열, 최소 3개) — 5개 언어 모두
5. `quickBestGo/src/app/sitemap.ts`에 새 경로 등록
6. `quickBestGo/` 에서 `npm run build`로 전체 빌드 검증

### 언어 추가 절차
1. `quickBestGo/src/lib/i18n.ts`의 `SUPPORTED_LOCALES`에 언어 코드 추가
2. `quickBestGo/src/dictionaries/[lang].json` 사전 파일 생성
3. `quickBestGo/src/lib/seo.ts`의 `getLanguageAlternates`, `getOgLocale` 업데이트

### AdSense 관련 주의사항
- `quickBestGo/src/app/layout.tsx`의 AdSense 스크립트는 일반 `<script>` 태그로 유지 (next/script 사용 금지)
- `quickBestGo/public/ads.txt`의 publisher ID와 layout.tsx의 `ca-pub-*` 값이 일치해야 함
- CSP 헤더는 `quickBestGo/public/_headers`에서 관리 (Cloudflare Pages가 읽음)

### 로컬 개발 서버

**서버 시작**:
```bash
cd quickBestGo
npm run dev -- --port 3000
```

**소스 수정 후 필수 규칙**:

> **Claude는 소스 파일을 수정할 때마다, 작업 완료 후 반드시 아래 원스텝 명령을 실행해야 한다.**
> 설명·확인 없이 즉시 실행. 이 규칙은 예외 없이 적용된다.

```bash
netstat -ano | grep ":3000" | awk '{print $5}' | sort -u | xargs -I{} taskkill //PID {} //F 2>&1; rm -rf quickBestGo/.next && cd quickBestGo && npm run dev -- --port 3000
```

**반복 발생하는 캐시 에러 처리**:

아래 에러가 발생하면 `.next` 캐시 불일치 문제다. 코드 변경 후 chunk 번호가 바뀌었는데 이전 캐시가 남아 충돌하는 Next.js의 알려진 문제.

```
Error: Cannot find module './XXXX.js'
Require stack:
- .next\server\webpack-runtime.js
...
```

**조치 순서** (반드시 이 순서대로):
1. 3000 포트 프로세스 강제 종료
   ```bash
   netstat -ano | grep ":3000" | awk '{print $5}' | sort -u | xargs -I{} taskkill //PID {} //F
   ```
2. `.next` 캐시 삭제
   ```bash
   rm -rf quickBestGo/.next
   ```
3. 서버 재시작
   ```bash
   cd quickBestGo && npm run dev -- --port 3000
   ```

> Claude가 이 에러를 만나거나, 소스를 수정한 직후에는 위 3단계를 즉시 실행할 것. 원인 설명보다 조치 우선.

---

### 배포 프로세스

**브랜치 전략** (1인 프로젝트 기준):
- 소규모 수정(오타, 번역 추가 등): `main` 직접 push 허용
- 새 툴 추가 / 구조 변경: `feature/[tool-name]` 브랜치 → PR → squash merge
  - PR을 올리면 Cloudflare Pages가 **Preview URL을 자동 생성** → 브라우저에서 직접 확인 후 merge

**배포 흐름**:
```
로컬 npm run build 성공
  → main push (또는 PR merge)
    → GitHub → Cloudflare Pages 자동 빌드
      → 빌드 성공: 프로덕션 자동 반영
      → 빌드 실패: Cloudflare Pages 대시보드 빌드 로그 확인
```

**롤백**:
- Cloudflare Pages 대시보드 → Deployments 탭 → 이전 빌드 선택 → "Rollback to this deployment" 클릭
- 1분 내 이전 버전으로 즉시 복구. 코드 revert 불필요.
- 롤백 후 원인 파악 → fix → 재배포.

---

## GEO (Generative Engine Optimization) 지침

ChatGPT, Perplexity, Claude 등 AI 검색 엔진이 콘텐츠를 인용하도록 최적화하는 규칙.

### 현재 구현된 GEO 구조

```
seo.ts
├── generateOrganizationSchema()   → 루트 layout.tsx에 삽입 (사이트 권위 신호)
├── generateWebSiteSchema()        → 홈 페이지에 삽입 (SearchAction 포함)
├── generateWebApplicationSchema() → 각 툴 페이지에 삽입 (WebApplication + BreadcrumbList)
└── generateFAQSchema()            → ToolPageTemplate + 홈 페이지에 자동 삽입

ToolPageTemplate.tsx
└── faq prop (optional)            → FAQPage JSON-LD 삽입 + FAQ 섹션 렌더링
```

### FAQ 작성 원칙

GEO에서 FAQ는 AI 인용의 핵심 소스다. 아래 원칙을 따를 것:

- **질문**: 사용자가 실제로 검색할 만한 자연어 문장 형식 ("How do I...", "What is...")
- **답변**: 첫 문장에 핵심 정보 포함. 간결하되 완결성 있게 (2~4문장).
- **개수**: 툴당 최소 3개, 홈 페이지 5개
- **중복 금지**: 같은 툴 내 Q끼리 겹치는 내용 없이 각각 다른 관점에서 작성

### 사전 키 구조 (툴별, 5개 언어 동일)

```json
"[tool_key]": {
  "faq_title": "Frequently Asked Questions",
  "faq": [
    {"q": "질문1?", "a": "답변1."},
    {"q": "질문2?", "a": "답변2."},
    {"q": "질문3?", "a": "답변3."}
  ]
}
```

### 새 툴 추가 시 GEO 체크포인트

1. 사전 5개 파일에 `faq_title` + `faq` 추가 (각 언어로 번역)
2. 툴 `page.tsx`에서 `ToolPageTemplate`에 `faq={{ title: d.faq_title, items: d.faq }}` 전달
3. FAQ가 실제로 페이지에 렌더링되는지 빌드 후 브라우저에서 확인

### GEO에 영향을 주는 기존 구현 (변경 금지)

- `ToolPageTemplate`의 FAQ `<dl>/<dt>/<dd>` 구조 — AI 크롤러가 시맨틱 HTML로 파싱
- `generateFAQSchema()`의 `FAQPage` + `Question` + `Answer` 타입 — schema.org 표준
- `generateOrganizationSchema()`의 루트 삽입 위치 — 사이트 권위 신호로 모든 페이지에 적용

---

## 테스트 규칙

### 원칙: 테스트 대상을 선별한다
정적 사이트이고 UI 중심이므로 전체 커버리지를 목표로 하지 않음. **수식 오류가 사용자에게 잘못된 정보를 주는 로직**에 집중.

**테스트 작성 대상** (Vitest 사용):
- 계산기류: BMI, 복리 계산, GPA, 칼로리, 팁, 나이, 날짜 차이 — 수식 정확성
- 인코더/포맷터: Base64, URL Encoder, JSON Formatter — 엣지 케이스 (빈 입력, 특수문자, 유니코드)
- 다국어 유틸: `i18n.ts`의 딕셔너리 로더 — 누락 키 탐지

**테스트 작성 불필요**:
- UI 렌더링 (Coin Flip, Wheel Spinner 등 랜덤 로직)
- Tailwind 스타일링, 테마 전환
- Next.js 라우팅 (`generateStaticParams` 등 프레임워크 책임)

### Vitest 설정 위치
- 설정 파일: `quickBestGo/vitest.config.ts`
- 테스트 파일: 컴포넌트/라이브러리와 같은 디렉토리에 `*.test.ts` 형식으로 배치
  - 예: `quickBestGo/src/lib/bmi.test.ts`

### 테스트 작성 기준
- 새 계산기 툴 추가 시 핵심 수식 함수를 순수함수로 분리하고 단위 테스트 필수
- 기존 툴의 수식을 수정할 경우 테스트 먼저 작성(Red) → 수정(Green) 순서 권장
- 테스트 하나당 하나의 동작만 검증. 복잡한 setup보다 단순한 케이스 여러 개.

### 새 툴 추가 시 체크리스트 업데이트
수식/인코딩 로직이 있는 툴은 체크리스트에 테스트 항목 추가:
- [ ] 핵심 계산 로직이 순수함수로 분리되어 있는가
- [ ] 경계값(0, 음수, 최대값) 테스트 케이스 포함

---

## 보안 지침

### XSS 방어
- `dangerouslySetInnerHTML` 사용 절대 금지. 필요하다고 판단되면 반드시 사전 협의.
- 사용자 입력을 DOM에 직접 삽입하는 패턴 금지 — JSON Formatter, Base64, URL Encoder 등 모든 입력 처리 툴에 해당.
- 외부 URL을 `href`/`src`에 넣을 때 `javascript:` 프로토콜 차단 검증 필요.

### 입력 크기 제한
- 클라이언트 전용 툴이라도 거대한 입력(수십 MB 문자열 등)이 브라우저를 멈출 수 있음.
- textarea 등 입력 요소에는 `maxLength` 또는 런타임 길이 체크를 반드시 적용.
- 기준: 일반 텍스트 툴 100KB, JSON/Base64 처리 툴 500KB 이하.

### CSP 정책 관리
- 새 외부 도메인(폰트, 분석 도구 등) 추가 시 `quickBestGo/public/_headers`의 CSP에 해당 도메인을 명시적으로 추가할 것.
- `unsafe-inline`은 AdSense 때문에 불가피하게 허용된 상태. 추가로 `unsafe-eval`은 절대 추가 금지.
- 새 도메인 추가 후 로컬에서 브라우저 콘솔 CSP 위반 없는지 확인.

### 민감 정보 취급
- API 키, 시크릿 등을 소스 코드에 하드코딩 금지. 정적 사이트이므로 빌드 시 환경 변수로 주입하거나 클라이언트 노출이 허용된 값만 사용.
- `ca-pub-*` AdSense ID는 공개 정보이므로 코드에 있어도 무방.
- `.env.local` 파일은 git에 커밋 금지 (`.gitignore` 확인).

### 서드파티 스크립트
- 새 외부 스크립트 추가 시 해당 도메인의 신뢰성과 필요성을 먼저 검토.
- 가능하면 SRI(Subresource Integrity) 해시를 `integrity` 속성으로 명시.
- AdSense 외 분석/마케팅 스크립트 추가는 성능과 CSP 영향을 함께 평가.

### 접근성(a11y) 최소 기준
- 모든 `<input>`, `<button>`, `<select>`에 연결된 `<label>` 또는 `aria-label` 필수.
- 키보드만으로 모든 툴의 핵심 기능 사용 가능해야 함 (Tab, Enter, Space).
- 색상만으로 상태를 구분하지 말 것 (에러 표시 시 아이콘 또는 텍스트 병행).
- 접근성은 SEO 랭킹에도 직접 영향을 미치므로 선택이 아닌 필수.

---

## 리팩토링 원칙

- **중복 제거**: 동일 코드가 3곳 이상이면 추출 검토
- **단일 소스**: 상수(언어 목록, 툴 목록)는 한 곳에서만 정의
- **점진적 개선**: 한 번에 하나의 패턴만 리팩토링. 대규모 일괄 변경 지양.
- **빌드 검증 필수**: 각 리팩토링 단계마다 `npm run build` 실행
- **변경 요약 제공**: 수정 완료 후 변경 파일 목록과 변경 이유 간략히 정리

---

## 유지보수 품질 기준

### 새 툴 추가 시 보안/품질 체크리스트
새 툴을 추가한 후 PR 전에 아래 항목을 직접 확인할 것:

- [ ] 사용자 입력에 `maxLength` 또는 크기 제한 적용
- [ ] 출력 결과를 DOM에 삽입하는 경우 XSS 위험 없는지 확인
- [ ] 모든 입력 요소에 `aria-label` 또는 연결된 `<label>` 존재
- [ ] 키보드만으로 핵심 기능 동작 확인
- [ ] 5개 언어 사전 키 누락 없음 (`quickBestGo/src/dictionaries/*.json`)
- [ ] **GEO**: `faq_title` + `faq` 배열(최소 3개 Q&A)이 5개 언어 모두에 있는지 확인
- [ ] **GEO**: 툴 페이지에서 `faq` prop이 `ToolPageTemplate`에 전달되는지 확인
- [ ] 계산/인코딩 로직이 있으면 핵심 수식 단위 테스트 작성
- [ ] `npm run build` 경고/에러 없음
- [ ] CF Pages Preview URL에서 브라우저 직접 확인

### 성능 기준
- 정적 사이트이므로 초기 JS 번들이 사용자 경험을 결정. 새 패키지 추가 시 `build` 후 청크 크기 변화 확인.
- 이미지가 필요한 경우 WebP 또는 SVG 우선. PNG/JPG는 최대 100KB 이하.
- `useEffect` 내 무거운 연산은 `setTimeout`으로 비동기 처리하여 첫 렌더 블로킹 방지.

### 코드 리뷰 기준 (자기 검토)
변경 완료 후 제출 전 자문:
1. 이 변경이 없었다면 무엇이 깨지는가? (필요성 확인)
2. 더 단순하게 만들 수 있는가? (과도한 추상화 점검)
3. 6개월 후의 내가 이 코드를 읽으면 이해할 수 있는가? (가독성 점검)
