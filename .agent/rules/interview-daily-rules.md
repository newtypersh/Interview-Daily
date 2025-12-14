---
trigger: always_on
---

# Project Context
## 1. Tech Stack
### Frontend (`/Front`)
- **Framework**: React 19, Vite 7
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4, Emotion
- **State Management**: React Query (TanStack Query) v5
- **Routing**: React Router DOM v7
- **UI Library**: Material UI (MUI) v7
- **HTTP Client**: Axios
### Backend (`/Backend`)
- **Framework**: Express v5
- **Language**: JavaScript (Node.js) with ES Modules (`type: module`)
- **Database**: MySQL
- **ORM**: Prisma v6
- **API Documentation**: Swagger (swagger-autogen)
- **Authentication**: Passport (Google OAuth2), Express Session
- **File Upload**: Multer (S3)
---
## 2. Project Structure
### Frontend (`/Front/src`)
We follow a **Hybrid Architecture** that combines type-based and feature-based organizations.
#### Directory Layout
src/ 
├── apis/ # Shared API functions 
├── assets/ # Static assets 
├── components/ # Shared UI components 
├── data/ # Static data & Constants 
├── hooks/ # Shared custom hooks 
├── layout/ # Layout components (Header, Footer) 
├── pages/ # Page components (Feature-based) 
├── react-query/ # React Query Configuration (Global Mutations/Queries) 
├── styles/ # Global styles 
├── types/ # Domain & Shared TypeScript types 
├── utils/ # Utility functions 
└── App.tsx # Main Entry

#### Structural Rules
- **Shared vs Feature**:
    - **Shared**: `src/components`, `src/hooks` (Reusable across the app).
    - **Feature**: `src/pages/[Feature]/...` (Logic specific to a single page).
- **Layouts**: Global structure (Header, Sidebar) lives in `src/layout`.
- **Context**: Use local providers for feature-specific state (e.g., `InterviewProvider` inside a page).
---
## 3. Coding Guidelines
### Naming Conventions
#### General
- **Files**: `camelCase` (JS/TS utilities), `PascalCase` (React components).
- **Variables/Functions**: `camelCase`.
- **Constants**: `UPPER_SNAKE_CASE`.
- **Path Aliases**: Use absolute paths or configured aliases.
#### TypeScript Standards
| 종류 | 접미사 (Suffix) | 예시 | 설명 |
| :--- | :--- | :--- | :--- |
| **데이터 모델** | (없음) | [User](cci:2://file:///c:/Users/allth/Interview-Daily/Front/src/types/index.ts:0:0-4:1), [Interview](cci:2://file:///c:/Users/allth/Interview-Daily/Front/src/apis/interview/types.ts:15:0-25:1) | API 모델 및 도메인 핵심 모델 (전역 사용) |
| **API 래퍼** | [Response](cci:2://file:///c:/Users/allth/Interview-Daily/Front/src/apis/interview/types.ts:35:0-41:1) / `Request` | `LoginResponse` | API 성공/실패 여부를 감싸는 껍데기 객체 |
| **컴포넌트 Props** | [Props](cci:2://file:///c:/Users/allth/Interview-Daily/Front/src/pages/DailyInterview/Feedback/components/FeedbackItem.tsx:18:0-27:1) | `ButtonProps` | React 컴포넌트 Props 정의 |
| **Local State** | [State](cci:2://file:///c:/Users/allth/Interview-Daily/Front/src/apis/interview/types.ts:43:0-51:1) | [SessionState](cci:2://file:///c:/Users/allth/Interview-Daily/Front/src/apis/interview/types.ts:43:0-51:1) | 커스텀 훅이나 컴포넌트 내부의 로직 상태 |
| **Context Value** | `Value` | `AuthContextValue` | Context Provider가 제공하는 값 |
| **UI 객체** | [Item](cci:1://file:///c:/Users/allth/Interview-Daily/Front/src/pages/DailyInterview/Feedback/components/FeedbackItem.tsx:29:0-145:1) / `View` | `TodoItem` | 렌더링을 위해 가공된 단순 객체 |
### Frontend Rules
- **Components**: Functional components + Hooks only (No class components).
- **Styling**: Prioritize **Tailwind CSS**. Use Emotion only when dynamic styling is required.
- **Data Fetching**: Use **React Query** (`useQuery`, `useMutation`) for server state. Avoid `useEffect` for data fetching.
- **Types**: Define generic types in `src/types`, specific types co-located with components. Avoid `any`.
### Backend Rules
- **Architecture**: SOA (Service Oriented Architecture) with Layered Pattern.
- **Layers**:
    - **Controllers** (`/controllers`): Handle HTTP, Validate DTOs, Call Services. **No business logic.**
    - **Services** (`/services`): Core business logic. Orchestrate Controllers <-> Repositories.
    - **Repositories** (`/repositories`): Direct DB access via Prisma.
    - **DTOs** (`/dtos`): Typed objects for validation between layers.
- **Database**: Use Prisma Client. Run `prisma generate` on schema changes.
- **Documentation**: Keep Swagger updated for every endpoint.
- **Error Handling**: Use centralized error handling middleware.