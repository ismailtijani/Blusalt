import { UserRole } from '../enums/enum';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface CurrentUser {
  sub: string;
  email: string;
  role: string;
}

// export interface AuthResponse {
//   user: Omit<User, 'password' | 'refreshToken'>;
//   tokens: Tokens;
// }
