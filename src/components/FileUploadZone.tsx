import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, FileText, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  preview: string | null;
  fileName?: string;
  fileSize?: number;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string | null;
  onRemove: () => void;
  accept?: Record<string, string[]>;
  maxSizeMB?: number;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function FileUploadZone({
  onFileSelect,
  preview,
  fileName,
  fileSize,
  isUploading = false,
  uploadProgress = 0,
  error = null,
  onRemove,
  accept = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'application/pdf': ['.pdf'],
  },
  maxSizeMB = 5,
  label = 'Upload File',
  description = 'Drag and drop or click to browse',
  disabled = false,
}: FileUploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize: maxSizeMB * 1024 * 1024,
    multiple: false,
    disabled: disabled || isUploading,
  });

  const getFileIcon = () => {
    if (!preview) return <Upload className="w-12 h-12 text-muted-foreground" />;
    
    if (preview === 'pdf') {
      return <FileText className="w-12 h-12 text-red-500" />;
    } else if (preview === 'file') {
      return <File className="w-12 h-12 text-blue-500" />;
    } else {
      return <ImageIcon className="w-12 h-12 text-green-500" />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(2)} MB`;
  };

  // Show preview if file uploaded
  if (preview && !isUploading) {
    return (
      <div className="border-2 border-border rounded-xl p-6 bg-secondary/10">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {preview !== 'pdf' && preview !== 'file' ? (
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-secondary/20 flex items-center justify-center">
                {getFileIcon()}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <p className="text-sm font-medium truncate">{fileName || 'File uploaded'}</p>
                </div>
                {fileSize && (
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(fileSize)}
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show upload progress
  if (isUploading) {
    return (
      <div className="border-2 border-primary rounded-xl p-6 bg-primary/5">
        <div className="flex items-center gap-4 mb-4">
          <div className="animate-spin">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium mb-2">Uploading...</p>
            <Progress value={uploadProgress} className="h-2" />
          </div>
          <p className="text-sm text-muted-foreground">{uploadProgress}%</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="border-2 border-red-200 rounded-xl p-6 bg-red-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-800 mb-2">{error}</p>
            <Button type="button" variant="outline" size="sm" onClick={onRemove}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show upload zone
  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center gap-3">
        {getFileIcon()}
        
        <div>
          <p className="font-medium mb-1">
            {isDragActive ? 'Drop file here' : label}
          </p>
          <p className="text-sm text-muted-foreground">{description}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Max size: {maxSizeMB}MB • Formats: JPG, PNG, PDF
          </p>
        </div>

        {!isDragActive && (
          <Button type="button" variant="outline" size="sm" className="mt-2">
            Browse Files
          </Button>
        )}
      </div>
    </div>
  );
}