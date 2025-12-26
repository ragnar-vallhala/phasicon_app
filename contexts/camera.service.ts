import api from './axios.instance';

export type CameraSummaryItem = {
  activity: string;
  total_seconds: number;
};

const CAMERA_BASE_URL = 'http://72.60.102.111:8090';

export async function fetchCameraSummary(
  userId: number,
  start: number,
  end: number
): Promise<CameraSummaryItem[]> {
  const res = await api.get('/api/v1/camera/summary', {
    baseURL: CAMERA_BASE_URL, // 👈 override HERE
    params: {
      user_id: userId,
      start,
      end,
    },
  });

  return res.data;
}
