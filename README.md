# RJustice Celero QA Assessment

Playwright + TypeScript end-to-end tests against the [OrangeHRM demo site](https://opensource-demo.orangehrmlive.com), covering login and the PIM Add Employee workflow. See [docs/Test-cases.md](docs/Test-cases.md) for the full test case list.

## Getting started

```bash
npm install
npx playwright install
cp .env.example .env
```

Open `.env` and fill in the demo site credentials:

```
BASE_URL=https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
ADMIN_USERNAME=Admin
ADMIN_PASSWORD=admin123
```

## Running the tests

```bash
npm test
```

Other useful commands:

```bash
npm run test:headed   # run with a visible browser
npm run test:ui       # open Playwright's interactive UI mode
npm run report        # open the HTML report from the last run
```

Tests log in once (`tests/auth.setup.ts`) and reuse that session, so individual specs don't each re-authenticate.
