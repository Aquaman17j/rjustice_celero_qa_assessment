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
