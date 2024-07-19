import { KubeConfig, CustomObjectsApi } from '@kubernetes/client-node'



const globalForK8s = global as unknown as { k8sApi: CustomObjectsApi }

function getK8sApi() {
  if (globalForK8s.k8sApi) return globalForK8s.k8sApi
  const kc = new KubeConfig();
  kc.loadFromDefault()
  return kc.makeApiClient(CustomObjectsApi)
}

if (process.env.NODE_ENV !== 'production') globalForK8s.k8sApi = getK8sApi()

type AIModelSpec = {
  type: 'local' | 'remote'
  model: string
  msgBacklogThreshold?: number
  replicas?: number
  image: string
  maxProcessNum: number

  baseURL?: string
  apiKey?: string
}

type AIModelConfig = {
  apiVersion: "model.youxam.com/v1alpha1"
  kind: "AIModel"
  metadata: {
    name: string
  }
  spec: AIModelSpec
}

interface K8sConfig {
  metadata: {
    name: string
    resourceVersion?: string
  }
  spec: object
}


export async function applyAIModel(name: string, data: AIModelSpec) {
  const body: AIModelConfig = {
    apiVersion: "model.youxam.com/v1alpha1",
    kind: "AIModel",
    metadata: {
      name: name + '-ai-model',
    },
    spec: data
  }
  await __applyAIModel('default', body)
}

export async function getModelsStatus() {
  const k8sApi = getK8sApi()
  const res = await k8sApi.listClusterCustomObject('model.youxam.com', 'v1alpha1', 'aimodels')
  return res.body
}

export async function getModelStatus(name: string) {
  const k8sApi = getK8sApi()
  try {
    const res = await k8sApi.getNamespacedCustomObject('model.youxam.com', 'v1alpha1', 'default', 'aimodels', name + '-ai-model')
    return res.body
  } catch (e: any) {
    if (e.response && e.response.statusCode === 404) {
      console.warn('CRD object not found');
      return null
    } else {
      console.error('Error getting CRD object:', e);
      return null
    }
  }
}

export async function deleteAIModel(name: string) {
  const k8sApi = getK8sApi()
  try {
    await k8sApi.deleteNamespacedCustomObject('model.youxam.com', 'v1alpha1', 'default', 'aimodels', name + '-ai-model')
  } catch (e: any) {
    if (e.response && e.response.statusCode === 404) {
      console.log('CRD object not found');
    } else {
      console.error('Error deleting CRD object:', e);
    }
  }
}

async function __applyAIModel(namespace: string, body: AIModelConfig) {
  await applyCustomResource('model.youxam.com', 'v1alpha1', namespace, 'aimodels', body)
}

async function applyCustomResource(group: string, version: string, namespace: string, plural: string, body: K8sConfig) {
  const k8sApi = getK8sApi()
  try {
    const existing = await k8sApi.getNamespacedCustomObject(group, version, namespace, plural, body.metadata.name)
    console.log('CRD object already exists, replacing');
    const oldModel = existing.body as K8sConfig
    body.metadata.resourceVersion = oldModel.metadata.resourceVersion
    await k8sApi.replaceNamespacedCustomObject(group, version, namespace, plural, body.metadata.name, body)
    console.log('CRD object replaced successfully');
  } catch (e: any) {
    if (e.response && e.response.statusCode === 404) {
      console.log('CRD object not found, creating');
      try {
        await k8sApi.createNamespacedCustomObject(group, version, namespace, plural, body)
        console.log('CRD object created successfully');
      } catch (e: any) {
        console.error('Error creating CRD object:', e);
      }
    } else {
      console.error('Error applying CRD object:', e);
    }
  }
}
