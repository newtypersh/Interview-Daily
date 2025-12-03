export const userDto = (user) => {
  return {
    id: user.id.toString(),
    email: user.email,
    name: user.name,
  };
};