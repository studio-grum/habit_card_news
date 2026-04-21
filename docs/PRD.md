# PRD: 개인 개발 블로그 (Notion CMS 기반)

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | 개인 개발 블로그 |
| 목적 | Notion을 CMS로 활용한 개인 기술 블로그 |
| 대상 사용자 | 개발자 본인 (작성자), 블로그 방문자 (독자) |
| 배포 환경 | Vercel |

### CMS로 Notion을 선택한 이유
Notion에서 글을 작성하면 별도의 배포 없이 블로그에 자동 반영된다. 마크다운 에디터보다 편리한 Notion 편집 환경을 그대로 활용할 수 있다.

---

## 2. 기술 스택

| 분류 | 기술 |
|------|------|
| Frontend | Next.js 15 (App Router), TypeScript |
| CMS | Notion API (`@notionhq/client`) |
| Styling | Tailwind CSS, shadcn/ui |
| Icons | Lucide React |
| Deployment | Vercel |

---

## 3. Notion 데이터베이스 구조

| 필드명 | 타입 | 설명 |
|--------|------|------|
| Title | title | 글 제목 |
| Category | select | 카테고리 (예: React, Next.js, TypeScript) |
| Tags | multi_select | 태그 (복수 선택) |
| Published | date | 발행일 |
| Status | select | `초안` / `발행됨` |
| Content | page content | 본문 (Notion 페이지 블록) |

> `Status`가 `발행됨`인 글만 블로그에 노출된다.

---

## 4. 주요 기능

### 4.1 Notion 데이터베이스 연동
- Notion API를 통해 데이터베이스 쿼리
- `Status = 발행됨` 필터 적용
- `Published` 기준 내림차순 정렬

### 4.2 글 목록 (홈)
- 최근 발행된 글 목록 표시
- 글 카드: 제목, 카테고리, 태그, 발행일 포함
- 페이지네이션 또는 무한 스크롤 (MVP: 최신 20개)

### 4.3 글 상세 페이지
- Notion 페이지 블록을 HTML로 변환하여 렌더링
- 지원 블록: 단락, 제목(H1~H3), 코드, 인용, 목록, 이미지
- 이전/다음 글 네비게이션

### 4.4 카테고리 필터링
- 카테고리별 글 목록 페이지
- URL: `/category/[category]`

### 4.5 검색 기능
- 제목 기준 클라이언트 사이드 검색
- MVP: 전체 글 목록 내 필터링 방식

### 4.6 반응형 디자인
- 모바일(375px), 태블릿(768px), 데스크탑(1280px) 대응
- Tailwind CSS 브레이크포인트 활용

---

## 5. 화면 구성

### 5.1 홈 (`/`)
- 최근 글 목록 그리드
- 카테고리 필터 탭
- 검색 입력창

### 5.2 글 상세 (`/posts/[slug]`)
- 글 제목, 카테고리, 태그, 발행일
- 본문 렌더링
- 이전/다음 글 링크

### 5.3 카테고리 (`/category/[category]`)
- 선택한 카테고리의 글 목록
- 홈과 동일한 카드 레이아웃

---

## 6. MVP 범위

### 포함
- [x] Notion API 연동 (글 목록, 글 상세)
- [x] 홈 글 목록 페이지
- [x] 글 상세 페이지 (기본 블록 렌더링)
- [x] 카테고리 필터링
- [x] 기본 반응형 디자인

### 제외 (v2 이후)
- [ ] 댓글 기능
- [ ] RSS 피드
- [ ] 다크 모드
- [ ] OG 이미지 자동 생성
- [ ] 태그별 필터링 페이지
- [ ] 전체 텍스트 검색 (Algolia 등)

---

## 7. 구현 단계

### Phase 1: 환경 설정
1. `@notionhq/client` 패키지 설치
2. Notion Integration 생성 및 API 키 발급
3. `.env.local`에 `NOTION_API_KEY`, `NOTION_DATABASE_ID` 설정
4. Notion 데이터베이스 생성 및 Integration 연결

### Phase 2: API 레이어
5. `lib/notion.ts` — Notion 클라이언트 초기화
6. `getPostList()` — 발행된 글 목록 조회
7. `getPostBySlug()` — 개별 글 조회
8. `getPostBlocks()` — 페이지 블록 조회

### Phase 3: 페이지 구현
9. 홈 페이지 (`app/page.tsx`) — 글 목록 렌더링
10. 글 상세 페이지 (`app/posts/[slug]/page.tsx`)
11. 카테고리 페이지 (`app/category/[category]/page.tsx`)

### Phase 4: 스타일링 및 최적화
12. shadcn/ui 컴포넌트 적용
13. 반응형 레이아웃 완성
14. `generateStaticParams` + ISR 설정
15. 메타데이터 (title, description, OG) 설정

---

## 8. 비기능 요구사항

| 항목 | 목표 |
|------|------|
| 초기 로딩 (LCP) | 2.5초 이하 |
| 빌드 전략 | SSG + ISR (revalidate: 3600초) |
| 접근성 | WCAG 2.1 AA 수준 |
| SEO | 동적 메타태그, sitemap.xml |
