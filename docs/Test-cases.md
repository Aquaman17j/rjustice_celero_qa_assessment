**Workflow under test:** an HR administrator creates a new employee record via
PIM › Add Employee, and that record becomes retrievable from the Employee List.

## Summary

| ID | Title | Priority | Type | Automated |
| --- | --- | --- | --- | --- |
| TC-01 | Create an employee with required fields only | Critical | Positive | Yes |
| TC-02 | A new employee is retrievable from the Employee List | Critical | Positive | Yes |
| TC-03 | Create an employee with all fields populated | High | Positive | No |
| TC-04 | Save is rejected when required fields are empty | High | Negative | Yes |
| TC-05 | Duplicate Employee ID is rejected | High | Negative / Data integrity | Yes |
| TC-06 | Employee ID boundary and character handling | Medium | Negative / Boundary | No |
| TC-07 | Invalid login credentials are rejected | Critical | Negative / Security | Yes |

---

## TC-01 — Create an employee with required fields only

**Priority:** Critical  |  **Type:** Positive  |  **Automated:** Yes

This is the core path. If it breaks, the module is unusable.

**Preconditions:** Logged in as an administrator.

**Test data:** First Name `Test`, Last Name `QA<8 hex characters>` — manual run
used `QA5F235B90`. Accept the pre-filled Employee ID.

**Steps**

1. Navigate to PIM › Add Employee.
2. Enter the First Name and Last Name above.
3. Leave Middle Name empty; accept the pre-filled Employee ID.
4. Save.

**Expected**

- "Successfully Saved" appears.
- The browser lands on the new employee's Personal Details page, and the URL
  contains `empNumber/<numeric value>`.
- The record is retrievable from the Employee List.

---

## TC-02 — A new employee is retrievable from the Employee List

**Priority:** Critical  |  **Type:** Positive  |  **Automated:** Yes

A creation that cannot be found afterwards is indistinguishable from a failure
for the user.

**Preconditions:** Logged in as an administrator. An employee created in this
session, with its name and Employee ID recorded.

**Test data:** the employee created in TC-01.

**Steps**

1. Create an employee (TC-01), or create a new one.
2. Navigate to PIM › Employee List.
3. Search by Employee ID.
4. Reset, then search by Employee Name using the autocomplete.

**Expected**

- Both searches return exactly one row containing the created employee.
- Name, ID, and Job Title (if entered) match what was entered.

---

## TC-03 — Create an employee with all fields populated

**Priority:** High  |  **Type:** Positive  |  **Automated:** No

**Preconditions:** Logged in as an administrator. A local image file (JPG or PNG,
under 1 MB) available for upload. An unused username available for the
login-details section.

**Test data:** First Name `Test`, Middle Name `A`, Last Name
`QA<8 hex characters>` — manual run used `QA5F235B81`. Employee ID `102938475`,
photo `profile.jpg`, username `QA5F235B81`, password `Passw0rd!2026`.

**Steps**

1. Navigate to PIM › Add Employee.
2. Enter the First, Middle, and Last Name, and the Employee ID above.
3. Upload the profile photo.
4. Enable **Create Login Details**; set the username, password, and status
   Enabled.
5. Save.

**Expected**

- The record saves, and all values persist exactly as entered when the record is
  reopened.
- The created user can authenticate with the new credentials.

---

## TC-04 — Save is rejected when required fields are empty

**Priority:** High  |  **Type:** Negative  |  **Automated:** Yes

**Preconditions:** Logged in as an administrator; on the Add Employee form.

**Test data:** None — the empty state is the point of the case.

**Steps**

1. Navigate to PIM › Add Employee.
2. Leave First Name and Last Name empty.
3. Save.

**Expected**

- "Required" appears beneath both the First Name and Last Name fields.
- No record is created, and the form does not navigate away.

---

## TC-05 — Duplicate Employee ID is rejected

**Priority:** High  |  **Type:** Negative / Data integrity  |  **Automated:** Yes

Employee ID is a business key. Duplicates corrupt every downstream join that
relies on it.

**Preconditions:** Logged in as an administrator. No existing employee holds the
Employee ID assigned in step 1.

**Test data:** the auto-generated Employee ID from step 1, reused in step 3. Two
different last names, both `QA`-prefixed.

**Steps**

1. Create an employee, accepting the auto-generated Employee ID. Copy the ID,
   then save.
2. Navigate to Add Employee again.
3. Enter a different First and Last Name, and paste in the Employee ID copied in
   step 1.
4. Save.

**Expected**

- An "Employee ID already exists" error is shown.
- No second record is created, and the form does not navigate away.

---

## TC-06 — Employee ID boundary and character handling

**Priority:** Medium  |  **Type:** Negative / Boundary  |  **Automated:** No

**Preconditions:** Logged in as an administrator; on the Add Employee form. The
field's `maxlength` attribute has been inspected in the DOM — it reads `-1`.

**Test data:** a 10-character numeric ID `1234567890`; an 11-character numeric ID
`12345678901`; a 10-character alphanumeric ID `ABC-123456`; a symbol ID `#1`; and
` 1234 ` with leading and trailing spaces.

**Steps** — leave First and Last Name empty, since those fields are covered by
TC-04. Attempt to save in turn with:

1. The 10-character numeric ID.
2. The 11-character numeric ID.
3. The alphanumeric and symbol IDs.
4. The ID with leading and trailing spaces.

**Expected**

- The 11-character ID is rejected with "Should not exceed 10 characters", and no
  record is created.
- The 10-character numeric, alphanumeric, symbol, and whitespace-padded IDs are
  all accepted.
- Confirm whether the whitespace-padded ID retains its spaces once stored. If it
  does, ` 1234 ` and `1234` are distinct IDs that are identical to any human or
  downstream system, which undermines the uniqueness rule in TC-05.

> **Observation:** the field's `maxlength` is `-1`, so the browser imposes no
> limit, but the application rejects 11 characters on submit. The limit exists
> but is enforced only after a round trip, and is not stated anywhere in the UI.
> Recorded in FINDINGS.

---

## TC-07 — Invalid login credentials are rejected

**Priority:** Critical  |  **Type:** Negative / Security  |  **Automated:** Yes

Valid login is exercised as setup for every other case; this covers the other
half.

**Preconditions:** Not logged in; session cookies cleared.

**Test data:** Username `not-a-real-user`, password `not-a-real-password`.

**Steps**

1. Navigate to the login page.
2. Enter the credentials above.
3. Submit.

**Expected**

- An "Invalid credentials" message is shown.
- The user remains on the login page and no session is established.
- The message does not reveal whether the username exists.