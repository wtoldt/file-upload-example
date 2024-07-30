import * as React from 'react';

import { CloseCircleOutlined, FileAddOutlined } from '@ant-design/icons';

type FileInputProps = React.ComponentPropsWithoutRef<'div'> & {
  file: File | undefined;
  removeFile: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
};

export const FileInput = ({
  file,
  removeFile,
  handleFileChange,
  isLoading,
}: FileInputProps) => {
  if (file) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-full bg-blue-600 p-2 leading-none text-blue-50">
        {file.name}
        <CloseCircleOutlined onClick={removeFile} />
      </div>
    );
  } else {
    return (
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
    );
  }
};
