interface LoadingSkeletonProps {
  label?: string;
}

export default function LoadingSkeleton({
  label = "Loading earthquake information",
}: LoadingSkeletonProps) {
  return (
    <div
      className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-6 sm:py-10"
      role="status"
      aria-busy="true"
      aria-label={label}
    >
      <div className="mb-6 h-9 w-64 animate-pulse rounded bg-border" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-lg border border-border bg-bg-subtle"
            />
          ))}
        </div>
        <div className="h-[360px] animate-pulse rounded-lg border border-border bg-bg-subtle lg:col-span-3" />
      </div>
    </div>
  );
}
