export function SkeletonCard(): JSX.Element {
  return (
    <div className="min-h-[22rem] animate-pulse border border-border bg-surface/70">
      <div className="h-full min-h-[22rem] bg-gradient-to-br from-surface via-border to-surface" />
    </div>
  );
}
