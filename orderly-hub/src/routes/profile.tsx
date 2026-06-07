import { createFileRoute } from "@tanstack/react-router";
import Profile from "../pages/Profile/Profile";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Admin Profile | SpiceRoute Admin" }] }),
  component: Profile,
});
