export const toPublicUser = (user) => {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email ?? null,
    name: user.name ?? null,
  };
};

export const userDto = (user) => {
  return {
    id: user.id.toString(),
    email: user.email,
    name: user.name,
  };
}