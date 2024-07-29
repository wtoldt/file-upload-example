import * as React from 'react';
import axios, { AxiosError } from 'axios';
import {
  UploadOutlined,
  SyncOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';

const App = () => {
  const [file, setFile] = React.useState<File>();
  const [isDragging, setIsDragging] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<boolean | string>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSuccess(false);
    setError(false);
    if (!event.target.files) return;
    setFile(event.target.files[0]);
  };

  const handleDragOver = (event: React.DragEvent<HTMLElement>) => {
    // we must handle the dragOver event and prevent default for the onDrop event to work
    // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop#prevent_the_browsers_default_drag_behavior
    event.preventDefault();
  };
  const handleDragEnter = (event: React.DragEvent<HTMLElement>) => {
    // only enable dragging if the event comes from a drag area
    if (
      (event.target as HTMLElement).attributes.getNamedItem('data-drag-role')
        ?.value === 'drag-area'
    ) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLElement>) => {
    // only disable dragging if the event comes from a drag overlay
    if (
      (event.target as HTMLElement).attributes.getNamedItem('data-drag-role')
        ?.value === 'drag-overlay'
    ) {
      setIsDragging(false);
    }
  };
  const handleDragDrop = (event: React.DragEvent<HTMLElement>) => {
    // default drop action is to open the file in the browser, let's prevent that
    event.preventDefault();
    setIsDragging(false);
    setFile(event.dataTransfer.files[0]);
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
      className="flex h-screen w-full flex-col items-center justify-center bg-blue-200"
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDragDrop}
      data-drag-role="drag-area"
    >
      {isDragging && (
        <div
          className="fixed inset-0 z-10 flex h-screen w-full items-center justify-center p-8"
          data-drag-role="drag-overlay"
        >
          <div className="flex h-full w-full items-center justify-center rounded-lg border-8 border-dashed border-blue-300 bg-white/30 backdrop-blur-md">
            <div className="flex items-center justify-center gap-2 text-blue-600 ">
              <ArrowDownOutlined className="animate-bounce rounded-full border-4 border-blue-600 bg-white/50 p-1 text-2xl" />
              <h1 className="text-3xl font-bold">Drop file here</h1>
            </div>
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex w-min flex-col items-center gap-2 rounded-lg border-4 border-dashed border-blue-300 p-4"
      >
        <input type="file" disabled={isLoading} onChange={handleFileChange} />
        <button
          type="submit"
          disabled={!file || isLoading}
          className="flex w-min items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-bold text-blue-50 enabled:hover:bg-blue-700 enabled:active:bg-blue-700 enabled:active:ring-2 enabled:active:ring-blue-600 enabled:active:ring-offset-1 disabled:opacity-50"
        >
          <UploadOutlined />
          Upload
        </button>
        {file && <p>{file.name}</p>}
      </form>
      {isLoading && (
        <p>
          <SyncOutlined spin />
          Loading...
        </p>
      )}
      {success && <p>Success!</p>}
      {error && <p>Error! {typeof error === 'string' ? error : ''}</p>}
    </main>
  );
};

export default App;
