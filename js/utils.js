// js/utils.js

const AVAILABLE_KEY = "available_ingredients";
const MENU_KEY = "menu_type"; // "cocktail" | "coffee"

async function getAvailableIngredients() {
  try {
    const res = await fetch("/.netlify/functions/get-availability");
    const data = await res.json();
    return data; // null means never set; array means set
  } catch {
    return null;
  }
}

async function setAvailableIngredients(set, passwordHash) {
  try {
    const res = await fetch("/.netlify/functions/set-availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-password-hash": passwordHash
      },
      body: JSON.stringify([...set])
    });
    return res.status;
  } catch {
    return 500;
  }
}

function cocktailIsAvailable(cocktail, availableSet) {
  if (availableSet === null) return true; // backoffice never opened: show all
  return cocktail.ingredients.every(ing => {
    const name = ing.name.en.toLowerCase();
    return availableSet.has(name);
  });
}

function getAllUniqueIngredients(cocktails) {
  const map = new Map(); // en key -> {en, pt}
  cocktails.forEach(c => {
    c.ingredients.forEach(ing => {
      const key = ing.name.en.toLowerCase();
      if (!map.has(key)) map.set(key, ing.name);
    });
  });
  return map;
}

// ── Menu type (cocktails vs coffee) ──────────────────────
// A single ingredient-availability pool is shared across both menus; this
// just controls which JSON file / gallery is shown.

function menuDataFile(menu) {
  return menu === "coffee" ? "/coffees.json" : "/cocktails.json";
}

function getMenuType() {
  const params = new URLSearchParams(location.search);
  const fromUrl = params.get("menu");
  if (fromUrl === "coffee" || fromUrl === "cocktail") {
    localStorage.setItem(MENU_KEY, fromUrl);
    return fromUrl;
  }
  return localStorage.getItem(MENU_KEY) === "coffee" ? "coffee" : "cocktail";
}

function setMenuType(menu) {
  localStorage.setItem(MENU_KEY, menu === "coffee" ? "coffee" : "cocktail");
}

async function loadMenu(menu) {
  const res = await fetch(menuDataFile(menu));
  if (!res.ok) throw new Error("Failed to load " + menuDataFile(menu));
  return res.json();
}

// Back-compat default: loads the cocktails list.
async function loadCocktails() {
  return loadMenu("cocktail");
}

// Loads both menus combined, tagging each item with its menu type — used by
// the backoffice, which manages one shared ingredient pool for everything.
async function loadAllDrinks() {
  const [cocktails, coffees] = await Promise.all([
    loadMenu("cocktail").catch(() => []),
    loadMenu("coffee").catch(() => [])
  ]);
  return [
    ...cocktails.map(c => ({ ...c, _type: "cocktail" })),
    ...coffees.map(c => ({ ...c, _type: "coffee" }))
  ];
}

// Renders/updates a menu-toggle button (mirrors initLangToggle). Clicking it
// flips between the cocktail and coffee menus. From the detail page it sends
// the guest back to that menu's gallery, since a cocktail id has no meaning
// on the coffee menu and vice versa.
function initMenuToggle(buttonId) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  function render() {
    const current = getMenuType();
    btn.textContent = current === "coffee" ? t("menu_toggle_to_cocktails") : t("menu_toggle_to_coffee");
  }
  render();

  btn.addEventListener("click", () => {
    const next = getMenuType() === "coffee" ? "cocktail" : "coffee";
    setMenuType(next);

    const url = new URL(location.href);
    url.searchParams.set("menu", next);

    if (/cocktail\.html$/.test(url.pathname)) {
      url.pathname = url.pathname.replace(/cocktail\.html$/, "index.html");
      url.searchParams.delete("id");
    }

    location.href = url.toString();
  });
}

function initLangToggle(buttonId) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;
  btn.textContent = t("lang_toggle");
  btn.addEventListener("click", () => {
    const newLang = getLang() === "en" ? "pt" : "en";
    setLang(newLang);
    window.location.reload();
  });
}

async function getVotes() {
  try {
    const res = await fetch("/.netlify/functions/get-votes");
    return await res.json();
  } catch {
    return {};
  }
}

async function upvoteCocktail(cocktailId) {
  try {
    const res = await fetch("/.netlify/functions/upvote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cocktailId })
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.count;
  } catch {
    return null;
  }
}

function hasVoted(cocktailId) {
  try {
    const voted = JSON.parse(localStorage.getItem("voted_cocktails") || "[]");
    return voted.includes(cocktailId);
  } catch { return false; }
}

function markVoted(cocktailId) {
  try {
    const voted = JSON.parse(localStorage.getItem("voted_cocktails") || "[]");
    if (!voted.includes(cocktailId)) {
      voted.push(cocktailId);
      localStorage.setItem("voted_cocktails", JSON.stringify(voted));
    }
  } catch {}
}
