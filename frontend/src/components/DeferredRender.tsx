import type { ReactNode } from "react";

export type DeferredRenderProps = {
  children: ReactNode;
};

export function DeferredRender({ children }: DeferredRenderProps) {
  return <div className="deferred-content">{children}</div>;
}
