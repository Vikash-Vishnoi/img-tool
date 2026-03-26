"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export type AppDropdownOption<T extends string> = {
  value: T;
  label: string;
  helper?: string;
};

export type AppDropdownProps<T extends string> = {
  value: T;
  options: AppDropdownOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
  containerClassName?: string;
  buttonClassName?: string;
  menuClassName?: string;
  menuAlign?: "left" | "right";
  showCheckmark?: boolean;
  renderButtonContent?: (selected: AppDropdownOption<T>) => ReactNode;
  renderOptionContent?: (option: AppDropdownOption<T>, active: boolean) => ReactNode;
};

export function AppDropdown<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  containerClassName,
  buttonClassName,
  menuClassName,
  menuAlign = "left",
  showCheckmark = true,
  renderButtonContent,
  renderOptionContent,
}: AppDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(
    () => options.find((o) => o.value === value) ?? options[0],
    [options, value]
  );

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (rootRef.current.contains(event.target as Node)) return;
      setIsOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  if (!selected) return null;

  const buttonCls =
    buttonClassName ??
    "inline-flex w-full items-center justify-between gap-2 rounded-lg border border-[#d4cfc4] bg-white px-3 py-2 text-sm font-semibold text-[#1c1a14] shadow-[0_1px_0_rgba(0,0,0,0.02)] transition hover:border-[#e8672a]/55 focus:outline-none focus:ring-2 focus:ring-[#e8672a]/25";

  const menuPosition = menuAlign === "right" ? "right-0" : "left-0";
  const menuCls =
    menuClassName ??
    "z-30 min-w-[160px] overflow-hidden rounded-xl border border-[#d4cfc4] bg-white p-1.5 shadow-[0_12px_28px_rgba(28,26,20,0.14)]";

  return (
    <div className={containerClassName ?? "relative"} ref={rootRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={buttonCls}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {renderButtonContent ? renderButtonContent(selected) : <span>{selected.label}</span>}
        <svg
          className={"h-3 w-3 shrink-0 text-[#6b6760] transition-transform " + (isOpen ? "rotate-180" : "rotate-0")}
          viewBox="0 0 10 6"
          fill="none"
          aria-hidden="true"
        >
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen ? (
        <div
          className={`absolute ${menuPosition} top-[calc(100%+6px)] ${menuCls}`}
          role="listbox"
          aria-label={ariaLabel}
        >
          {options.map((option) => {
            const active = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition " +
                  (active
                    ? "bg-[#1c1a14] text-[#f7f3ec]"
                    : "text-[#1c1a14] hover:bg-[#f7f3ec]")
                }
              >
                {renderOptionContent ? renderOptionContent(option, active) : <span>{option.label}</span>}
                {showCheckmark && active ? <span className="text-xs">✓</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
