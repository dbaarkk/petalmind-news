export default function Skeleton() {
  return (
    <div className="flex animate-pulse items-start gap-4 border-b py-6">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-4 w-12 rounded bg-gray-200"></div>
          <div className="h-4 w-24 rounded bg-gray-200"></div>
        </div>
        <div className="h-6 w-full rounded bg-gray-200"></div>
        <div className="h-6 w-3/4 rounded bg-gray-200"></div>
      </div>
      <div className="h-24 w-24 rounded-xl bg-gray-200"></div>
    </div>
  );
}
