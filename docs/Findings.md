# Findings

---

## 1. Form labels are not associated with their inputs

**Type:** Accessibility defect · **Severity:** Medium · **Found:** exploratory testing

Label elements on the Login page carry no `for` attribute. Same is true for the Employee ID input The visual association is
positional only.


---

## 2. The two Employee List search fields behave inconsistently

**Type:** Usability · **Severity:** Medium · **Found:** exploratory testing

Employee Name is an autocomplete that allows *selecting a suggestion*. Can stil type a full name to get results as well

Employee Id, directly beside it, is a plain text field where typing and
searching works as expected.

---

## 3. Employee Id has no visible constraints, which weakens its uniqueness rule

**Type:** Risk / possible defect · **Severity:** Medium–High · **Found:** exploratory testing

The application enforces that Employee Id is unique. But the field accepts free-form text with no visible maximum
length, character restriction, or format hint. Maximum limit is only stated when more than 10 characters are placed into the input box, inspecting the input box properties it states the it's maxLength = -1

---

## 4. Save success is reported before the record is verifiable

**Type:** Risk · **Severity:** Low–Medium · **Found:** building the automated flow

The success toast and the redirect to the employee's Personal Details page occur
promptly, but a subsequent Employee List search for the same record can need a
short retry window before the row appears.

---

## 5. Coverage gap: role-based access is untested

**Type:** Risk / coverage gap · **Severity:** Noted, not measured

All testing here used an administrator account. It needs a
second account that the assignment did not supply.

Flagging it because "admin can do X" says nothing about whether "non-admin
cannot do X", and for a personal-data module the second question is the one with
real consequences. 