export const SuccessMessage = ({ payload }: { payload: boolean | string }) => {
  return (
    <div className="mx-2 flex flex-col items-center justify-center gap-2 rounded-md bg-green-600 p-2 leading-none text-green-50">
      Success!
      {payload && (
        <pre className="whitespace-pre-wrap border border-dashed border-green-500 bg-green-200 p-1 font-mono text-green-800">
          {JSON.stringify(payload, null, 2)}
        </pre>
      )}
    </div>
  );
};
