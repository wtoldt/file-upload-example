import * as React from 'react';
import axios, { AxiosError } from 'axios';
import {
  UploadOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  FileAddOutlined,
} from '@ant-design/icons';

import DragOverlay from '@/components/DragOverlay';

const App = () => {
  const [file, setFile] = React.useState<File>();
  const [isDragging, setIsDragging] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<boolean | string>(false);
  const dropZoneRef = React.useRef<HTMLElement>(null);
  const dragTargetsRef = React.useRef<Node[]>([]);

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
    console.debug(
      `drag enter ${(event.target as HTMLElement).attributes.getNamedItem(
        'data-name',
      )?.value}`,
    );
    // When a child element of the dropzone (or the dropzone itself) emit a dragenter event,
    //  push the target element into the array to keep track of it
    dragTargetsRef.current = [...dragTargetsRef.current, event.target as Node];
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLElement>) => {
    console.debug(
      `drag leave ${(event.target as HTMLElement).attributes.getNamedItem(
        'data-name',
      )?.value}`,
    );
    // When a child element of the dropzone (or the dropzone itself) emits a dragleave event,
    //  remove the target element from the array.
    // This works because when dragging from one element to another, the dragEnter event seems
    //  to fire before the dragLeave event.
    //  Ex: dragging into the dropzone and then the overlay appears would look like this:
    //    enter dropZone, enter dragOverlay, leave dropZone
    const targets = [...dragTargetsRef.current];
    const targetIndex = targets.indexOf(event.target as Node);
    if (targetIndex > -1) {
      targets.splice(targetIndex, 1);
    }
    dragTargetsRef.current = targets;
    // If the array is empty, the dropzone is not dragging anymore
    if (targets.length === 0) {
      setIsDragging(false);
    }
  };
  const handleDragDrop = (event: React.DragEvent<HTMLElement>) => {
    // default drop action is to open the file in the browser, let's prevent that
    event.preventDefault();
    setIsDragging(false);
    // since dragging is done, we can clear the array
    dragTargetsRef.current = [];
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
      onSubmit={handleSubmit}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDragDrop}
      ref={dropZoneRef}
      data-name="dropZone"
      className="flex h-screen w-full flex-col items-center justify-center bg-blue-200"
    >
      {isDragging && (
        <DragOverlay />
      )}
      <form className="relative flex flex-col items-center justify-center gap-2 rounded-lg border-4 border-dashed border-blue-300 p-4">
        {file ? (
          <div className="flex items-center justify-center gap-2 rounded-full bg-blue-600 p-2 leading-none text-blue-50">
            {file.name}
            <CloseCircleOutlined onClick={() => setFile(undefined)} />
          </div>
        ) : (
          <label className="flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-blue-600 px-4 py-2 font-bold text-blue-50">
            <FileAddOutlined />
            Select File
            <input
              type="file"
              disabled={isLoading}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
        <button
          type="submit"
          disabled={!file || isLoading}
          className="flex w-min items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-bold text-blue-50 enabled:hover:bg-blue-700 enabled:active:bg-blue-700 enabled:active:ring-2 enabled:active:ring-blue-600 enabled:active:ring-offset-1 disabled:opacity-50"
        >
          <UploadOutlined />
          Upload
        </button>
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
