import { createFileRoute } from "@tanstack/react-router";
import TodayOrders from "../pages/TodayOrders/TodayOrders";

export const Route = createFileRoute("/today-orders")({
  head: () => ({ meta: [{ title: "Today's Orders | SpiceRoute Admin" }] }),
  component: TodayOrders,
});
