"use client";
import { useState } from "react";
import {
  getUploadUrl,
  uploadFileToSignedUrl,
  registerAttachment,
} from "@/lib/api";

export type FileUploadStatus = "idle" | "uploading" | "done" | "error";

export type UploadedFileEntry = {
  file: File;
  name: string;
  size: number;
  progress: number;
  status: FileUploadStatus;
  errorMessage?: string;
  attachmentId?: string;
  key?: string;
};

export function useFileUpload() {
  const [files, setFiles] = useState<UploadedFileEntry[]>([]);

  const updateFile = (index: number, patch: Partial<UploadedFileEntry>) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, ...patch } : f)),
    );
  };

  const uploadSingleFile = async (file: File, index: number) => {
    try {
      updateFile(index, { status: "uploading", progress: 0 });

      // Step 1: Get signed URL
      const { key, signedUrl } = await getUploadUrl();
      updateFile(index, { key, progress: 10 });

      // Step 2: Upload to signed URL
      await uploadFileToSignedUrl(signedUrl, file, (pct) => {
        updateFile(index, { progress: 10 + Math.round(pct * 0.7) });
      });
      updateFile(index, { progress: 85 });

      // Step 3: Register attachment
      const attachment = await registerAttachment({
        key,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || "application/octet-stream",
      });

      updateFile(index, {
        status: "done",
        progress: 100,
        attachmentId: attachment.id,
      });
    } catch (err) {
      updateFile(index, {
        status: "error",
        errorMessage: err instanceof Error ? err.message : "Upload failed",
      });
    }
  };

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const newEntries: UploadedFileEntry[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      newEntries.push({
        file,
        name: file.name,
        size: file.size,
        progress: 0,
        status: "idle",
      });
    }

    setFiles((prev) => {
      const startIndex = prev.length;
      newEntries.forEach((entry, i) => {
        uploadSingleFile(entry.file, startIndex + i);
      });
      return [...prev, ...newEntries];
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getAttachmentIds = (): string[] => {
    return files
      .filter((f) => f.status === "done" && f.attachmentId)
      .map((f) => f.attachmentId!);
  };

  return { files, addFiles, removeFile, getAttachmentIds };
}
