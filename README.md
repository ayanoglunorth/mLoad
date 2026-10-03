# mLoad

mLoad is a self-hosted web app for checking media at supported public URLs and requesting one of the available output formats. It combines a Next.js interface with an Express API backed by `youtube-dl-exec`.

## Features

- Retrieve title, thumbnail, duration, uploader, and available media formats
- Present video resolution and audio-only options
- Stream the selected format as a download response
- Support configured public video sources, including YouTube, Instagram, X, TikTok, Facebook, Vimeo, and Dailymotion

## Stack

- Frontend: Next.js, React, and Tailwind CSS
- Backend: Express and `youtube-dl-exec`
- Development workflow: npm and `concurrently`

## Prerequisites

- Node.js 20 or later
- npm

## Getting started

```bash
git clone https://github.com/ayanoglunorth/mLoad.git
cd mLoad
npm run install:all
npm start
```

The root `start` script launches the backend and frontend development servers together. Use `npm run start:backend` or `npm run start:frontend` when working on one side.

## Project structure

```text
backend/
  routes/          Media information and download endpoints
  server.js        Express application entry point
frontend/
  src/             Next.js application source
package.json       Workspace scripts
```

## Use responsibly

Only retrieve media that you are allowed to access and download. You are responsible for complying with applicable law and the terms of the source platform. mLoad is an independent project and is not affiliated with the platforms it supports.

## Development notes

The backend accepts only configured source domains for media-information requests. Review the allowed-domain list, CORS settings, rate limits, and authentication requirements before exposing an instance to untrusted traffic.
