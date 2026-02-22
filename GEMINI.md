# Pitch Studio | GEMINI context

Pitch Studio is a comprehensive web-based platform designed to bridge the gap between startup founders and investors. It provides a structured workflow for founders to submit detailed startup applications and for investors to review, manage, and shortlist these submissions.

## Project Overview

-   **Purpose:** Streamline startup application intake and investor shortlisting.
-   **Core Technologies:**
    -   **Frontend:** Next.js 16 (App Router), React 19, TypeScript.
    -   **Styling:** Tailwind CSS 4, Custom CSS Variables (Glassmorphism/Dark Theme).
    -   **Backend:** Supabase (PostgreSQL, Auth, Edge Functions).
    -   **Icons:** Lucide React.
    -   **Notifications:** React Hot Toast.
-   **Architecture:**
    -   **Public Routes:** Home page and multi-step startup submission form (`/forms`).
    -   **Admin Routes:** Protected dashboard for investors to view and manage applications (`/admin`).
    -   **Data Flow:** Form submissions are stored in Supabase, triggering edge functions for admin notifications.

## Key Features

-   **Founder Submission Form:** A 10-section questionnaire covering basic info, founder profile, concept, financials, traction, business model, fundraising, team, vision, and pitch readiness.
-   **Admin Dashboard:**
    -   List view of all submissions with pagination and status tags.
    -   Detailed view for each startup.
    -   Selection mechanism to shortlist startups.
    -   Analytics dashboard showing total applications and selection ratios.
-   **Security:** Admin routes are protected using Supabase Auth (shared credential model for MVP).

## Building and Running

### Prerequisites
-   Node.js (latest LTS recommended)
-   Supabase project (URL and Anon/Service Key)

### Commands
-   `npm run dev`: Starts the development server at `http://localhost:3000`.
-   `npm run build`: Builds the production application.
-   `npm run start`: Starts the production server.
-   `npm run lint`: Runs ESLint for code quality checks.

## Development Conventions

### Coding Style
-   **Components:** Functional components with TypeScript interfaces for props.
-   **Styling:** Prefer Tailwind CSS utility classes combined with the custom CSS variables defined in `app/globals.css`. Use the `.glass-card` and `.btn-primary` classes for consistent UI.
-   **Icons:** Always use `lucide-react` for iconography.
-   **State Management:** React hooks for local state; Supabase client for data fetching and persistence.

### Project Structure
-   `app/`: Contains all routes and layouts.
    -   `admin/`: Investor-facing dashboard and login.
    -   `forms/`: Founder-facing submission logic.
-   `components/`:
    -   `ui/`: Reusable primitive components (inputs, selects, etc.).
    -   `admin/` / `forms/`: Feature-specific components.
-   `lib/`: Core utilities including Supabase clients (`supabase.ts` for client-side, `supabase-server.ts` for server-side) and server actions (`actions.ts`).
-   `types/`: TypeScript definitions, particularly for the `startups` table schema.

### Database Schema
The primary data store is the `startups` table in Supabase. Refer to `spec_1_startup_pitch_studio_platform.md` for the full SQL schema and index definitions.

### Testing
-   Currently, the project focuses on manual validation. Automated tests (Jest/Playwright) are recommended for future iterations.
