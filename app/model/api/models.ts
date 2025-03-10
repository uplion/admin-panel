'use server';

import { z } from 'zod'
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { applyAIModel, deleteAIModel } from '@/lib/k8s';

const AddModelSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['remote', 'local']),
  modelName: z.string().min(1),
  baseUrl: z.string().optional(),
  apiToken: z.string().optional(),
  maxProcesses: z.number().min(1).optional(),
})

export type AddModelType = z.infer<typeof AddModelSchema>

const IMAGE = process.env.IMAGE || 'youxam/uplion-aimodel-operator-test-worker:latest';

export async function addModel(data_: Record<string, any>) {
  const data = AddModelSchema.parse(data_)

  const existingModel = await prisma.aiModel.findFirst({
    where: {
      name: data.name
    }
  })

  if (existingModel) {
    throw new Error("Model already exists, try a different name")
  }

  let msgBacklogThreshold = undefined

  if (process.env.MSG_BACKLOG_THRESHOLD) {
    msgBacklogThreshold = parseInt(process.env.MSG_BACKLOG_THRESHOLD)
    if (!msgBacklogThreshold) {
      console.warn('Invalid MSG_BACKLOG_THRESHOLD, using default value 5')
      msgBacklogThreshold = 5
    }
  }

  await applyAIModel(data.name, {
    type: data.type,
    baseURL: data.baseUrl,
    apiKey: data.apiToken,
    model: data.modelName,
    image: IMAGE,
    maxProcessNum: data.maxProcesses || (data.type === 'local' ? 4 : 128),
    replicas: process.env.REPLICAS ? parseInt(process.env.REPLICAS) || 3 : 3,
    msgBacklogThreshold
  })

  const newaimodel = await prisma.aiModel.create({ data: {
    ...data,
    maxProcesses: data.maxProcesses || 128
  } })

  revalidatePath('/model/')
  return newaimodel
}

export async function editModel(id: number, data_: Record<string, any>) {
  const data = AddModelSchema.parse(data_);

  const model = await prisma.aiModel.findUnique({
    where: { id: id }
  });

  if (!model) {
    throw new Error("Model not found");
  }

  if (model.name != data.name) {
    await deleteAIModel(model.name)
  }

  await applyAIModel(data.name, {
    type: data.type,
    baseURL: data.baseUrl,
    apiKey: data.apiToken,
    model: data.modelName,
    image: IMAGE,
    maxProcessNum: data.maxProcesses || (data.type === 'local' ? 4 : 128),
    replicas: 3,
    msgBacklogThreshold: 5
  })

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
  const model = await prisma.aiModel.findUnique({
    where: { id: id }
  });

  if (!model) {
    throw new Error("Model not found");
  }

  await prisma.aiModel.delete({
    where: { id }
  });

  await deleteAIModel(model.name)

  revalidatePath('/model/model/' + id.toString())
  revalidatePath('/model/edit/' + id.toString())
  revalidatePath('/model/delete/' + id.toString())
  revalidatePath('/model/')
}
