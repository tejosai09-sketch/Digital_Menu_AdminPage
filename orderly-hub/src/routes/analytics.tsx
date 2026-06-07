import { createFileRoute } from "@tanstack/react-router";
import Analytics from "../pages/Analytics/Analytics";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics | SpiceRoute Admin" }] }),
  component: Analytics,
});
