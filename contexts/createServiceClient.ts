// api/createServiceClient.ts
import api from './axios.instance';

export function createServiceClient(baseURL: string) {
  return api.create({ baseURL });
}
