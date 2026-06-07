import { createFileRoute } from "@tanstack/react-router";
import Orders from "../pages/Orders/Orders";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Orders | SpiceRoute Admin" }] }),
  component: Orders,
});
