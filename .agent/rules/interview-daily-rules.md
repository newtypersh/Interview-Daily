---
trigger: always_on
---

Project Context
Tech Stack
Frontend (/Front)
Framework: React 19, Vite 7
Language: TypeScript 5.9
Styling: Tailwind CSS 4, Emotion
State Management: React Query (TanStack Query) v5
Routing: React Router DOM v7
UI Library: Material UI (MUI) v7
HTTP Client: Axios
Backend (/Backend)
Framework: Express v5
Language: JavaScript (Node.js) with ES Modules (type: module)
Database: MySQL
ORM: Prisma v6
API Documentation: Swagger (swagger-autogen)
Authentication: Passport (Google OAuth2), Express Session
File Upload: Multer (S3)
Coding Guidelines
General
Naming Conventions:
Files: camelCase for JS/TS utilities, PascalCase for React components.
Variables/Functions: camelCase.
Constants: UPPER_SNAKE_CASE.
Path Aliases: Use absolute paths or configured aliases where possible (check tsconfig.json paths).
Frontend Rules
Components: Use functional components with hooks. Avoid class components.
Styling: Prioritize Tailwind CSS utility classes. Use Emotion/Styled Components only when dynamic styling is strictly necessary.
Data Fetching: Use React Query hooks (useQuery, useMutation) for server state. Avoid useEffect for data fetching.
Types: Define interfaces/types in src/types or co-located with components if specific. Avoid any.
Directory Structure:
components/: Reusable UI components.
pages/: Route-level components.
hooks/: Custom hooks.
apis/: Axios instance and API request functions.
Backend Rules
Architecture: Service Oriented Architecture (SOA) with Layered Pattern.
Controllers (/controllers):
Handle HTTP requests and responses.
Validate input data (DTOs).
Call Services to execute business logic.
Do not contain business logic or direct database queries.
Services (/services):
Contain core business logic.
Orchestrate data flow between Controllers and Repositories.
Handle complex operations and calculations.
Can call other services if necessary (carefully to avoid circular dependencies).
Repositories (/repositories):
Handle direct database interactions using Prisma.
Abstract the data access layer from the business logic.
Provide clean methods for CRUD operations.
DTOs (/dtos): Use Data Transfer Objects for strict type validation between layers.
Database:
Use Prisma Client for all DB operations.
Update schema.prisma and run prisma generate when modifying the DB schema.
API Documentation:
Update Swagger documentation when adding/modifying endpoints.
Error Handling: Use a centralized error handling middleware. Ensure errors from Services are propagated correctly to Controllers.
Workflow
Frontend: Run npm run dev in /Front.
Backend: Run npm run dev in /Backend.