/** Routes, messages, and timeouts for the PIM Add Employee workflow. */

export const ROUTES = {
  LOGIN: '/web/index.php/auth/login',
  DASHBOARD: '/web/index.php/dashboard/index',
  PIM_EMPLOYEE_LIST: '/web/index.php/pim/viewEmployeeList',
  PIM_ADD_EMPLOYEE: '/web/index.php/pim/addEmployee',
} as const;

export const MESSAGES = {
  SAVE_SUCCESS: 'Successfully Saved',
  REQUIRED: 'Required',
  INVALID_CREDENTIALS: 'Invalid credentials',
  DUPLICATE_EMPLOYEE_ID: 'Employee Id already exists',
} as const;

export const TIMEOUTS = {
  /** Toasts auto-dismiss; assert well inside that window. */
  TOAST: 10_000,
  DEFAULT: 15_000,
} as const;