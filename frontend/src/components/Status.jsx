export function LoadingState({ label }) {
  return <div className="culture-panel rounded-lg p-6 text-sm text-muted-culture">{label}</div>;
}

export function ErrorState({ message }) {
  return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{message}</div>;
}

export function EmptyState({ message }) {
  return <div className="culture-panel rounded-lg p-6 text-center text-sm text-muted-culture">{message}</div>;
}
