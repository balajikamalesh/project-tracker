# Project Tracker

A comprehensive, AI-powered project management application built with Next.js that enables teams to organize workspaces, manage projects, track tasks, and gain insights through analytics. Features intelligent task automation, real-time collaboration, and multi-workspace support with role-based access control.
Link: https://project-tracker-six-gules.vercel.app/

## 📋 Summary

Project Tracker is a modern project management solution designed for teams of all sizes. It provides a centralized platform for organizing work across multiple workspaces, managing projects, and tracking tasks through their lifecycle. The application leverages AI capabilities to enhance productivity through automated task descriptions and intelligent task splitting, while offering robust analytics to monitor project progress and team performance.

## ✨ Capabilities

### 🔐 Authentication & User Management
- Secure user registration and authentication
- Session management with Appwrite
- User profile management
- Password-based authentication

### 🏢 Workspace Management
- Create and manage multiple workspaces
- Workspace-specific settings and configuration
- Invite code system for team onboarding
- Custom workspace branding with image uploads

### 📊 Project Organization
- Create and organize multiple projects within workspaces
- Project-specific task tracking
- Project analytics and insights
- Custom project images and metadata

### ✅ Advanced Task Management
- Comprehensive task lifecycle tracking with 7 status states:
  - Backlog
  - Todo
  - In Progress
  - In Review
  - In Testing
  - Done
  - In Production
- Drag-and-drop Kanban board interface
- Task table view with sorting and filtering
- Task assignment to team members
- Due date tracking and overdue alerts
- Task descriptions with markdown support
- Parent-child task relationships (subtasks)
- Task positioning and prioritization

### 🤖 AI-Powered Features
- **Smart Description Completion**: AI-generated task descriptions based on task name and project context
- **Intelligent Task Splitting**: Automatically break down complex tasks into manageable subtasks
- **AI Insights**: Get intelligent insights about project progress and task patterns

### 📈 Analytics & Reporting
- Real-time task analytics dashboard
- Task count metrics with trend analysis
- Assigned tasks tracking
- Completed tasks monitoring
- Overdue task alerts
- Project-level and workspace-level analytics
- Historical data comparison

### 👥 Team Collaboration
- Member management within workspaces
- Role-based access control
- User assignment to tasks
- Team member profiles with avatars

### 🎨 User Interface
- Responsive design for desktop and mobile
- Dark/light theme support
- Modern UI components with Radix UI and shadcn/ui
- Smooth animations and transitions
- Loading states and error boundaries
- Top-loading progress bars

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14.2.14 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3.4.1
- **Component Library**: 
  - Radix UI primitives
  - shadcn/ui components
- **State Management**: 
  - TanStack React Query 5.90.12
  - React Hook Form 7.69.0
- **Data Visualization**: Recharts 2.15.4
- **Drag & Drop**: @hello-pangea/dnd 18.0.1
- **Icons**: Lucide React, React Icons
- **Date Handling**: date-fns 4.1.0
- **Animations**: tailwindcss-animate
- **Toast Notifications**: Sonner

### Backend
- **API Framework**: Hono 4.6.3
- **Validation**: Zod 4.2.1 with Hono Zod Validator
- **Backend Service**: Appwrite (node-appwrite 14.0.0)
  - Authentication
  - Database
  - Storage
  - User Management

### AI Integration
- **AI SDK**: Vercel AI SDK (@ai-sdk/react, @ai-sdk/google)
- **LLM Provider**: Google AI

### Development Tools
- **Linting**: ESLint with Next.js config
- **Package Manager**: npm/yarn/pnpm
- **URL State Management**: nuqs 1.19.1
- **Utility Libraries**: 
  - clsx for conditional classes
  - class-variance-authority for component variants
  - tailwind-merge for className merging

