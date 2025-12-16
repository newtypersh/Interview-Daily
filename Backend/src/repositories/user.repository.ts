import { Prisma, PrismaClient, User } from '@prisma/client';
import { prisma } from '../db.config.js';

type PrismaTx = Prisma.TransactionClient | PrismaClient;

export const findByEmail = async (client: PrismaTx, email: string): Promise<User | null> => {
  return client.user.findFirst({ where: { email } });
};

export const findById = async (client: PrismaTx, id: string | number | bigint): Promise<User | null> => {
  return client.user.findUnique({ where: { id: BigInt(id) } });
};

export const createUser = async (client: PrismaTx, data: Prisma.UserCreateInput): Promise<User> => {
  return client.user.create({ data });
};

export const updateUpdatedAt = async (client: PrismaTx, id: string | number | bigint, now: Date = new Date()): Promise<User> => {
  return client.user.update({ where: { id: BigInt(id) }, data: { updated_at: now } });
};

export const findUserById = async (userId: string | number | bigint): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: { id: BigInt(userId) },
  });
  return user;
};
