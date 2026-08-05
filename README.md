# frontend-admin-jualan

A React + Vite admin dashboard project for managing users and authentication flows.

## Features

- React 19 with TypeScript
- Vite for fast development and build
- Tailwind CSS for styling
- Material UI (`@mui/material`) and `@mui/x-data-grid`
- Axios for HTTP requests
- React Query for server state management
- Zustand for client state management
- Zod for schema validation
- React Hook Form for form handling
- React Router DOM for routing

## Getting Started

### Prerequisites

- Node.js 20+ (recommended)
- npm or yarn

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open the URL shown in the terminal to view the app.

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Project Structure

- `src/` - application source code
- `src/App.tsx` - root app component
- `src/main.tsx` - app entry point
- `src/pages/` - page components (login, users, etc.)
- `src/layouts/` - layout components
- `src/services/` - API and query logic
- `src/store/` - Zustand stores
- `src/styles.css` - global styles

## Notes

- The project is configured as an ES module (`type: "module"`).
- Tailwind CSS is configured via `tailwind.config.js` and `postcss.config.js`.
