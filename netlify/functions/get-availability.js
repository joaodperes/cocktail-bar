import { getStore } from "@netlify/blobs";

export default async () => {
  try {
    const store = getStore("bar-config");
    const data = await store.get("availability", { type: "json" });
    return Response.json(data ?? null);
  } catch (err) {
    console.error("get-availability error:", err);
    return Response.json(null);
  }
};

export const config = { path: "/.netlify/functions/get-availability" };
