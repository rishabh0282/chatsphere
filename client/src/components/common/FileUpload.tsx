import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { PaperClipIcon, XMarkIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

interface FileUploadProps {
  onFileUploaded: (url: string) => void;
  maxSize?: number; // in bytes
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUploaded,
  maxSize = 10 * 1024 * 1024, // 10MB default
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > maxSize) {
        alert(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
        return;
      }

      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(percentCompleted);
          },
        });
        onFileUploaded(response.data.url);
        setUploadProgress(0);
      } catch (error) {
        console.error('Upload failed:', error);
        alert('File upload failed');
      } finally {
        setUploading(false);
      }
    },
    [maxSize, onFileUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize,
  });

  return (
    <div className="relative">
      <button
        type="button"
        {...getRootProps()}
        className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        disabled={uploading}
      >
        <input {...getInputProps()} />
        <PaperClipIcon className="h-5 w-5" />
      </button>
      {uploading && (
        <div className="absolute bottom-full left-0 mb-2 bg-white border rounded-lg shadow-lg p-2 min-w-[200px]">
          <div className="text-sm text-gray-700 mb-1">Uploading...</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

