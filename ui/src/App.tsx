import * as React from 'react';
import axios, { AxiosError } from 'axios';
import {UploadOutlined, SyncOutlined  } from '@ant-design/icons';

const App = () => {
  const [file, setFile] = React.useState<File>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<boolean | string>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSuccess(false);
    setError(false);
    if (!event.target.files) return;
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
    <main className="flex h-screen w-full flex-col items-center justify-center bg-blue-200">
      <form
        onSubmit={handleSubmit}
        className="flex w-min flex-col gap-2 rounded-lg border-4 border-dashed border-blue-300 p-4 items-center"
      >
        <input type="file" disabled={isLoading} onChange={handleFileChange} />
        <button
          type="submit"
          disabled={!file || isLoading}
          className="flex justify-center items-center gap-2 w-min rounded-md bg-blue-600 py-2 px-4 font-bold text-blue-50 enabled:hover:bg-blue-700 enabled:active:bg-blue-700 enabled:active:ring-2 enabled:active:ring-blue-600 enabled:active:ring-offset-1 disabled:opacity-50"
        >
          <UploadOutlined />
          Upload
        </button>
      </form>
      {isLoading && <p><SyncOutlined spin />Loading...</p>}
      {success && <p>Success!</p>}
      {error && <p>Error! {typeof error === 'string' ? error : ''}</p>}
    </main>
  );
};

export default App;
