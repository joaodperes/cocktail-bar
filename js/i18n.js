// js/i18n.js
const TRANSLATIONS = {
  en: {
    // Nav
    nav_home: "The Bar",
    nav_backoffice: "Staff",
    lang_toggle: "PT",

    // Gallery
    gallery_title: "Tonight's Menu",
    gallery_subtitle: "Choose your poison.",
    gallery_empty: "Nothing available right now — check back soon.",
    gallery_request: "Request this drink",

    // Detail page
    detail_ingredients: "Ingredients",
    detail_glass: "Serve in",
    detail_ice_yes: "Served with ice",
    detail_ice_no: "Served straight up",
    detail_your_name: "Your name",
    detail_name_placeholder: "What shall I call you?",
    detail_submit: "Send Request",
    detail_back: "← Back to menu",
    detail_success_title: "Request sent!",
    detail_success_msg: "I'll get that ready for you shortly.",
    detail_error: "Something went wrong. Please try again.",

    // Glass types
    glass_rocks: "Old Fashioned Glass",
    glass_martini: "Martini Glass",
    glass_flute: "Champagne Flute",
    glass_highball: "Highball Glass",
    glass_coupe: "Coupe Glass",
    glass_wine: "Wine Glass",
    glass_hurricane: "Hurricane Glass",
    glass_collins: "Collins Glass",

    // Backoffice
    bo_title: "Backoffice",
    bo_subtitle: "Manage ingredient availability",
    bo_password_label: "Password",
    bo_password_placeholder: "Enter password",
    bo_unlock: "Unlock",
    bo_wrong_password: "Incorrect password.",
    bo_ingredients_title: "Available Ingredients",
    bo_ingredients_desc: "Tick the ingredients you currently have in stock. Only cocktails with all available ingredients will be shown to guests.",
    bo_save: "Save Changes",
    bo_saved: "Saved!",
    bo_select_all: "Select all",
    bo_deselect_all: "Deselect all",
    bo_logout: "Lock",

    // Backoffice tabs
    bo_tab_ingredients: "Ingredients",
    bo_tab_missing:     "Missing cocktails",
    bo_tab_shopping:    "Shopping list",
    bo_ingredients_desc_short: "Tick the ingredients you currently have in stock.",
    bo_shopping_desc:   "Select the cocktails you want to prepare. Ingredients you already have are excluded.",
    bo_all_available:   "All cocktails are currently available.",
    bo_shopping_empty:  "Select cocktails above to generate a shopping list.",
    bo_needed_for:      "needed for",
    bo_all_owned:       "You already have everything needed!",
  },
  pt: {
    // Nav
    nav_home: "O Bar",
    nav_backoffice: "Staff",
    lang_toggle: "EN",

    // Gallery
    gallery_title: "Menu de Hoje",
    gallery_subtitle: "O que é que se bebe aqui?",
    gallery_empty: "Nada disponível de momento — volte mais tarde.",
    gallery_request: "Pedir este cocktail",

    // Detail page
    detail_ingredients: "Ingredientes",
    detail_glass: "Servir em",
    detail_ice_yes: "Servido com gelo",
    detail_ice_no: "Servido sem gelo",
    detail_your_name: "O seu nome",
    detail_name_placeholder: "Como devo chamar-lhe?",
    detail_submit: "Enviar Pedido",
    detail_back: "← Voltar ao menu",
    detail_success_title: "Pedido enviado!",
    detail_success_msg: "Vou preparar já.",
    detail_error: "Algo correu mal. Por favor tente novamente.",

    // Glass types
    glass_rocks: "Copo Old Fashioned",
    glass_martini: "Copo Martini",
    glass_flute: "Flauta de Champagne",
    glass_highball: "Copo Highball",
    glass_coupe: "Copo Coupe",
    glass_wine: "Copo de Vinho",
    glass_hurricane: "Copo Hurricane",
    glass_collins: "Copo Collins",

    // Backoffice
    bo_title: "Backoffice",
    bo_subtitle: "Gerir disponibilidade de ingredientes",
    bo_password_label: "Palavra-passe",
    bo_password_placeholder: "Introduza a palavra-passe",
    bo_unlock: "Entrar",
    bo_wrong_password: "Palavra-passe incorrecta.",
    bo_ingredients_title: "Ingredientes Disponíveis",
    bo_ingredients_desc: "Seleccione os ingredientes que tem em stock. Apenas os cocktails com todos os ingredientes disponíveis serão mostrados aos convidados.",
    bo_save: "Guardar",
    bo_saved: "Guardado!",
    bo_select_all: "Seleccionar tudo",
    bo_deselect_all: "Limpar selecção",
    bo_logout: "Bloquear",

    // Backoffice tabs
    bo_tab_ingredients: "Ingredientes",
    bo_tab_missing:     "Cocktails em falta",
    bo_tab_shopping:    "Lista de compras",
    bo_ingredients_desc_short: "Seleccione os ingredientes que tem em stock.",
    bo_shopping_desc:   "Seleccione os cocktails que quer preparar. Ingredientes que já tem são excluídos.",
    bo_all_available:   "Todos os cocktails estão disponíveis de momento.",
    bo_shopping_empty:  "Seleccione cocktails acima para gerar a lista de compras.",
    bo_needed_for:      "necessário para",
    bo_all_owned:       "Já tem tudo o que precisa!",
  }
};

function getLang() {
  return localStorage.getItem("lang") || "en";
}

function setLang(lang) {
  localStorage.setItem("lang", lang);
}

function t(key) {
  const lang = getLang();
  return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS["en"][key] || key;
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    el.title = t(el.dataset.i18nTitle);
  });
}