## 🏗 High-Level Design

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Browser)                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Next.js App Router (React Components)          │ │
│  │  • Pages (Dashboard, Auth, Workspace, Standalone)      │ │
│  │  • Components (UI, Business Logic)                     │ │
│  │  • Client-side State (React Query, Forms)              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                  API Layer (Next.js API Routes)              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Hono API Router                           │ │
│  │  • /api/[[...route]] - Main API endpoint              │ │
│  │  • /api/ai/* - AI-powered endpoints                   │ │
│  │  • Request validation (Zod schemas)                   │ │
│  │  • Authentication middleware                          │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   Feature Modules Layer                      │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │   Auth   │Workspaces│ Projects │  Tasks   │ Members  │  │
│  │          │          │          │          │          │  │
│  │ • Server │ • Server │ • Server │ • Server │ • Server │  │
│  │ • API    │ • API    │ • API    │ • API    │ • API    │  │
│  │ • Schema │ • Schema │ • Schema │ • Schema │ • Schema │  │
│  │ • Hooks  │ • Hooks  │ • Hooks  │ • Hooks  │ • Hooks  │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   Backend Services Layer                     │
│  ┌────────────────────────┬──────────────────────────────┐ │
│  │   Appwrite BaaS        │   Google AI (Gemini)         │ │
│  │  • Authentication      │  • Task description gen      │ │
│  │  • Database            │  • Task splitting            │ │
│  │  • File Storage        │  • Insights generation       │ │
│  │  • User Management     │                              │ │
│  └────────────────────────┴──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Route Structure

#### Authentication Routes (`/app/(auth)`)
- Dedicated layout for authentication pages
- Sign-in and sign-up flows
- Session management

#### Dashboard Routes (`/app/(dashboard)`)
- Main application interface
- Workspace and project views
- Task management interfaces
- Analytics dashboards

#### Standalone Routes (`/app/(standalone)`)
- Independent pages outside main dashboard
- Workspace creation
- Special workflows

### Data Flow

1. **Client Interaction**: User interacts with React components
2. **State Management**: TanStack Query manages server state and caching
3. **API Calls**: Custom hooks call Next.js API routes via RPC client
4. **Validation**: Zod schemas validate requests
5. **Business Logic**: Feature modules process requests
6. **Data Persistence**: Appwrite handles database operations
7. **AI Processing**: Google AI generates intelligent content
8. **Response**: Data flows back through the layers

### Security Model

- **Authentication**: Cookie-based sessions via Appwrite
- **Authorization**: Role-based access control (workspace members)
- **Validation**: Server-side validation with Zod schemas
- **API Protection**: Middleware checks authentication status
- **Admin Operations**: Separate admin client for privileged operations

## 🔧 Low-Level Design

### Feature Module Structure

Each feature follows a consistent modular pattern:

```
features/
  <feature-name>/
    ├── api/              # React Query hooks for data fetching
    │   ├── use-get-*.ts
    │   ├── use-create-*.ts
    │   ├── use-update-*.ts
    │   └── use-delete-*.ts
    ├── components/       # Feature-specific UI components
    ├── hooks/            # Custom React hooks
    ├── server/           # Server-side logic and routes
    │   └── route.ts      # Hono API route handlers
    ├── schema.ts         # Zod validation schemas
    ├── types.ts          # TypeScript interfaces
    ├── actions.ts        # Server actions
    └── utils.ts          # Utility functions
```

### Core Feature Modules

#### 1. Authentication (`features/auth`)
- **Schema**: Login and registration validation
- **API Hooks**: 
  - `use-current.ts` - Get current user session
  - `use-login.ts` - Login mutation
  - `use-logout.ts` - Logout mutation
  - `use-register.ts` - Registration mutation
- **Components**: Sign-in card, Sign-up card, User button
- **Server**: Session management with Appwrite

#### 2. Workspaces (`features/workspaces`)
- **Schema**: Workspace creation/update validation
- **Types**: Workspace model with invite code
- **API Hooks**: CRUD operations for workspaces
- **Components**: 
  - Workspace switcher
  - Workspace settings
  - Invite management
- **Actions**: Server-side workspace operations

#### 3. Projects (`features/projects`)
- **Schema**: Project validation
- **Types**: Project model with workspace relation
- **API Hooks**: 
  - Project CRUD operations
  - `use-get-project-analytics.ts` - Analytics data
- **Components**: Project cards, forms, settings
- **Server**: Project management logic

#### 4. Tasks (`features/tasks`)
- **Schema**: Task creation/update validation with status enum
- **Types**: 
  ```typescript
  enum TaskStatus {
    BACKLOG, TODO, IN_PROGRESS, IN_REVIEW,
    IN_TESTING, DONE, IN_PROD
  }
  
  type Task {
    name, status, workspaceId, description,
    assigneeId, projectId, position, dueDate,
    parentTaskId
  }
  ```
- **API Hooks**: Comprehensive task management
- **Components**: 
  - Kanban board (`data-kanban.tsx`)
  - Table view (`data-table.tsx`)
  - Task forms (create/edit)
  - AI-powered modals (insights, split-task)
  - Task overview and breadcrumbs
- **Server**: Task business logic

#### 5. Members (`features/members`)
- **Types**: Member model with workspace roles
- **API Hooks**: Member management operations
- **Server**: Member invitation and access control

#### 6. AI (`features/ai`)
- **Server Routes**:
  - `/api/ai/complete-description` - Generate task descriptions
  - `/api/ai/split-task` - Break tasks into subtasks
  - `/api/ai/insights` - Generate project insights
- **Components**: AI modals and forms
- **Integration**: Google AI SDK with streaming responses

### Database Schema (Appwrite)

#### Collections:
1. **Workspaces**
   - Fields: name, imageUrl, inviteCode, userId
   - Relations: One-to-Many with Projects, Members, Tasks

2. **Projects**
   - Fields: name, imageUrl, workspaceId
   - Relations: Belongs to Workspace, Has Many Tasks

3. **Tasks**
   - Fields: name, status, description, assigneeId, projectId, position, dueDate, parentTaskId, workspaceId
   - Relations: Belongs to Project, Workspace, Assignee (User)

4. **Members**
   - Fields: userId, workspaceId, role
   - Relations: Belongs to Workspace and User

### UI Component Architecture

#### Base Components (`components/ui/`)
- Built with Radix UI primitives
- Styled with Tailwind CSS
- Variants managed with class-variance-authority
- Components: button, dialog, dropdown-menu, form, input, select, table, tabs, etc.

#### Business Components (`components/`)
- **Navigation**: Sidebar, Navbar, Mobile sidebar
- **Analytics**: Analytics cards and dashboards
- **Projects**: Project selector and displays
- **Workspace**: Workspace switcher
- **Common**: Date picker, Dotted separator, Responsive modal

### State Management Strategy

#### Server State (TanStack Query)
- Automatic caching and synchronization
- Optimistic updates for mutations
- Background refetching
- Query invalidation patterns

#### Form State (React Hook Form)
- Schema validation with Zod resolvers
- Controlled form inputs
- Error handling and display

#### URL State (nuqs)
- Persistent filter and view states
- Shareable URLs
- Browser history integration

### API Design

#### Hono Router Structure
```typescript
// Main API route: /api/[[...route]]/route.ts
app.route('/auth', authRoutes)
   .route('/workspaces', workspacesRoutes)
   .route('/projects', projectsRoutes)
   .route('/tasks', tasksRoutes)
   .route('/members', membersRoutes)
```

#### Request Flow
1. Client calls via RPC client (`lib/rpc.ts`)
2. Hono router matches endpoint
3. Middleware validates authentication
4. Zod validator validates request body
5. Feature server logic processes request
6. Response returned with typed data

#### Response Types
- Uses TypeScript inference from Hono
- Type-safe client with RPC
- Error handling with HTTP status codes

### Performance Optimizations

- **Code Splitting**: Route-based with Next.js App Router
- **Image Optimization**: Next.js Image component
- **Query Caching**: TanStack Query deduplication
- **Lazy Loading**: Dynamic imports for heavy components
- **Streaming**: AI responses streamed with Vercel AI SDK
- **Skeleton Loading**: Loading states for better UX

### Error Handling

- **Global Error Boundary**: `error.tsx` files per route group
- **API Errors**: Standardized error responses
- **Form Validation**: Client and server-side validation
- **Toast Notifications**: User-friendly error messages

### Development Workflow

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Environment Variables

Required environment variables:
```
NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_PROJECT=
NEXT_APPWRITE_KEY=
NEXT_PUBLIC_APPWRITE_DATABASE_ID=
NEXT_PUBLIC_APPWRITE_WORKSPACES_ID=
NEXT_PUBLIC_APPWRITE_PROJECTS_ID=
NEXT_PUBLIC_APPWRITE_TASKS_ID=
NEXT_PUBLIC_APPWRITE_MEMBERS_ID=
NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID=
```

---

Built with ❤️ using Next.js, Appwrite, and Google AI
