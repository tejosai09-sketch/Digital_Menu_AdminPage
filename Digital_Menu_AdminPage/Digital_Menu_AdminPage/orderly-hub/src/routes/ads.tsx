import { createFileRoute } from "@tanstack/react-router";
import Ads from "../pages/Ads/Ads";

export const Route = createFileRoute("/ads")({
  component: Ads,
});