import type { AgentFormInitialData } from "@/types/agent";

export function validateAgentForm(
  fields: AgentFormInitialData,
): AgentFormInitialData {
  const errors: AgentFormInitialData = {};

  if (!fields?.agentName?.trim()) errors.agentName = "Agent name is required";
  if (!fields?.callType) errors.callType = "Please select a call type";
  if (!fields?.language) errors.language = "Please select a language";
  if (!fields?.voice) errors.voice = "Please select a voice";
  if (!fields?.prompt) errors.prompt = "Please select a prompt";
  if (!fields?.model) errors.model = "Please select a model";

  return errors;
}

export function hasErrors(errors: AgentFormInitialData): boolean {
  return Object.keys(errors).length > 0;
}
