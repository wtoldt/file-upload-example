import { ArrowDownOutlined } from '@ant-design/icons';
const DragOverlay = () => {
  return (
    <div
      className="fixed inset-0 z-10 flex h-screen w-full items-center justify-center p-8"
      data-name="dragOverlay"
    >
      <div
        className="flex h-full w-full items-center justify-center rounded-lg border-8 border-dashed border-blue-300 bg-white/30 backdrop-blur-md"
        data-name="dragOverlayContentContainer"
      >
        <div
          className="flex items-center justify-center gap-2 text-blue-600"
          data-name="dragOverlayContent"
        >
          <ArrowDownOutlined
            className="animate-bounce rounded-full border-4 border-blue-600 bg-white/50 p-1 text-2xl"
            data-name="dragOverlayIcon"
          />
          <h1 className="text-3xl font-bold" data-name="dragOverlayText">
            Drop file here
          </h1>
        </div>
      </div>
    </div>
  );
};

export default DragOverlay;
