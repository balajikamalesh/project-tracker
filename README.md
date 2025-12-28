# Project Tracker

Project Tracker (Trackly) is a modern, full-stack web application for tracking projects and tasks, featuring authentication, analytics, and a beautiful UI. Built with Next.js, TypeScript, Appwrite, Hono, and Tailwind CSS.

## Features

- User authentication (sign up, sign in, sign out)
- Secure session management with cookies
- Project and task tracking (extendable)
- Analytics and charts (Recharts)
- Responsive, accessible UI (Radix UI, Tailwind CSS)
- Type-safe API with Hono and Zod
- Appwrite integration for backend services

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Backend/API:** Hono, Appwrite
- **UI:** Tailwind CSS, Radix UI, Lucide Icons
- **Forms & Validation:** React Hook Form, Zod
- **State/Data:** TanStack React Query
- **Charts:** Recharts

## Getting Started

### Prerequisites
- Node.js 18+
- Appwrite instance (cloud or self-hosted)

### Installation
1. Clone the repo:
	```bash
	git clone https://github.com/your-username/project-tracker.git
	cd project-tracker
	```
2. Install dependencies:
	```bash
	npm install
	```
3. Configure environment variables:
	- Copy `.env.example` to `.env.local` and fill in your Appwrite credentials.

### Running Locally
```bash
npm run dev
```
App will be available at [http://localhost:3000](http://localhost:3000).

## Folder Structure

- `src/app/` — Next.js app directory (routing, layouts, pages)
- `src/components/` — Reusable UI components
- `src/features/auth/` — Authentication logic (API, components, schema)
- `src/lib/` — Appwrite client, session, utilities

## Environment Variables

Set the following in your `.env.local`:

```
NEXT_PUBLIC_APPWRITE_ENDPOINT=your-appwrite-endpoint
NEXT_PUBLIC_APPWRITE_PROJECT=your-appwrite-project-id
NEXT_APPWRITE_KEY=your-appwrite-api-key
```

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License

MIT
