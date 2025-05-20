import React, { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onSuccess: (file: File) => void;
  currentUrl?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onSuccess, currentUrl }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    onSuccess(file);
  }, [onSuccess]);

  const handleRemove = useCallback(() => {
    onSuccess(new File([], ''));
  }, [onSuccess]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Photo
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {currentUrl ? (
          <div className="relative">
            <img
              src={currentUrl}
              alt="Uploaded"
              className="max-h-48 mx-auto rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="text-sm text-gray-600">
              <p>Drag and drop your image here, or</p>
              <p>click to select a file</p>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onSuccess(file);
                }
              }}
            />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;