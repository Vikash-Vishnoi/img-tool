import type { ButtonHTMLAttributes } from "react";

type RemoveButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  compact?: boolean;
};

export function RemoveButton({ compact = false, className = "", children, ...props }: RemoveButtonProps) {
  const baseClass = compact
    ? "rounded-lg border border-[#f2b8b5] bg-[#fff5f5] px-2 py-1 text-xs font-medium text-[#b42318] transition hover:border-[#e48a86] hover:bg-[#ffe9e8] hover:text-[#912018] disabled:opacity-40"
    : "rounded-full border border-[#f2b8b5] bg-[#fff5f5] px-3 py-1 text-xs font-medium text-[#b42318] transition hover:border-[#e48a86] hover:bg-[#ffe9e8] hover:text-[#912018] disabled:opacity-40";

  return (
    <button type="button" className={`${baseClass} ${className}`.trim()} {...props}>
      {children ?? "Remove"}
    </button>
  );
}
