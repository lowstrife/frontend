# PRUNplanner Frontend

Welcome to the next major version of PRUNplanner, now open-sourced and community-driven! After years of developing PRUNplanner—the empire and base management tool for Prosperous Universe—on my own, I've decided to make the frontend rework public. This new version leverages the already public [PRUNplanner API](https://api.prunplanner.org/docs) to create an enhanced user experience.

## Stack

- [Vue3](https://vuejs.org/)
- [Vite](https://vite.dev/)
- Typescript
- [Axios](https://axios-http.com/) for backend calls
- [Zod](https://zod.dev/) for data validation
- [Vitest](https://vitest.dev/) as testing framework

# Development

Install dependencies with `pnpm install` and run the vite development:

```shell
pnpm run dev
```

## Testing and Coverage

PRUNplanners frontend currently lacks proper and full-scope testing of its non-visual features and data validation. One aim of this rewrite is to reach full test coverage and `zod` validation.

Backend calls can be mocked easily with [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter).

```shell
# Run tests
pnpm run test

# Or use vitest-ui
pnpm run test:ui
```

## .env

Following variables are to be defined in the .env file

- VITE_APP_VERSION
- VITE_API_BASE_URL
