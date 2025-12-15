export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type Session = {
  id: string;
  sid: string;
  data: string;
  expiresAt: string;
};
