# Contributing

Thanks for taking a look at this project.

This is a personal website, so contributions are most useful when they improve code quality, accessibility, performance, browser compatibility, documentation, or reusable UI behavior. Please avoid submitting changes that replace personal biography, photos, travel content, music taste, domain names, or identity-specific copy unless an issue explicitly asks for it.

## Development

Use Node.js 22 and pnpm.

```bash
pnpm install
pnpm dev
```

Before opening a pull request, run:

```bash
pnpm typecheck
pnpm build
```

## Pull Requests

- Keep changes focused and easy to review.
- Explain what changed and why.
- Include screenshots or screen recordings for visual changes.
- Do not commit `.env`, local build output, raw photos, or private deployment files.
- Respect the asset licensing notes in [NOTICE.md](./NOTICE.md).

## Content Changes

The local content manager at `/admin/content` is intended for development only. It writes JSON content under `app/data/content` and is disabled in production.
