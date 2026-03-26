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
    // event.body is already a valid JSON string — store it directly
    await store.set("availability", event.body);
    return { statusCode: 200, body: "OK" };
  } catch {
    return { statusCode: 500, body: "Error saving" };
  }
};