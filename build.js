// build.js
const fs = require("fs");

// Create dist/ if it doesn't exist
fs.mkdirSync("dist", { recursive: true });

const replacements = {
  "%%WEB3FORMS_KEY%%": process.env.WEB3FORMS_KEY || "",
  "%%BO_PASSWORD_HASH%%": process.env.BO_PASSWORD_HASH || "",
};

["cocktail.html", "backoffice.html"].forEach(file => {
  let content = fs.readFileSync(file, "utf8");
  Object.entries(replacements).forEach(([token, value]) => {
    content = content.replaceAll(token, value);
  });
  fs.writeFileSync(`dist/${file}`, content);
});

["index.html", "css", "js", "images", "cocktails.json"].forEach(item => {
  fs.cpSync(item, `dist/${item}`, { recursive: true });
});

console.log("Build complete.");