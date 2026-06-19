import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "../pages/Dashboard/Dashboard";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard | SpiceRoute Admin" }] }),
  component: Dashboard,
});
