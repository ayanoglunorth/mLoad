# mLoad frontend

This package contains the Next.js interface for mLoad. It talks to the Express backend from the repository root and lets users inspect supported public media URLs, choose an available format, and start a download.

## Development

From this directory, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The page auto-updates while you edit the app files.

## Backend

Run the backend from the repository root when testing the full flow:

```bash
npm run start:backend
```

Use the root `npm start` script if you want the backend and frontend to start together.

## Build

```bash
npm run build
```

## Notes

Keep platform access rules, CORS settings, and download behavior aligned with the backend before deploying this frontend outside local development.
