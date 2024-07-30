export const ErrorMessage = ({ error }: { error: boolean | string }) => {
  return (
    <div className="flex items-center justify-center gap-2 rounded-full bg-red-600 p-2 leading-none text-red-50">
      Error! {typeof error === 'string' ? error : null}
    </div>
  );
};
