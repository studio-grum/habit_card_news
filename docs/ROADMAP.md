# ROADMAP: 개인 개발 블로그 (Notion CMS 기반)

> 참고 문서: [PRD.md](./PRD.md)  
> 총 예상 소요: **9~14일**  
> 최종 목표: Notion을 CMS로 활용한 개인 기술 블로그 Vercel 배포

---

## 진행 현황

| Phase   | 설명               | 상태    | 예상 기간 |
| ------- | ------------------ | ------- | --------- |
| Phase 1 | 프로젝트 초기 설정 | 🔲 대기 | 1~2일     |
| Phase 2 | 공통 모듈 개발     | 🔲 대기 | 2~3일     |
| Phase 3 | 핵심 기능 개발     | 🔲 대기 | 3~4일     |
| Phase 4 | 추가 기능 개발     | 🔲 대기 | 2~3일     |
| Phase 5 | 최적화 및 배포     | 🔲 대기 | 1~2일     |

> 상태 범례: 🔲 대기 / 🔄 진행 중 / ✅ 완료

---

## Phase 1: 프로젝트 초기 설정 (1~2일)

> **이유**: 견고한 기반 없이는 기능 개발이 어려움

### 태스크

| 번호 | 태스크                                                                                        | 상태 |
| ---- | --------------------------------------------------------------------------------------------- | ---- |
| 1-1  | Next.js 15 App Router 프로젝트 구조 점검 및 불필요 보일러플레이트 정리                        | 🔲   |
| 1-2  | `@notionhq/client` 패키지 설치                                                                | 🔲   |
| 1-3  | [사용자 직접] Notion Integration 생성 및 API 키 발급                                          | 🔲   |
| 1-4  | `.env.local` 생성 + `src/lib/env.ts` Zod 스키마에 `NOTION_API_KEY`, `NOTION_DATABASE_ID` 추가 | 🔲   |
| 1-5  | [사용자 직접] Notion 데이터베이스 생성 (Title, Category, Tags, Published, Status)             | 🔲   |
| 1-6  | 기본 레이아웃 구조 정비 (`app/layout.tsx` 메타데이터, `app/page.tsx` 컨테이너)                | 🔲   |
| 1-7  | shadcn/ui 컴포넌트 설치 확인 및 추가 (Button, Card, Badge, Input, Skeleton, Separator)        | 🔲   |

### 완료 기준

- [ ] `npm run dev` 실행 시 오류 없이 홈 화면 표시
- [ ] Notion API 키가 `.env.local`에 설정되어 있고 Zod 검증 통과
- [ ] Notion 데이터베이스에 테스트 글 1개 이상 등록됨

---

## Phase 2: 공통 모듈 개발 (2~3일)

> **이유**: 모든 기능에서 재사용되는 코드를 먼저 만들어야 중복 방지

### 태스크

| 번호 | 태스크                                                                                        | 상태 |
| ---- | --------------------------------------------------------------------------------------------- | ---- |
| 2-1  | `src/lib/types/notion.ts` — 공통 타입 정의 (`Post`, `Block`, `Category`, `Tag`, `RichText`)   | 🔲   |
| 2-2  | `src/lib/notion.ts` — `@notionhq/client` 초기화 + `fetchPages()` + `fetchPageContent()` 구현  | 🔲   |
| 2-3  | `components/layout/Header.tsx` + `Footer.tsx` — 블로그용 헤더(로고·홈 링크)/푸터(저작권) 교체 | 🔲   |
| 2-4  | `components/blog/PostCard.tsx` — 제목, 카테고리, 태그, 발행일 표시 카드 컴포넌트              | 🔲   |

### 완료 기준

- [ ] `fetchPages()` 호출 시 Notion DB에서 발행된 글 목록 반환 확인
- [ ] `fetchPageContent()` 호출 시 페이지 블록 배열 반환 확인
- [ ] Header, Footer, PostCard 컴포넌트가 오류 없이 렌더링되고 `npm run check-all` 통과

---

## Phase 3: 핵심 기능 개발 (3~4일)

> **이유**: 블로그의 가장 기본이 되는 기능

