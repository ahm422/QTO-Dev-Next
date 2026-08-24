"use client";

// `ssr: false` is only allowed inside a Client Component — this thin wrapper lets
// the (server) dashboard layout mount the widget without SSR-ing it itself.
import nextDynamic from "next/dynamic";

const AdminChatWidget = nextDynamic(
  () => import("./AdminChatWidget").then((m) => m.AdminChatWidget),
  { ssr: false }
);

export default AdminChatWidget;
