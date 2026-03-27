const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const hash = event.headers["x-password-hash"];
  if (!hash || hash !== process.env.BO_PASSWORD_HASH) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  try {
    const body = JSON.parse(event.body);

    // "__verify__" is sent only to test the password — don't overwrite data
    if (body === "__verify__") {
      return { statusCode: 200, body: "OK" };
    }

    const store = getStore("bar-config");
    // Store as a JSON string; get-availability reads it back with { type: "json" }
    await store.setJSON("availability", body);
    return { statusCode: 200, body: "OK" };
  } catch (err) {
    // Log the real error to Netlify function logs for debugging
    console.error("set-availability error:", err);
    return { statusCode: 500, body: err.message || "Error saving" };
  }
};
