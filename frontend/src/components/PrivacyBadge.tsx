export type PrivacyBadgeProps = {
  className?: string;
};

export function PrivacyBadge({ className }: PrivacyBadgeProps) {
  return (
    <div
      className={
        "rounded-2xl border border-foreground/10 bg-background p-4 " +
        (className ?? "")
      }
      role="note"
      aria-label="Privacy"
    >
      <div className="text-sm font-semibold">Files never leave your device</div>
      <div className="mt-1 text-xs leading-5 text-foreground/70">
        This tool runs in your browser. Your images are not uploaded to any server.
      </div>
    </div>
  );
}
