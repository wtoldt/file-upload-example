import { SyncOutlined } from '@ant-design/icons';

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <SyncOutlined spin />
      Loading...
    </div>
  );
};
