// build.js
import fs from "fs";

fs.mkdirSync("dist", { recursive: true });

const replacements = {
  "%%WEB3FORMS_KEY%%": process.env.WEB3FORMS_KEY || "",
  // BO_PASSWORD_HASH removed — now server-side only
};

["cocktail.html", "backoffice.html", "index.html"].forEach(file => {
  let content = fs.readFileSync(file, "utf8");
  Object.entries(replacements).forEach(([token, value]) => {
    content = content.replaceAll(token, value);
  });
  fs.writeFileSync(`dist/${file}`, content);
});

["css", "js", "images", "cocktails.json"].forEach(item => {
  fs.cpSync(item, `dist/${item}`, { recursive: true });
});

console.log("Build complete.");
