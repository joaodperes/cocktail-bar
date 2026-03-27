import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const hash = req.headers.get("x-password-hash");
  if (!hash || hash !== process.env.BO_PASSWORD_HASH) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();

    if (body === "__verify__") {
      return new Response("OK", { status: 200 });
    }

    const store = getStore("bar-config");
    await store.setJSON("availability", body);
    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("set-availability error:", err);
    return new Response(err.message || "Error saving", { status: 500 });
  }
};

export const config = { path: "/.netlify/functions/set-availability" };
