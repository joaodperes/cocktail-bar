const { getStore } = require("@netlify/blobs");

exports.handler = async () => {
  try {
    const store = getStore("bar-config");
    const data = await store.get("availability", { type: "json" });
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data ?? null)
    };
  } catch {
    return { statusCode: 200, body: "null" };
  }
};