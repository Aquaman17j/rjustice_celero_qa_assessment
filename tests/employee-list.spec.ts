import { test } from '../src/fixtures/test.fixtures';
import { fullName, newEmployee } from '../src/utils/data';

test.describe('Employee List', () => {

  test('TC-02 — finds a created employee by Employee Id and by name', async ({
    addEmployeePage,
    employeeListPage,
    createdEmployeeIds,
  }) => {
    // Same shape TC-01 creates: required fields only, pre-filled Employee Id.
    const employee = newEmployee();

    await addEmployeePage.goto();
    await addEmployeePage.fillEmployee(employee);
    const assignedId = await addEmployeePage.readEmployeeId();
    await addEmployeePage.save();
    await addEmployeePage.expectRedirectedToNewEmployee();
    createdEmployeeIds.push(assignedId);

    await employeeListPage.goto();

    // Search by Employee Id. Assert on the name, not the id typed into the
    // filter -- confirming the value you just entered proves nothing.
    await employeeListPage.searchByEmployeeId(assignedId);
    await employeeListPage.expectExactlyOneRowMatching([
      employee.firstName,
      employee.lastName,
    ]);

    // Reset, then search by Employee Name via the autocomplete.
    await employeeListPage.reset();
    await employeeListPage.selectEmployeeName(fullName(employee));
    await employeeListPage.search();
    await employeeListPage.expectExactlyOneRowMatching([
      employee.firstName,
      employee.lastName,
      assignedId,
    ]);
  });
});