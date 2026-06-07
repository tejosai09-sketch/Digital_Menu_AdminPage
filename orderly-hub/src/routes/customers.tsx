import { createFileRoute } from "@tanstack/react-router";
import Customers from "../pages/Customers/Customers";

export const Route = createFileRoute("/customers")({
  head: () => ({ meta: [{ title: "Customers | SpiceRoute Admin" }] }),
  component: Customers,
});
