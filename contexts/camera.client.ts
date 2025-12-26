// api/camera.client.ts
import { createServiceClient } from './createServiceClient';

export const cameraApi = createServiceClient(
  'http://72.60.102.111:8090'
);
