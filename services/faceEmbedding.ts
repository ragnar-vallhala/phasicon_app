import axios from 'axios';

const FACE_API_BASE_URL = 'http://72.60.102.111:8020';


export async function getFaceEmbeddingFromImage(
  imageUri: string
): Promise<number[]> {
  const formData = new FormData();

  formData.append('image', {
    uri: imageUri,
    name: 'face.jpg',
    type: 'image/jpeg',
  } as any);

  const res = await fetch(
    `${FACE_API_BASE_URL}/api/face/embedding/`,
    {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  const resData = await res.json();
  // console.log("Response from Face",resData);
  if (!resData?.embedding || resData?.dimension !== 512) {
    
    throw new Error('Invalid embedding response from face API');
  }

  return resData.embedding;
}
