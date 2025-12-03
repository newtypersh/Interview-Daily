import { Prisma } from '@prisma/client';

/**
 * Repository helpers for user model.
 * All functions accept a prisma client (prisma or transaction client) so they
 * can be used inside transactions.
 */
export const findByEmail = async (client, email) => {
  return client.user.findFirst({ where: { email } });
};

export const findById = async (client, id) => {
  return client.user.findUnique({ where: { id } });
};

export const createUser = async (client, data) => {
  return client.user.create({ data });
};

export const updateUpdatedAt = async (client, id, now = new Date()) => {
  return client.user.update({ where: { id }, data: { updated_at: now } });
};

export const findUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  return user;
};
