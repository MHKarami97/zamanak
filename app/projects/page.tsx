"use client";

import { ProjectsPage } from "@/components/pages/projects/projects-page";
import { useZamaanakContext } from "@/components/zamaanak-shell";

export default function ProjectsRoute() {
  const controller = useZamaanakContext();
  if (!controller.ready) return null;

  return (
    <ProjectsPage
      data={controller.data}
      setData={controller.setData}
      selectedProject={controller.selectedProject}
      setSelectedProjectId={controller.setSelectedProjectId}
      showForm={controller.showProjectForm}
      setShowForm={controller.setShowProjectForm}
      draft={controller.projectDraft}
      setDraft={controller.setProjectDraft}
      addProject={controller.addProject}
      createClient={controller.createClient}
      activeEntry={controller.activeEntry}
      toggleProjectTimer={controller.toggleProjectTimer}
      financialsHidden={controller.financialsHidden}
    />
  );
}
