"use client";
import { InvoicesPage } from "@/components/pages/invoices/invoices-page";
import { usezamaanakContext } from "@/components/zamaanak-shell";
export default function InvoicesRoute() {
  const controller = usezamaanakContext();
  if (!controller.ready) return null;
  return (
    <InvoicesPage
      data={controller.data}
      setData={controller.setData}
      financialsHidden={controller.financialsHidden}
      createClient={controller.createClient}
      createProject={controller.createProject}
    />
  );
}
