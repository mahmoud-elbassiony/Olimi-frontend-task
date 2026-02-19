"use client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import { useAgentForm } from "@/hooks/use-agent-form";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useToast } from "@/hooks/use-toast";
import { BasicSettingsSection } from "./basic-settings-section";
import { ReferenceDataSection } from "./reference-data-section";
import { ToolsSection } from "./tools-section";
import { TestCallCard } from "./test-call-card";
import { CollapsibleSection } from "./collapsible-section";
import { AgentFormInitialData } from "@/types/agent";

type AgentFormProps = {
  mode: "create" | "edit";
  initialData?: AgentFormInitialData;
};

export function AgentForm({ mode, initialData }: AgentFormProps) {
  const { toasts, addToast, dismissToast } = useToast();
  const form = useAgentForm(mode, initialData, addToast);
  const { files, addFiles, removeFile, getAttachmentIds } = useFileUpload();
  const onSave = () => form.handleSave(getAttachmentIds());

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{form.heading}</h1>
        <Button onClick={onSave} disabled={form.isSaving}>
          {form.isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {form.saveLabel}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <BasicSettingsSection
            fields={form.fields}
            setField={form.setField}
            errors={form.errors}
            basicSettingsMissing={form.basicSettingsMissing}
          />

          {/* Call Script (inline — too small to extract) */}
          <CollapsibleSection
            title="Call Script"
            description="What would you like the AI agent to say during the call?"
          >
            <div className="space-y-2">
              <Textarea
                placeholder="Write your call script here..."
                value={form.fields.callScript}
                onChange={(e) => form.setField("callScript", e.target.value)}
                rows={6}
                maxLength={20000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {form.fields.callScript.length}/20000
              </p>
            </div>
          </CollapsibleSection>

          {/* Service/Product Description (inline — too small to extract) */}
          <CollapsibleSection
            title="Service/Product Description"
            description="Add a knowledge base about your service or product."
          >
            <div className="space-y-2">
              <Textarea
                placeholder="Describe your service or product..."
                value={form.fields.serviceDescription}
                onChange={(e) =>
                  form.setField("serviceDescription", e.target.value)
                }
                rows={6}
                maxLength={20000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {form.fields.serviceDescription.length}/20000
              </p>
            </div>
          </CollapsibleSection>

          <ReferenceDataSection
            files={files}
            addFiles={addFiles}
            removeFile={removeFile}
            markDirty={form.markDirty}
            addToast={addToast}
          />

          <ToolsSection fields={form.fields} setField={form.setField} />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6">
            <TestCallCard
              agentId={form.agentId}
              isDirty={form.isDirty}
              handleSave={onSave}
              addToast={addToast}
            />
          </div>
        </div>
      </div>

      {/* Sticky bottom save bar */}
      <div className="sticky bottom-0 -mx-6 -mb-6 border-t bg-background px-6 py-4">
        <div className="flex justify-end">
          <Button onClick={onSave} disabled={form.isSaving}>
            {form.isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {form.saveLabel}
          </Button>
        </div>
      </div>

      {/* Toast notifications */}
      <Toaster toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
