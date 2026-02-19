"use client";
import { useState, useEffect } from "react";
import type {
  AgentFormInitialData,
  AgentFormFields,
  AgentPayload,
  SetFieldFn,
} from "@/types/agent";
import { createAgent, updateAgent } from "@/lib/api";
import { validateAgentForm, hasErrors } from "@/lib/validation";
import type { ToastVariant } from "@/hooks/use-toast";

// Default field values
function buildInitialFields(data?: AgentFormInitialData): AgentFormFields {
  return {
    agentName: data?.agentName ?? "",
    description: data?.description ?? "",
    callType: data?.callType ?? "",
    language: data?.language ?? "",
    voice: data?.voice ?? "",
    prompt: data?.prompt ?? "",
    model: data?.model ?? "",
    latency: [data?.latency ?? 0.5],
    speed: [data?.speed ?? 110],
    callScript: data?.callScript ?? "",
    serviceDescription: data?.serviceDescription ?? "",
    allowHangUp: false,
    allowCallback: false,
    liveTransfer: false,
  };
}

export function useAgentForm(
  mode: "create" | "edit",
  initialData: AgentFormInitialData | undefined,
  addToast: (message: string, variant: ToastVariant) => void,
) {
  const [fields, setFields] = useState<AgentFormFields>(() =>
    buildInitialFields(initialData),
  );
  const [errors, setErrors] = useState<AgentFormInitialData>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);

  // Generic setter: updates field, marks dirty, clears related error
  const setField: SetFieldFn = (field, value) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);

    // Clear validation error for this field (if one exists)
    setErrors((prev) => {
      if (field in prev) {
        const next = { ...prev };
        delete next[field as keyof AgentFormInitialData];
        return next;
      }
      return prev;
    });
  };

  // Standalone dirty setter for non-field changes (e.g. file uploads)
  const markDirty = () => setIsDirty(true);

  //Unsaved changes alert
  useEffect(() => {
    if (!isDirty) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const basicSettingsMissing = [
    fields.agentName,
    fields.callType,
    fields.language,
    fields.voice,
    fields.prompt,
    fields.model,
  ].filter((v) => !v).length;

  const heading = mode === "create" ? "Create Agent" : "Edit Agent";
  const saveLabel = mode === "create" ? "Save Agent" : "Save Changes";

  const buildPayload = (attachmentIds: string[]): AgentPayload => ({
    name: fields.agentName,
    description: fields.description,
    callType: fields.callType,
    language: fields.language,
    voice: fields.voice,
    prompt: fields.prompt,
    model: fields.model,
    latency: fields.latency[0],
    speed: fields.speed[0],
    callScript: fields.callScript,
    serviceDescription: fields.serviceDescription,
    attachments: attachmentIds,
    tools: {
      allowHangUp: fields.allowHangUp,
      allowCallback: fields.allowCallback,
      liveTransfer: fields.liveTransfer,
    },
  });

  const handleSave = async (
    attachmentIds: string[],
  ): Promise<string | null> => {
    const validationErrors = validateAgentForm({
      agentName: fields.agentName,
      callType: fields.callType,
      language: fields.language,
      voice: fields.voice,
      prompt: fields.prompt,
      model: fields.model,
    });

    setErrors(validationErrors);

    if (hasErrors(validationErrors)) {
      addToast("Please fill in all required fields.", "error");
      return null;
    }

    setIsSaving(true);
    try {
      const payload = buildPayload(attachmentIds);
      let savedAgent;

      if (agentId) {
        savedAgent = await updateAgent(agentId, payload);
        addToast("Agent updated successfully!", "success");
      } else {
        savedAgent = await createAgent(payload);
        setAgentId(savedAgent.id);
        addToast("Agent created successfully!", "success");
      }

      setIsDirty(false);
      return savedAgent.id;
    } catch (err) {
      addToast(
        err instanceof Error
          ? err.message
          : "Failed to save agent. Please try again.",
        "error",
      );
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    fields,
    setField,
    errors,
    isDirty,
    markDirty,
    isSaving,
    agentId,
    basicSettingsMissing,
    heading,
    saveLabel,
    handleSave,
  };
}
