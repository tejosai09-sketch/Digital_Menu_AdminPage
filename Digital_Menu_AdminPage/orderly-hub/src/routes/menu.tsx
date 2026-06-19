import { createFileRoute } from "@tanstack/react-router";
import MenuManagement from "../pages/MenuManagement/MenuManagement";

export const Route = createFileRoute("/menu")({
  head: () => ({ meta: [{ title: "Menu Management | SpiceRoute Admin" }] }),
  component: MenuManagement,
});
