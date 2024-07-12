'use server';

import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod'
import { AiModel } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

import prisma from '@/lib/prisma';

const AddModelSchema = z.lazy(() => z.object({
  name: z.string().min(1),
  type: z.enum(['remote', 'local']),
  modelName: z.string().min(1),
  baseUrl: z.string().optional(),
  apiToken: z.string().optional(),
  maxProcesses: z.number().min(1).optional(),
}))

export type AddModelType = z.infer<typeof AddModelSchema>

export async function addModel(data_: Record<string, any>) {
  const data = AddModelSchema.parse(data_)

  const newaimodel = await prisma.aiModel.create({ data: {
    ...data,
    maxProcesses: data.maxProcesses || 128
  } })

  revalidatePath('/model/')
  return newaimodel
}

export async function editModel(id: number, data_: Record<string, any>) {
  const data = AddModelSchema.parse(data_);

  const token = await prisma.aiModel.findUnique({
    where: { id: id }
  });

  if (!token) {
    throw new Error("Model not found");
  }

  await prisma.aiModel.update({
    where: { id: id },
    data: {
      ...data,
      maxProcesses: data.maxProcesses || 128,
    }
  });

  revalidatePath('/model/model/' + id);
  revalidatePath('/model/edit/' + id);
  revalidatePath('/model/delete/' + id);
  revalidatePath('/model/');
}


export async function fetchModels() {
  const models = await prisma.aiModel.findMany({
    orderBy: { id: 'desc' },
    select: {
      id: true,
      type: true,
      name: true,
      modelName: true,
    }
  })
  return models
}

export async function fetchModel(id: number) {
  const model = await prisma.aiModel.findUnique({
    where: { id: id }
  });

  return model
}


export async function deleteModel(id: number) {

  await prisma.aiModel.delete({
    where: { id }
  });

  revalidatePath('/model/model/' + id.toString())
  revalidatePath('/model/edit/' + id.toString())
  revalidatePath('/model/delete/' + id.toString())
  revalidatePath('/model/')
}
