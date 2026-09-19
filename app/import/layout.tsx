import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "واردسازی داده‌ها",
  description: "واردسازی امن فایل پشتیبان و CSV در زمانک با Preview و مدیریت تعارض‌ها.",
  robots: { index: true, follow: true },
};

export default function ImportLayout({ children }: { children: ReactNode }) {
  return children;
}
