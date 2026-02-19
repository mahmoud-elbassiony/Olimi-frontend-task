"use client";
import { useState, useRef } from "react";
import { Upload, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UploadedFileEntry } from "@/hooks/use-file-upload";
import { CollapsibleSection } from "./collapsible-section";
import {
  ACCEPTED_FILE_TYPES,
  formatFileSize,
  FileStatusIcon,
} from "./form-helpers";

type ReferenceDataSectionProps = {
  files: UploadedFileEntry[];
  addFiles: (fileList: FileList | null) => void;
  removeFile: (index: number) => void;
  markDirty: () => void;
  addToast: (message: string, variant: "error") => void;
};

function filterAcceptedFiles(fileList: FileList): DataTransfer {
  const dt = new DataTransfer();
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (ACCEPTED_FILE_TYPES.includes(ext)) {
      dt.items.add(file);
    }
  }
  return dt;
}

export function ReferenceDataSection({
  files,
  addFiles,
  removeFile,
  markDirty,
  addToast,
}: ReferenceDataSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList) return;
    const dt = filterAcceptedFiles(fileList);

    if (dt.files.length === 0) {
      addToast(
        "No supported files found. Accepted: " + ACCEPTED_FILE_TYPES.join(", "),
        "error",
      );
      return;
    }

    addFiles(dt.files);
    markDirty();
  };

  return (
    <CollapsibleSection
      title="Reference Data"
      description="Enhance your agent's knowledge base with uploaded files."
    >
      <div className="space-y-4">
        {/* Drop zone */}
        <div
          className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFilesSelected(e.dataTransfer.files);
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept={ACCEPTED_FILE_TYPES.join(",")}
            onChange={(e) => {
              handleFilesSelected(e.target.files);
              e.target.value = "";
            }}
          />
          <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium">
            Drag & drop files here, or{" "}
            <button
              type="button"
              className="text-primary underline"
              onClick={() => fileInputRef.current?.click()}
            >
              browse
            </button>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Accepted: {ACCEPTED_FILE_TYPES.join(", ")}
          </p>
        </div>

        {/* File list */}
        {files.length > 0 ? (
          <div className="space-y-2">
            {files.map((f, i) => (
              <div
                key={i}
                className="relative flex items-center justify-between rounded-md border px-3 py-2 overflow-hidden"
              >
                {f.status === "uploading" && (
                  <div
                    className="absolute inset-0 bg-primary/5 transition-all duration-300"
                    style={{ width: `${f.progress}%` }}
                  />
                )}

                <div className="relative flex items-center gap-2 min-w-0">
                  <FileStatusIcon status={f.status} />
                  <span className="text-sm truncate">{f.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatFileSize(f.size)}
                  </span>
                  {f.status === "uploading" && (
                    <span className="text-xs text-primary font-medium shrink-0">
                      {f.progress}%
                    </span>
                  )}
                  {f.status === "error" && (
                    <span className="text-xs text-destructive shrink-0">
                      {f.errorMessage}
                    </span>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-7 w-7 shrink-0"
                  onClick={() => removeFile(i)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
            <FileText className="h-10 w-10 mb-2" />
            <p className="text-sm">No Files Available</p>
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
}
