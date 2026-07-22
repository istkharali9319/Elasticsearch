export default function TopProgressBar({ active }) {
  if (!active) return null;
  return <div className="top-progress" />;
}
