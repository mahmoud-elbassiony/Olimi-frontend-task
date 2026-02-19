"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Language,
  Voice,
  Prompt,
  Model,
  AgentFormFields,
  SetFieldFn,
  AgentFormInitialData,
} from "@/types/agent";
import { useApi } from "@/hooks/use-api";
import { CollapsibleSection } from "./collapsible-section";
import { FieldError, SelectSkeleton, FetchError } from "./form-helpers";

type BasicSettingsSectionProps = {
  fields: AgentFormFields;
  setField: SetFieldFn;
  errors: AgentFormInitialData;
  basicSettingsMissing: number;
};

export function BasicSettingsSection({
  fields,
  setField,
  errors,
  basicSettingsMissing,
}: BasicSettingsSectionProps) {
  const languagesApi = useApi<Language[]>("/languages");
  const voicesApi = useApi<Voice[]>("/voices");
  const promptsApi = useApi<Prompt[]>("/prompts");
  const modelsApi = useApi<Model[]>("/models");

  return (
    <CollapsibleSection
      title="Basic Settings"
      description="Add some information about your agent to get started."
      badge={basicSettingsMissing}
      defaultOpen
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Agent Name */}
        <div className="space-y-2">
          <Label htmlFor="agent-name">
            Agent Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="agent-name"
            placeholder="e.g. Sales Assistant"
            value={fields.agentName}
            onChange={(e) => setField("agentName", e.target.value)}
            className={errors.agentName ? "border-destructive" : ""}
          />
          <FieldError message={errors.agentName} />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="Describe what this agent does..."
            value={fields.description}
            onChange={(e) => setField("description", e.target.value)}
          />
        </div>

        {/* Call Type */}
        <div className="space-y-2">
          <Label>
            Call Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={fields.callType}
            onValueChange={(v) => setField("callType", v)}
          >
            <SelectTrigger
              className={`w-full ${errors.callType ? "border-destructive" : ""}`}
            >
              <SelectValue placeholder="Select call type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inbound">Inbound (Receive Calls)</SelectItem>
              <SelectItem value="outbound">Outbound (Make Calls)</SelectItem>
            </SelectContent>
          </Select>
          <FieldError message={errors.callType} />
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label>
            Language <span className="text-destructive">*</span>
          </Label>
          {languagesApi.loading ? (
            <SelectSkeleton />
          ) : languagesApi.error ? (
            <FetchError
              message={`Could not load languages: ${languagesApi.error}`}
            />
          ) : (
            <Select
              value={fields.language}
              onValueChange={(v) => setField("language", v)}
            >
              <SelectTrigger
                className={`w-full ${errors.language ? "border-destructive" : ""}`}
              >
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languagesApi.data?.map((lang) => (
                  <SelectItem key={lang.id} value={lang.id}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <FieldError message={errors.language} />
        </div>

        {/* Voice (with tag badge) */}
        <div className="space-y-2">
          <Label>
            Voice <span className="text-destructive">*</span>
          </Label>
          {voicesApi.loading ? (
            <SelectSkeleton />
          ) : voicesApi.error ? (
            <FetchError message={`Could not load voices: ${voicesApi.error}`} />
          ) : (
            <Select
              value={fields.voice}
              onValueChange={(v) => setField("voice", v)}
            >
              <SelectTrigger
                className={`w-full ${errors.voice ? "border-destructive" : ""}`}
              >
                <SelectValue placeholder="Select voice" />
              </SelectTrigger>
              <SelectContent>
                {voicesApi.data?.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    <span className="flex items-center gap-2">
                      {v.name}
                      <Badge
                        variant={v.tag === "Premium" ? "default" : "secondary"}
                        className="text-[10px] px-1.5 py-0"
                      >
                        {v.tag}
                      </Badge>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <FieldError message={errors.voice} />
        </div>

        {/* Prompt */}
        <div className="space-y-2">
          <Label>
            Prompt <span className="text-destructive">*</span>
          </Label>
          {promptsApi.loading ? (
            <SelectSkeleton />
          ) : promptsApi.error ? (
            <FetchError
              message={`Could not load prompts: ${promptsApi.error}`}
            />
          ) : (
            <Select
              value={fields.prompt}
              onValueChange={(v) => setField("prompt", v)}
            >
              <SelectTrigger
                className={`w-full ${errors.prompt ? "border-destructive" : ""}`}
              >
                <SelectValue placeholder="Select prompt" />
              </SelectTrigger>
              <SelectContent>
                {promptsApi.data?.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <FieldError message={errors.prompt} />
        </div>

        {/* Model */}
        <div className="space-y-2">
          <Label>
            Model <span className="text-destructive">*</span>
          </Label>
          {modelsApi.loading ? (
            <SelectSkeleton />
          ) : modelsApi.error ? (
            <FetchError message={`Could not load models: ${modelsApi.error}`} />
          ) : (
            <Select
              value={fields.model}
              onValueChange={(v) => setField("model", v)}
            >
              <SelectTrigger
                className={`w-full ${errors.model ? "border-destructive" : ""}`}
              >
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {modelsApi.data?.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    <span className="flex flex-col">
                      <span>{m.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {m.description}
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <FieldError message={errors.model} />
        </div>

        {/* Sliders */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Latency ({fields.latency[0].toFixed(1)}s)</Label>
            <Slider
              value={fields.latency}
              onValueChange={(v) => setField("latency", v)}
              min={0.3}
              max={1}
              step={0.1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0.3s</span>
              <span>1.0s</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Speed ({fields.speed[0]}%)</Label>
            <Slider
              value={fields.speed}
              onValueChange={(v) => setField("speed", v)}
              min={90}
              max={130}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>90%</span>
              <span>130%</span>
            </div>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
}
