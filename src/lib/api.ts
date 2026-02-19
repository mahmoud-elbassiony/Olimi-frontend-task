import type {
  AgentPayload,
  AgentResponse,
  UploadUrlResponse,
  UploadResult,
  AttachmentPayload,
  AttachmentResponse,
  TestCallPayload,
  TestCallResponse,
} from "@/types/agent";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

// Fetch helpers

async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

async function put<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
  return res.json();
}

// Agent CRUD

export const createAgent = (data: AgentPayload) =>
  post<AgentResponse>("/agents", data);

export const updateAgent = (id: string, data: AgentPayload) =>
  put<AgentResponse>(`/agents/${id}`, data);

// File upload (3 steps)

export const getUploadUrl = () =>
  post<UploadUrlResponse>("/attachments/upload-url");

export async function uploadFileToSignedUrl(
  signedUrl: string,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", signedUrl);
    xhr.setRequestHeader("Content-Type", "application/octet-stream");

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () =>
      reject(new Error("Upload network error")),
    );
    xhr.send(file);
  });
}

export const registerAttachment = (data: AttachmentPayload) =>
  post<AttachmentResponse>("/attachments", data);

// Test call

export const initiateTestCall = (agentId: string, data: TestCallPayload) =>
  post<TestCallResponse>(`/agents/${agentId}/test-call`, data);
