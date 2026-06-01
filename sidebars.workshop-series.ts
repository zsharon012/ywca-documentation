import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const workshopSidebar: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: "doc",
      id: "intro",
      label: "Introduction",
    },
    {
      type: "doc",
      id: "installation",
      label: "Installation",
    },
    {
      type: "doc",
      id: "quick-start",
      label: "Quick Start",
    },
    {
      type: "doc",
      id: "project-structure",
      label: "Project Structure",
    },
    {
      type: "doc",
      id: "contributing",
      label: "Contributing",
    },
    {
      type: "category",
      label: "Frontend",
      items: [
        {
          type: "doc",
          id: "frontend-project-structure",
          label: "Project Structure",
        },
        {
          type: "doc",
          id: "frontend-development",
          label: "Development Guide",
        },
        {
          type: "doc",
          id: "frontend-deployment",
          label: "Deployment",
        },
      ],
    },
    {
      type: "category",
      label: "Backend",
      items: [
        {
        type: "doc",
        id: "apiroutes",
        label: "API routes",
        },
        {
          type: "doc",
          id: "databaseschema",
          label: "Database Schema"
        }
      ]
    }
  ],
};

export default workshopSidebar;
