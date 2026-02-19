import { Loader2, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { FileUploadStatus } from "@/hooks/use-file-upload";

// Constants

export const ACCEPTED_FILE_TYPES = [
  ".pdf",
  ".doc",
  ".docx",
  ".txt",
  ".csv",
  ".xlsx",
  ".xls",
];

// Utilities

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// Small UI components

/** Inline validation error shown below a form field. */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive mt-1">{message}</p>;
}

/** Skeleton placeholder for a select dropdown while its data is loading. */
export function SelectSkeleton() {
  return <Skeleton className="h-9 w-full rounded-md" />;
}

/** Error banner shown when a dropdown API call fails. */
export function FetchError({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">
      <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
      <p className="text-xs text-destructive">{message}</p>
    </div>
  );
}

/** Icon that reflects the current upload status of a file. */
export function FileStatusIcon({ status }: { status: FileUploadStatus }) {
  switch (status) {
    case "uploading":
      return <Loader2 className="h-4 w-4 shrink-0 text-primary animate-spin" />;
    case "done":
      return <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />;
    case "error":
      return <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />;
    default:
      return <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />;
  }
}
