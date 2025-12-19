const FILE_SERVER_URL = 'http://72.60.102.111:8010';
const BUCKET = "phasicon";

export async function uploadImageToBucket(
  fileUri: string,
  filename: string
): Promise<string> {
  const formData = new FormData();

  formData.append('file', {
    uri: fileUri,
    name: filename,
    type: 'image/jpeg',
  } as any);

  const res = await fetch(
    `${FILE_SERVER_URL}/api/${BUCKET}/${filename}`,
    {
      method: 'PUT',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  if (!res.ok) {
    throw new Error('File upload failed');
  }

  const data = await res.json();
  return `${FILE_SERVER_URL}${data.url}`;
}
