/**
 * Alfred API Configuration
 *
 * Update API_BASE_URL to point to your FastAPI backend.
 * For local development: http://localhost:8000
 * For production: https://your-server.com
 */

export const API_BASE_URL = 'http://localhost:8000';

export const API_ENDPOINTS = {
  chat: `${API_BASE_URL}/api/chat`,
  upload: `${API_BASE_URL}/api/upload`,
} as const;

export interface ChatRequest {
  message: string;
  attachments?: {
    name: string;
    type: string;
    content: string; // base64-encoded content
    size: number;
  }[];
  conversation_id?: string | null;
}

export interface ChatResponse {
  response: string;
  model?: string;
  conversation_id?: string;
}

export interface UploadResponse {
  filename: string;
  type: string;
  size: number;
  content: string; // parsed text content
}

export async function sendChatMessage(
  payload: ChatRequest,
  signal?: AbortSignal,
): Promise<ChatResponse> {
  const response = await fetch(API_ENDPOINTS.chat, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`API error (${response.status}): ${errorText}`);
  }

  return response.json() as Promise<ChatResponse>;
}

export async function uploadFile(
  file: { name: string; type: string; content: string; size: number },
  signal?: AbortSignal,
): Promise<UploadResponse> {
  const response = await fetch(API_ENDPOINTS.upload, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(file),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Upload failed (${response.status})`);
  }

  return response.json() as Promise<UploadResponse>;
}