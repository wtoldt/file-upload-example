import * as React from 'react';
import axios, { AxiosError } from 'axios';
import { UploadOutlined } from '@ant-design/icons';

import { useDragAndDrop } from '@/useDragAndDrop';
import {
  DragOverlay,
  FileInput,
  LoadingSpinner,
  SuccessMessage,
  ErrorMessage,
} from '@/components';

const App = () => {
  const [file, setFile] = React.useState<File>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<boolean | string>(false);
  const { getDropZoneProps, isDragging } = useDragAndDrop({ setFile });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSuccess(false);
    setError(false);
    if (!event.target.files) return;
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // default form submission action is to navigate to /upload, let's prevent that
    event.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setIsLoading(true);
    setSuccess(false);
    setError(false);
    try {
      const response = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(response.data);
      setIsLoading(false);
      setSuccess(true);
    } catch (error: unknown) {
      console.error(error);
      setIsLoading(false);
      if (error instanceof AxiosError) {
        setError(error.response?.data || true);
      } else {
        setError(true);
      }
    }
  };
  return (
    <main
      onSubmit={handleSubmit}
      {...getDropZoneProps()}
      className="flex h-screen w-full flex-col items-center justify-center bg-blue-200"
    >
      {isDragging && <DragOverlay />}
      <form className="relative mb-4 flex flex-col items-center justify-center gap-2 rounded-lg border-4 border-dashed border-blue-300 p-4">
        <FileInput
          file={file}
          removeFile={() => setFile(undefined)}
          handleFileChange={handleFileChange}
          isLoading={isLoading}
        />
        <button
          type="submit"
          disabled={!file || isLoading}
          className="flex w-min items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-bold text-blue-50 enabled:hover:bg-blue-700 enabled:active:bg-blue-700 enabled:active:ring-2 enabled:active:ring-blue-600 enabled:active:ring-offset-1 disabled:opacity-50"
        >
          <UploadOutlined />
          Upload
        </button>
      </form>
      {isLoading && <LoadingSpinner />}
      {success && <SuccessMessage />}
      {error && <ErrorMessage error={error} />}
    </main>
  );
};

export default App;
