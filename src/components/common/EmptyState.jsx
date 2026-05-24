function EmptyState({ title, message }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-3xl">
        📭
      </div>

      <h3 className="text-lg font-bold text-gray-800">{title}</h3>

      <p className="mt-2 max-w-md text-sm text-gray-400">{message}</p>
    </div>
  );
}

export default EmptyState;