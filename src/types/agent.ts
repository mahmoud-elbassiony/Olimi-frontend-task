// API Response Types

export interface Language {
  id: string;
  name: string;
  code: string;
}

export interface Voice {
  id: string;
  name: string;
  tag: string;
  language: string;
}

export interface Prompt {
  id: string;
  name: string;
  description: string;
}

export interface Model {
  id: string;
  name: string;
  description: string;
}

// Agent CRUD

export interface AgentPayload {
  name: string;
  description: string;
  callType: string;
  language: string;
  voice: string;
  prompt: string;
  model: string;
  latency: number;
  speed: number;
  callScript: string;
  serviceDescription: string;
  attachments: string[];
  tools: {
    allowHangUp: boolean;
    allowCallback: boolean;
    liveTransfer: boolean;
  };
}

export interface AgentResponse extends AgentPayload {
  id: string;
}

// File Upload

export interface UploadUrlResponse {
  key: string;
  signedUrl: string;
  expiresIn: number;
}

export interface UploadResult {
  success: boolean;
  key: string;
  message: string;
}

export interface AttachmentPayload {
  key: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export interface AttachmentResponse extends AttachmentPayload {
  id: string;
}

// Test Call

export interface TestCallPayload {
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
}

export interface TestCallResponse {
  success: boolean;
  callId: string;
  agentId: string;
  status: string;
}

// Form Types

export interface AgentFormInitialData {
  agentName?: string;
  description?: string;
  callType?: string;
  language?: string;
  voice?: string;
  prompt?: string;
  model?: string;
  latency?: number;
  speed?: number;
  callScript?: string;
  serviceDescription?: string;
}

export interface AgentFormProps {
  mode: "create" | "edit";
  initialData?: AgentFormInitialData;
}

// Unified form fields (single state object)

export interface AgentFormFields {
  agentName: string;
  description: string;
  callType: string;
  language: string;
  voice: string;
  prompt: string;
  model: string;
  latency: number[];
  speed: number[];
  callScript: string;
  serviceDescription: string;
  allowHangUp: boolean;
  allowCallback: boolean;
  liveTransfer: boolean;
}

/** Generic typed setter — marks dirty + clears validation errors automatically. */
export type SetFieldFn = <K extends keyof AgentFormFields>(
  field: K,
  value: AgentFormFields[K],
) => void;
