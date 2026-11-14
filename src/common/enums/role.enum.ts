export enum Role {
  SUPER_ADMIN = 'ROLE_SUPER_ADMIN',
  ADMIN = 'ROLE_ADMIN',
  MODERATOR = 'ROLE_MODERATOR',
  USER = 'ROLE_USER',
}

export const RoleHierarchy: { [key in Role]: number } = {
  [Role.SUPER_ADMIN]: 4,
  [Role.ADMIN]: 3,
  [Role.MODERATOR]: 2,
  [Role.USER]: 1,
};