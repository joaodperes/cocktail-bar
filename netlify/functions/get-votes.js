import { getStore } from "@netlify/blobs";

export default async () => {
  try {
    const store = getStore("bar-config");
    const data = await store.get("votes", { type: "json" });
    return Response.json(data ?? {});
  } catch (err) {
    console.error("get-votes error:", err);
    return Response.json({});
  }
};

export const config = { path: "/.netlify/functions/get-votes" };