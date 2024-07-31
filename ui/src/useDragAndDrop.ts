import * as React from 'react';

export const useDragAndDrop = ({
  setFile,
}: {
  setFile: (file: File) => void;
}) => {
  const dropZoneRef = React.useRef<HTMLElement>(null);
  const dragTargetsRef = React.useRef<Node[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);

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

  const getDropZoneProps = () => {
    return {
      onDragOver: handleDragOver,
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDrop: handleDragDrop,
      ref: dropZoneRef,
      'data-name': 'dropZone',
    };
  };

  return {
    getDropZoneProps,
    isDragging,
  };
};
