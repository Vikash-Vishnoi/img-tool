"use client";

import dynamic from "next/dynamic";
import type { ReactElement } from "react";
import type { AppDropdownProps } from "@/components/AppDropdown";

type GenericDropdown = <T extends string>(props: AppDropdownProps<T>) => ReactElement | null;

const DynamicAppDropdown = dynamic(
  () => import("@/components/AppDropdown").then((mod) => mod.AppDropdown as unknown as GenericDropdown),
  { ssr: false }
) as unknown as GenericDropdown;

export function LazyAppDropdown<T extends string>(props: AppDropdownProps<T>) {
  return <DynamicAppDropdown {...props} />;
}
