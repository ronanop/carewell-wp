import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { presentationTool } from "sanity/presentation";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./schemaTypes/structure";

const projectId = process.env.SANITY_PROJECT_ID || "ndeeiwkw";
const dataset = process.env.SANITY_DATASET || "production";
const previewOrigin =
  process.env.SANITY_STUDIO_PREVIEW_ORIGIN || "http://localhost:3000";

export default defineConfig({
  name: "carewell",
  title: "Care Well Medical Centre",
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        origin: previewOrigin,
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
