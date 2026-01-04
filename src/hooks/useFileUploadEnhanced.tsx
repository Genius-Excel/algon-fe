import { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { toast } from 'sonner';

interface FileUploadOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
  compressImages?: boolean;
  compressionMaxSizeMB?: number;
  compressionMaxWidthOrHeight?: number;
  onUpload?: (file: File) => void;
  onError?: (error: string) => void;
}

interface UploadState {
  file: File | null;
  preview: string | null;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
}

export function useFileUploadEnhanced(options: FileUploadOptions = {}) {
  const {
    maxSizeMB = 5,
    allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'],
    compressImages = true,
    compressionMaxSizeMB = 1,
    compressionMaxWidthOrHeight = 1920,
    onUpload,
    onError,
  } = options;

  const [state, setState] = useState<UploadState>({
    file: null,
    preview: null,
    isUploading: false,
    uploadProgress: 0,
    error: null,
  });

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      const allowedExtensions = allowedTypes
        .map(type => type.split('/')[1].toUpperCase())
        .join(', ');
      return {
        valid: false,
        error: `Invalid file type. Allowed: ${allowedExtensions}`,
      };
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      return {
        valid: false,
        error: `File too large. Maximum size: ${maxSizeMB}MB`,
      };
    }

    return { valid: true };
  };

  const compressImage = async (file: File): Promise<File> => {
    try {
      const options = {
        maxSizeMB: compressionMaxSizeMB,
        maxWidthOrHeight: compressionMaxWidthOrHeight,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      
      // Show compression results
      const originalSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const compressedSizeMB = (compressedFile.size / (1024 * 1024)).toFixed(2);
      
      console.log(
        `Image compressed: ${originalSizeMB}MB → ${compressedSizeMB}MB`
      );

      return compressedFile;
    } catch (error) {
      console.error('Image compression failed:', error);
      return file; // Return original if compression fails
    }
  };

  const generatePreview = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.type === 'application/pdf') {
        resolve('pdf');
      } else if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      } else {
        resolve('file');
      }
    });
  }, []);

  const handleUpload = useCallback(
    async (file: File) => {
      setState(prev => ({ ...prev, isUploading: true, error: null }));

      try {
        // Validate file
        const validation = validateFile(file);
        if (!validation.valid) {
          const error = validation.error || 'Invalid file';
          setState(prev => ({ ...prev, error, isUploading: false }));
          toast.error(error);
          onError?.(error);
          return;
        }

        let processedFile = file;

        // Compress images if enabled
        if (
          compressImages &&
          file.type.startsWith('image/') &&
          file.type !== 'image/gif'
        ) {
          setState(prev => ({ ...prev, uploadProgress: 30 }));
          processedFile = await compressImage(file);
        }

        setState(prev => ({ ...prev, uploadProgress: 60 }));

        // Generate preview
        const preview = await generatePreview(processedFile);

        setState(prev => ({ ...prev, uploadProgress: 90 }));

        // Update state
        setState({
          file: processedFile,
          preview,
          isUploading: false,
          uploadProgress: 100,
          error: null,
        });

        // Call callback
        onUpload?.(processedFile);

        toast.success('File uploaded successfully');
      } catch (error: any) {
        const errorMessage = error.message || 'Failed to upload file';
        setState({
          file: null,
          preview: null,
          isUploading: false,
          uploadProgress: 0,
          error: errorMessage,
        });
        toast.error(errorMessage);
        onError?.(errorMessage);
      }
    },
    [
      maxSizeMB,
      allowedTypes,
      compressImages,
      compressionMaxSizeMB,
      compressionMaxWidthOrHeight,
      onUpload,
      onError,
      generatePreview,
    ]
  );

  const remove = useCallback((inputId?: string) => {
    setState({
      file: null,
      preview: null,
      isUploading: false,
      uploadProgress: 0,
      error: null,
    });

    if (inputId) {
      const input = document.getElementById(inputId) as HTMLInputElement;
      if (input) input.value = '';
    }
  }, []);

  return {
    file: state.file,
    preview: state.preview,
    isUploading: state.isUploading,
    uploadProgress: state.uploadProgress,
    error: state.error,
    handleUpload,
    remove,
  };
}