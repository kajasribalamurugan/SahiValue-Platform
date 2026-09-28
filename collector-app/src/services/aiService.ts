import { File } from 'expo-file-system';
import { API_BASE_URL } from '../config/api';

export interface AIClassifyResponse {
  material: string;
  category: string;
  confidence: number;
  description: string;
  provider: string;
}

export async function classifyEWasteImage(imageUri: string): Promise<AIClassifyResponse> {
  const formData = new FormData();

  const filename = imageUri.split('/').pop() || 'photo.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const mimeType = match ? `image/${match[1]}` : 'image/jpeg';

  let filePart: any;

  try {
    // 1. Preferred modern Expo SDK 57 File API
    filePart = new File(imageUri);
  } catch (err) {
    console.log('File API instantiation fallback:', err);
    try {
      // 2. Fallback using fetch blob for React Native 0.86
      const response = await fetch(imageUri);
      const blob = await response.blob();
      if (typeof window !== 'undefined' && (window as any).File) {
        filePart = new (window as any).File([blob], filename, { type: mimeType });
      } else {
        filePart = blob;
      }
    } catch (err2) {
      console.log('Blob fallback failed:', err2);
      // 3. Fallback object if needed
      filePart = {
        uri: imageUri,
        name: filename,
        type: mimeType,
      };
    }
  }

  // Append real File/Blob to FormData
  formData.append('image', filePart, filename);

  const endpointUrl = `${API_BASE_URL}/ai/classify`;

  // Do NOT manually set Content-Type header so fetch generates multipart boundary
  const response = await fetch(endpointUrl, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    let detail = 'AI Classification failed on backend server.';
    try {
      const parsed = JSON.parse(errorText);
      if (parsed.detail) {
        detail = typeof parsed.detail === 'string' ? parsed.detail : JSON.stringify(parsed.detail);
      }
    } catch (e) {
      // ignore json parse error
    }
    throw new Error(detail);
  }

  const data: AIClassifyResponse = await response.json();
  return data;
}
