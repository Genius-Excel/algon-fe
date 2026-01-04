import { useState } from 'react';
import { toast } from 'sonner';
import { validateFile } from '../utils/validation';

interface UseFileUploadOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
  onUpload?: (file: File) => void;
}

interface FileUploadState {
  file: File | null;
  preview: string | null;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const {
    maxSizeMB = 5,
    allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'],
    onUpload
  } = options;

  const [fileState, setFileState] = useState<FileUploadState>({
    file: null,
    preview: null
  });

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateFile(file, maxSizeMB, allowedTypes);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    // Set file
    setFileState(prev => ({ ...prev, file }));

    // Handle PDF vs Image preview
    if (file.type === 'application/pdf') {
      setFileState(prev => ({ ...prev, preview: 'pdf' }));
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileState(prev => ({
          ...prev,
          preview: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }

    // Call optional callback
    if (onUpload) {
      onUpload(file);
    }
  };

  const remove = (inputId?: string) => {
    setFileState({ file: null, preview: null });
    
    // Reset file input if ID provided
    if (inputId) {
      const input = document.getElementById(inputId) as HTMLInputElement;
      if (input) input.value = '';
    }
  };

  return {
    file: fileState.file,
    preview: fileState.preview,
    handleUpload,
    remove,
    hasFile: !!fileState.file
  };
}