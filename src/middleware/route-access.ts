export const protectedRouteAccess = {
  admin: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  teacher: ["TEACHER"],
  student: ["STUDENT", "PARENT"],
} as const;
