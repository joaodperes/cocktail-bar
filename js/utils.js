// js/utils.js

const AVAILABLE_KEY = "available_ingredients";

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

async function loadCocktails() {
  const res = await fetch("/cocktails.json");
  if (!res.ok) throw new Error("Failed to load cocktails.json");
  return res.json();
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
