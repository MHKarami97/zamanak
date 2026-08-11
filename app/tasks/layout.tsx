import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسک‌های روزانه | زمانک",
  description: "ثبت سریع یا زمان‌بندی‌شده تسک‌های هر روز، با نمای ماهانه و گزارش‌ها.",
};

export default function RouteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
