'use server';

import { v4 as uuidv4 } from 'uuid';

import { z } from 'zod'
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import prisma from '@/lib/prisma';

const AddTokenSchema = z.lazy(() => z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  expiresAt: z.date().min(new Date()).optional(),
  allowedModels: z.array(z.string()).optional(),
  isQuotaLimited: z.boolean(),
  remainingTokens: z.number().optional()
}))

export type AddTokenType = z.infer<typeof AddTokenSchema>


export async function addToken(data_: Record<string, any>) {
  const data = AddTokenSchema.parse(data_)
  const value = uuidv4().replaceAll("-", "").slice(0, 16)

  const existingToken = await prisma.token.findFirst({
    where: { key: value }
  })

  if (existingToken) {
    throw new Error("Token with the same key already exists, try again")
  }

  const expiration = data.expiresAt ? data.expiresAt.toISOString() : data.expiresAt

  await prisma.token.create({
    data: {
        key: value,
        name: data.name,
        description: data.description,
        allowedModels: data.allowedModels || [],
        expiresAt: expiration,
        isQuotaLimited: data.isQuotaLimited,
        remainingTokens: data.remainingTokens
    }
})

  revalidatePath('/token/')
  return value
}

export async function updateEnable(id: number, enable: boolean) {
  const token = await prisma.token.findUnique({
    where: { id }
  })

  if (!token) {
    throw new Error("Token not found")
  }

  await prisma.token.update({
    where: { id },
    data: {
      isEnabled: enable
    }
  })

  revalidatePath('/token/edit/' + id.toString())
  revalidatePath('/token/')
}

export async function editToken(id: number, data_: Record<string, any>) {
  const data = AddTokenSchema.parse(data_);

  const token = await prisma.token.findUnique({
    where: { id: id }
  });

  if (!token) {
    throw new Error("Token not found");
  }

  const expiration = data.expiresAt ? data.expiresAt.toISOString() : data.expiresAt;

  await prisma.token.update({
    where: { id: id },
    data: {
      name: data.name,
      description: data.description,
      allowedModels: data.allowedModels || [],
      expiresAt: expiration || null,
      isQuotaLimited: data.isQuotaLimited,
      remainingTokens: data.remainingTokens
    }
  });

  revalidatePath('/token/token/' + id);
  revalidatePath('/token/edit/' + id);
  revalidatePath('/token/roll/' + id);
  revalidatePath('/token/delete/' + id);
  revalidatePath('/token/');
}


export async function fetchTokens() {
  const tokens = await prisma.token.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return tokens
}

export async function fetchToken(id: number) {
  const token = await prisma.token.findUnique({
    where: { id: id }
  });

  return token
}


export async function deleteToken(id: number) {

  await prisma.token.delete({
    where: { id }
  });

  revalidatePath('/token/token/' + id.toString())
  revalidatePath('/token/edit/' + id.toString())
  revalidatePath('/token/roll/' + id.toString())
  revalidatePath('/token/delete/' + id.toString())
  revalidatePath('/token/')
}

export async function rollToken(id: number) {
  const token = await prisma.token.findUnique({
    where: { id }
  })

  if (!token) throw new Error("Token not found")
  const value = uuidv4().replaceAll("-", "").slice(0, 16)
  const res = await prisma.token.update({
    where: { id },
    data: {
      key: value,
    }
  })

  revalidatePath('/token/token/' + id.toString())
  return value
}
