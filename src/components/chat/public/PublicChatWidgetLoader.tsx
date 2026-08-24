"use client";

// `ssr: false` is only allowed inside a Client Component — this thin wrapper lets
// the (server) route-group layout mount the widget without SSR-ing it itself.
import nextDynamic from "next/dynamic";

const PublicChatWidget = nextDynamic(
  () => import("./PublicChatWidget").then((m) => m.PublicChatWidget),
  { ssr: false }
);

export default PublicChatWidget;
