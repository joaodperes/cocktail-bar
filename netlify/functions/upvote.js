import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const { cocktailId } = body || {};
  if (!cocktailId || typeof cocktailId !== "string") {
    return new Response("Missing cocktailId", { status: 400 });
  }

  try {
    const store = getStore("bar-config");
    const votes = (await store.get("votes", { type: "json" })) || {};
    votes[cocktailId] = (votes[cocktailId] || 0) + 1;
    await store.setJSON("votes", votes);
    return Response.json({ count: votes[cocktailId] });
  } catch (err) {
    console.error("upvote error:", err);
    return new Response(err.message || "Error saving", { status: 500 });
  }
};

export const config = { path: "/.netlify/functions/upvote" };