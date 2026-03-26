export type PrivacyBadgeProps = {
  className?: string;
};

export function PrivacyBadge({ className }: PrivacyBadgeProps) {
  return (
    <div
      className={
        "rounded-full border border-[#b8ddc9] bg-[#e8f5ee] px-4 py-2 " +
        (className ?? "")
      }
      role="note"
      aria-label="Privacy"
    >
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#2a7a5e]">
        <span>🔒</span>
        <span>Files never leave your device</span>
        <span className="text-[#2a7a5e]/75">No upload, fully browser-based processing.</span>
      </div>
    </div>
  );
}