### 태스크

| 번호 | 태스크                                                                                                 | 상태 |
| ---- | ------------------------------------------------------------------------------------------------------ | ---- |
| 3-1  | `app/page.tsx` — 홈 글 목록 페이지 (SSG + ISR, `revalidate = 3600`)                                    | 🔲   |
| 3-2  | `components/blog/NotionRenderer.tsx` — Notion 블록 렌더러 (paragraph, H1~H3, code, quote, 목록, image) | 🔲   |
| 3-3  | `app/posts/[slug]/page.tsx` — 글 상세 페이지 + `generateStaticParams` + 이전/다음 글 네비게이션        | 🔲   |

### 완료 기준

- [ ] 홈에서 Notion DB의 발행된 글 목록이 그리드로 표시
- [ ] 글 카드 클릭 시 상세 페이지로 이동하고 본문 렌더링 확인
- [ ] 코드 블록, 이미지, 목록 등 주요 블록 타입이 올바르게 표시
- [ ] `npm run build` 성공 (`generateStaticParams` 동작 확인)

---

## Phase 4: 추가 기능 개발 (2~3일)

> **이유**: 핵심 기능이 완성된 후 부가 기능 추가

### 태스크

| 번호 | 태스크                                                                                           | 상태 |
| ---- | ------------------------------------------------------------------------------------------------ | ---- |
| 4-1  | `app/category/[category]/page.tsx` — 카테고리별 글 목록 페이지                                   | 🔲   |
| 4-2  | `CategoryFilter.tsx` + `SearchBar.tsx` — 카테고리 필터 탭 + 제목 기준 실시간 검색 (`use client`) | 🔲   |
| 4-3  | `generateMetadata` (글·카테고리 페이지) + `app/sitemap.ts` + `app/robots.ts`                     | 🔲   |
| 4-4  | 댓글 기능: Notion 댓글 DB 연동 + `/api/comments` Route Handler + CommentSection 컴포넌트         | 🔲   |

### 완료 기준

- [ ] 카테고리 클릭 시 해당 카테고리 글만 필터링되어 표시
- [ ] 검색어 입력 시 제목 기준으로 실시간 필터링 동작
- [ ] 글 상세 페이지 소셜 공유 시 OG 태그 정상 노출 확인
- [ ] `/sitemap.xml` 접근 시 전체 글 URL 포함한 sitemap 반환
- [ ] 댓글 작성 시 Notion DB에 저장되고 페이지에 즉시 표시

---

## Phase 5: 최적화 및 배포 (1~2일)

> **이유**: 기능이 완성된 후 품질 향상

### 태스크

| 번호 | 태스크                                                                                          | 상태 |
| ---- | ----------------------------------------------------------------------------------------------- | ---- |
| 5-1  | `next/image` 적용 — `NotionRenderer` image 블록 최적화 + `next.config.ts` remotePatterns 추가   | 🔲   |
| 5-2  | 반응형 디자인 최종 점검 (375px/768px/1280px) + 접근성(alt, aria, 키보드) + Lighthouse 80점 이상 | 🔲   |
| 5-3  | [사용자 직접] Vercel 프로젝트 생성 + 환경변수 등록 + 프로덕션 배포 + 커스텀 도메인 연결 (선택)  | 🔲   |

### 완료 기준

- [ ] Lighthouse Performance 점수 80점 이상, LCP 2.5초 이하
- [ ] 모바일/태블릿/데스크탑 레이아웃 모두 정상 렌더링
- [ ] Vercel 프로덕션 URL에서 전체 기능 정상 동작
- [ ] Notion에서 글 수정 후 1시간 내 블로그에 반영 (ISR 확인)

---

## 마일스톤 요약

```
Day 1~2   ████░░░░░░░░░░  Phase 1: 초기 설정
Day 3~5   ████████░░░░░░  Phase 2: 공통 모듈
Day 6~9   ████████████░░  Phase 3: 핵심 기능
Day 10~12 ████████████░░  Phase 4: 추가 기능
Day 13~14 ████████████▓▓  Phase 5: 최적화 & 배포
```
