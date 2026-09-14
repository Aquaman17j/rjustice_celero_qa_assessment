/**
 * Test data generation.
 */

import { randomUUID } from 'crypto';

/** Marks every record this suite creates. */
export const TEST_PREFIX = 'QA';

export interface EmployeeInput {
  firstName: string;
  middleName: string;
  employeeId?: string;
  lastName: string;
}

/** 8 hex characters from a UUID. */
function shortId(): string {
  return randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
}

/**
 * A unique employee.
 *
 * The unique suffix goes in the **last name** because the Employee List search
 * matches on full name -- a shared first name would make results ambiguous when
 * runs overlap on the shared instance.
 */
export function newEmployee(overrides: Partial<EmployeeInput> = {}): EmployeeInput {
  return {
    firstName: 'Test',
    middleName: '',
    lastName: `${TEST_PREFIX}${shortId()}`,
    ...overrides,
  };
}

/** Full name as the Employee List autocomplete renders it. */
export function fullName(employee: EmployeeInput): string {
  return [employee.firstName, employee.middleName, employee.lastName]
    .filter(Boolean)
    .join(' ');
}