"use client";
import { useState } from "react";
import { Phone, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { initiateTestCall } from "@/lib/api";
import type { ToastVariant } from "@/hooks/use-toast";

type TestCallCardProps = {
  agentId: string | null;
  isDirty: boolean;
  handleSave: () => Promise<string | null>;
  addToast: (message: string, variant: ToastVariant) => void;
};

export function TestCallCard({
  agentId,
  isDirty,
  handleSave,
  addToast,
}: TestCallCardProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [isCalling, setIsCalling] = useState(false);

  const handleTestCall = async () => {
    if (!phone.trim()) {
      addToast("Phone number is required for test call.", "error");
      return;
    }

    setIsCalling(true);
    try {
      // Auto-save if unsaved changes or no agentId yet
      let currentAgentId = agentId;
      if (isDirty || !currentAgentId) {
        addToast("Saving agent before test call…", "info");
        currentAgentId = await handleSave();
        if (!currentAgentId) {
          setIsCalling(false);
          return;
        }
      }

      const result = await initiateTestCall(currentAgentId, {
        firstName,
        lastName,
        gender,
        phoneNumber: phone,
      });

      if (result.success) {
        addToast(`Test call initiated! ${result.status}`, "success");
      }
    } catch (err) {
      addToast(
        err instanceof Error
          ? err.message
          : "Failed to initiate test call. Please try again.",
        "error",
      );
    } finally {
      setIsCalling(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Test Call
        </CardTitle>
        <CardDescription>
          Make a test call to preview your agent. Each test call will deduct
          credits from your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="test-first-name">First Name</Label>
              <Input
                id="test-first-name"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-last-name">Last Name</Label>
              <Input
                id="test-last-name"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="test-phone">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <PhoneInput
              defaultCountry="EG"
              value={phone}
              onChange={(value) => setPhone(value)}
              placeholder="Enter phone number"
            />
          </div>

          <Button
            className="w-full"
            onClick={handleTestCall}
            disabled={isCalling}
          >
            {isCalling ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Phone className="mr-2 h-4 w-4" />
            )}
            {isCalling ? "Calling…" : "Start Test Call"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
