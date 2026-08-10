"use client";

import { ImportPage } from "@/components/pages/import/import-page";
import { useZamaanakContext } from "@/components/zamaanak-shell";

export default function ImportRoute() {
  const controller = useZamaanakContext();
  if (!controller.ready) return null;
  return <ImportPage data={controller.data} commitImport={controller.commitImport} />;
}
