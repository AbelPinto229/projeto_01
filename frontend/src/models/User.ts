// modelo de utilizador
export interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
  created_at: string;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  percentage: number;
}
