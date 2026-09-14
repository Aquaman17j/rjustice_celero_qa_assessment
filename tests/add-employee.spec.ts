import { expect, test } from '../src/fixtures/test.fixtures';
import { newEmployee } from '../src/utils/data';

test.describe('Add Employee', () => {
  test.beforeEach(async ({ addEmployeePage }) => {
    await addEmployeePage.goto();
  });
  test('TC-01 — creates an employee with required fields only @smoke', async ({
    addEmployeePage,
    createdEmployeeIds,
  }) => {
    const employee = newEmployee();

    await addEmployeePage.fillEmployee(employee);

    // Capture before saving -- the field is gone once the form submits.
    const assignedId = await addEmployeePage.readEmployeeId();
    expect(assignedId, 'the form should pre-fill an Employee Id').not.toBe('');

    await addEmployeePage.save();

    await addEmployeePage.expectSaveSuccess();
    await addEmployeePage.expectRedirectedToNewEmployee();

    createdEmployeeIds.push(assignedId);

    expect(addEmployeePage.employeeNumberFromUrl()).not.toBeNull();

    // Remove the code for looking up the newly created employee as this 
    // is already handkled in TC-02
    //using it as a means to determine the pass of this test is redundant 
  });


  test('TC-04 — rejects a save with no first or last name', async ({ addEmployeePage }) => {
    await addEmployeePage.save();

    await addEmployeePage.expectRequiredFieldErrors();
    await addEmployeePage.expectStillOnForm();
  });


  test('TC-05 — rejects a duplicate Employee Id', async ({
    addEmployeePage,
    employeeListPage,
    createdEmployeeIds,
  }) => {
    const first = newEmployee();
    await addEmployeePage.fillEmployee(first);

    const assignedId = await addEmployeePage.readEmployeeId();
    await addEmployeePage.save();
    await addEmployeePage.expectRedirectedToNewEmployee();
    createdEmployeeIds.push(assignedId);

    // Different person, same Employee Id.
    const duplicate = newEmployee({ employeeId: assignedId });
    await addEmployeePage.goto();
    await addEmployeePage.fillEmployee(duplicate);
    await addEmployeePage.save();

    await addEmployeePage.expectDuplicateEmployeeIdError();
    await addEmployeePage.expectStillOnForm();

    // The outcome that actually matters: the Id still resolves to exactly one
    // record, and it's the original -- not just that a toast was shown.
    await employeeListPage.goto();
    await employeeListPage.searchByEmployeeId(assignedId);
    await employeeListPage.expectExactlyOneRowMatching([first.lastName]);
  });
});