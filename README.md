# Team Workflow Board

A React + TypeScript task board with task management, drag-and-drop, filtering, sorting, URL-based views, and browser persistence.

## Live demo

**Deployed application:** https://team-work-flow-b7r1k1bi1-sanjeev1420s-projects.vercel.app/

## Run locally

```bash
npm install
npm run dev
```

## Run tests

```bash
npm run test        # Run tests once
npm run test:watch  # Run tests in watch mode
```

Current tests cover:
- Creating a task and verifying it appears on the board.
- Filtering tasks by priority and checking the resulting tasks and URL.

## Architecture
- [Architecture and technical notes](./docs/architecture.md)

## Performance work
- [Performance profiling and optimizations](./docs/performance.md)

## Walkthrough recording

**3–5 minute screen recording:** <video controls src="https://res.cloudinary.com/dqn1j6ibx/video/upload/v1793602163/EverQuint_dm7rak.mp4" title="_Add the recording link here._"></video>

## AI Assistance

AI assistance was used primarily in three areas:

- **UI Development:** Translating my own UI design ideas, styling preferences, and layout decisions into React components and Tailwind CSS code.
- **Testing:** Guidance on configuring Vitest and React Testing Library, understanding testing concepts, and implementing integration test examples.
- **Performance Optimization:** Analyzing React Profiler results, identifying potential unnecessary re-renders, and exploring optimization techniques.

AI suggestions were reviewed, adapted, and tested within the existing project. I focused on understanding the implementation, underlying concepts, and trade-offs so I can explain and maintain the code independently.
