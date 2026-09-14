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
ADMIN_USERNAME=<copy from the BASEURL landing page>
ADMIN_PASSWORD=<copy from the BASEURL landing page>
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

## Test case → automated test mapping

Each manual case maps to exactly one automated test, and each spec asserts only what its own case is responsible for:

- **TC-01 vs. TC-02.** TC-01's automated version used to end with an Employee List search, which meant it was quietly re-doing part of TC-02's job and blurring where each case's coverage actually lived. Searching for the Employee is TC-02's job alone, in its own file (`tests/employee-list.spec.ts`), which searches by both Employee Id and by name.
- Tests import a shared `AddEmployeePage` / `EmployeeListPage` / `LoginPage` (`src/pages/`) via fixtures (`src/fixtures/test.fixtures.ts`), so the mapping above holds even as the underlying locators change. This was something I tried to copy from my time in ABS utilizng pytest parameterization, allows me to change locators in page files with out going into the tests. This also allowed me to use the pages as parameters.

## Test data strategy

- `newEmployee()` (`src/utils/data.ts`) generates a fresh employee per test: a fixed first name (`Test`) and a last name suffixed with 8 random hex characters (`QA<hex>`), so runs never collide with each other or other users on the public demo websiste.
- Employee ID is left as whatever the app pre-fills rather than a fixed literal.
- TC-04 and TC-06 deliberately use no test data (or invalid data).
- **Cleanup:** the `createdEmployeeIds` fixture collects every Employee Id created during a test and deletes those records via the Employee List after the test finishes, best-effort, failed tests  are swallowed allowing cleanup problems to never fail an already passed test. Any leftovers from a failed cleanup are identifiable by the `QA<hex>`.

## Assumptions

- Testing was done against a public, shared OrangeHRM demo instance with a single admin account. Tests are written to create their own data and clean up after themselves rather than depending on any existing records.
- Only the `Admin` role was available. No second, non-admin account was supplied, so role-based access control is untested.
- Only Chromium is exercised. Felt there was no need to extend the test to different browsers as this is more about functional testing build and test strategy decisons over.

## Known limitations

- **TC-03** (all fields populated, including a photo upload and a new login account) and **TC-06** (Employee Id boundary/character handling) are documented in [docs/Test-cases.md](docs/Test-cases.md) but not automated. 
- **TC-03** needs a real file upload plus creating and logging in as a second user, with the three hour limit this would have took more time then what it was actually worth. Though overall this is a HIGHLY valubale test as it goes through the full process.
- **TC-06** is exploratory boundary-probing that's more useful to be done and read by a human than baked into a fixed assertion. Also with the time contstraints not as valauble to complete.
- No coverage of non-admin/role-based access.
- The suite runs serially (`workers: 1`, `fullyParallel: false`). *See the first Tradeoff

## Tradeoffs

- **Serial execution.** `workers: 1` and `fullyParallel: false` in `playwright.config.ts` trade speed for reliability: running multiple workers in parallel against the shared demo instance produced flaky failures where two tests landed on the same auto-generated Employee Id at nearly the same moment.
- **Broad, resilient locators over one-getter-per-field.** OrangeHRM's demo markup doesn't reliably associate `<label>` elements with their inputs, so error assertions locate elements by class (`.oxd-input-field-error-message`) rather than by an accessible field name. The original postional locators in my mind felt a bit more flaky than this as if there was a change to the structure they could fail potentially. This just also allowed me to not have to jungle the multiple locators if I were to extend to more negative cases on that page. 

    Example: If I were to automate TC-03 in a negative way I can do the following:

    ```
    await expect(this.errorMessages).toHaveCount(5);
    await expect(this.errorMessages.nth(0)).toHaveText(MESSAGES.REQUIRED);
    await expect(this.errorMessages.nth(1)).toHaveText(MESSAGES.REQUIRED);
    await expect(this.errorMessages.nth(2)).toHaveText(MESSAGES.REQUIRED);
    await expect(this.errorMessages.nth(3)).toHaveText(MESSAGES.REQUIRED);
    await expect(this.errorMessages.nth(4)).toHaveText(MESSAGES.PASSWORD_NO_MATCH);
    ```
    One locator accounting for every error message while adding a extra Message Constant.

## Negative case assertions

Both automated negative cases currently pass. Tightend to check the outcome the manual case cares about:

- **TC-04** now asserts that *both* First Name and Last Name show a "Required" error (`errorMessages` count of exactly 2), instead of only checking the first error message found on the page. The old assertion would still have passed if only one of the two fields had validated.
- **TC-05** now re-opens the Employee List after the duplicate save is rejected and searches by the reused Employee Id, asserting exactly one row exists and it belongs to the *original* employee — confirming no second record was actually created, rather than only checking that an "already exists" toast appeared.
- **TC-07** still asserts on the error message and that the app stays on the login page. So it was left as-is.

## Viewing failures (screenshots & traces)

Adde `screenshot: 'only-on-failure'` into `playwright.config.ts` based on my runs I nticed it was already doing so but being explict about it in the config does feel a bit more reliable, After a run you can open the HTML report with the command below:

```bash
npx playwright show-report
```

or

```bash
npm run report
```