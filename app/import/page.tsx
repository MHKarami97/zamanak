"use client";

import { ImportPage } from "@/components/pages/import/import-page";
import { usezamaanakContext } from "@/components/zamaanak-shell";

export default function ImportRoute() {
  const controller = usezamaanakContext();
  if (!controller.ready) return null;
  return <ImportPage data={controller.data} commitImport={controller.commitImport} />;
}
