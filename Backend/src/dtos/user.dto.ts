import { User } from "@prisma/client";

export const userDto = (user: User) => {
  return {
    id: user.id.toString(),
    email: user.email,
    name: user.name,
  };
};