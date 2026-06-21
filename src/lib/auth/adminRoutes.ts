const ROUTE_RULES: { prefix: string; allowedRoles: string[] }[] = [
  { prefix: "/admin/users", allowedRoles: ["super_admin"] },
  { prefix: "/admin", allowedRoles: ["super_admin", "admin", "editor"] },
];

export function isRoleAllowedForPath(role: string, pathname: string): boolean {
  const rule = ROUTE_RULES.filter((r) => pathname.startsWith(r.prefix)).sort(
    (a, b) => b.prefix.length - a.prefix.length
  )[0];
  return rule ? rule.allowedRoles.includes(role) : true;
}
