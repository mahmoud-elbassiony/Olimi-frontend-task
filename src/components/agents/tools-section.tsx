"use client";
import { Switch } from "@/components/ui/switch";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import type { AgentFormFields, SetFieldFn } from "@/types/agent";
import { CollapsibleSection } from "./collapsible-section";

type ToolsSectionProps = {
  fields: AgentFormFields;
  setField: SetFieldFn;
};

export function ToolsSection({ fields, setField }: ToolsSectionProps) {
  return (
    <CollapsibleSection
      title="Tools"
      description="Tools that allow the AI agent to perform call-handling actions and manage session control."
    >
      <FieldGroup className="w-full">
        <FieldLabel htmlFor="switch-hangup">
          <Field orientation="horizontal" className="items-center">
            <FieldContent>
              <FieldTitle>Allow hang up</FieldTitle>
              <FieldDescription>
                Select if you would like to allow the agent to hang up the call
              </FieldDescription>
            </FieldContent>
            <Switch
              id="switch-hangup"
              checked={fields.allowHangUp}
              onCheckedChange={(v) => setField("allowHangUp", v)}
            />
          </Field>
        </FieldLabel>

        <FieldLabel htmlFor="switch-callback">
          <Field orientation="horizontal" className="items-center">
            <FieldContent>
              <FieldTitle>Allow callback</FieldTitle>
              <FieldDescription>
                Select if you would like to allow the agent to make callbacks
              </FieldDescription>
            </FieldContent>
            <Switch
              id="switch-callback"
              checked={fields.allowCallback}
              onCheckedChange={(v) => setField("allowCallback", v)}
            />
          </Field>
        </FieldLabel>

        <FieldLabel htmlFor="switch-transfer">
          <Field orientation="horizontal" className="items-center">
            <FieldContent>
              <FieldTitle>Live transfer</FieldTitle>
              <FieldDescription>
                Select if you want to transfer the call to a human agent
              </FieldDescription>
            </FieldContent>
            <Switch
              id="switch-transfer"
              checked={fields.liveTransfer}
              onCheckedChange={(v) => setField("liveTransfer", v)}
            />
          </Field>
        </FieldLabel>
      </FieldGroup>
    </CollapsibleSection>
  );
}
