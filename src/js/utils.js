import chroma from "chroma-js";
import { COMMUNITY, PRIMARY_COLORS, SECONDARY_COLORS } from "../data/data";
import { LS_FAVOURITES_KEY } from "./constants";
import {
  getColorName,
  createElement,
  addItem,
  showToast,
  getItems,
} from "./vendor";

export const assignRandomColor = (rand) => {
  //Set random color as value
  const ele = document.getElementById("main-search");
  ele.value = rand;

  //Change the color picker element background
  //const picker = document.getElementById("main-picker");
  //picker.style.backgroundColor = rand;
};

export const renderColorComponent = async (hex) => {
  let textColor = "#ffffff";
  const colorDelta = await chroma(hex).luminance();
  if (colorDelta > 0.5) {
    textColor = "#000000";
  }
  const colorObj = await chroma(hex);

  let colorHex = document.getElementById("colorHEX");
  if (colorHex) {
    colorHex.textContent = hex;
  } else {
    colorHex = createElement("h3", null, hex, null);
  }

  let colorName = document.getElementById("colorName");
  const name = await getColorName(hex);
  if (colorName) {
    colorName.textContent = name;
  } else {
    colorName = createElement("h3", "color__name", name, null);
  }

  let colorsDiv = document.getElementById("colorList");
  if (colorsDiv) {
    colorsDiv.innerHTML = "";
  } else {
    colorsDiv = createElement("div", "color__list", null, null);
  }
  const rgbButton = createElement(
    "button",
    ["hover:scale-110", "transition-all", "duration-300"],
    colorObj.css(),
    colorObj.css()
  );

  const rgbaButton = createElement(
    "button",
    ["hover:scale-110", "transition-all", "duration-300"],
    colorObj.css("rgba").toUpperCase(),
    colorObj.css("rgba").toUpperCase()
  );

  const hslButton = createElement(
    "button",
    ["hover:scale-110", "transition-all", "duration-300"],
    colorObj.css("hsl"),
    colorObj.css("hsl")
  );

  colorsDiv.append(rgbButton, rgbaButton, hslButton);

  // Append to Div
  const ele = document.getElementById("color-comp-main");
  ele.style.backgroundColor = hex;
  ele.style.color = textColor;
  ele.classList.remove("animate-pulse");

  ele.append(colorHex, colorName, colorsDiv);
};

export const getRandomColor = async () => {
  return await chroma.random().hex();
};

export const convertToHex = async (colorVal) => {
  return await chroma(colorVal).hex();
};

export const handleOnSearchInputChange = async (e) => {
  try {
    const isValidColor = await chroma.valid(e.target.value);
    if (isValidColor) {
      const hexColor = await chroma(e.target.value).hex();
      await assignRandomColor(hexColor);
      await renderColorComponent(hexColor);
    }
  } catch {
    showToast("error", "Something went wrong!");
  }
};

export const renderFavouriteCard = (color) => {
  const mainDiv = createElement(
    "div",
    [
      "h-48",
      "w-32",
      "shadow-md",
      "shadow-slate-500/50",
      "flex",
      "flex-col",
      "rounded-lg",
      "justify-between",
    ],
    null,
    null
  );
  const nestedDiv = createElement(
    "div",
    ["w-full", "h-32", "rounded-t-lg"],
    null,
    null
  );
  nestedDiv.style.backgroundColor = color;
  const btn = createElement(
    "button",
    ["py-4", "text-black700", "font-semibold"],
    color,
    color
  );
  mainDiv.append(nestedDiv, btn);
  return mainDiv;
};

export const renderCommunityCard = (colorObj) => {
  const mainDiv = createElement(
    "div",
    [
      "h-48",
      "w-64",
      "shadow-md",
      "shadow-slate-500/50",
      "flex",
      "flex-col",
      "rounded-lg",
      "justify-between",
    ],
    null,
    null
  );
  const nestedDiv = createElement(
    "div",
    ["w-full", "h-32", "rounded-t-lg"],
    null,
    null
  );
  nestedDiv.style.backgroundColor = colorObj.color;
  const btn = createElement(
    "button",
    ["pt-4", "text-black700", "font-semibold"],
    colorObj.color,
    colorObj.color
  );
  const a = document.createElement("a");
  a.href = colorObj.userprofile;
  a.textContent = `Submitted by ${colorObj.submittedby}`;
  a.target = "_blank";

  const att = createElement(
    "p",
    ["text-sm", "text-center", "pb-1", "pt-1"],
    null,
    null
  );

  att.append(a);
  mainDiv.append(nestedDiv, btn, att);
  return mainDiv;
};

export const renderColorsinUI = (ele, arr, img = null) => {
  const fragment = document.createDocumentFragment();
  if (arr.length === 0) {
    //const img = document.getElementById("no-fav-img");
    img.classList.remove("hidden");
    fragment.append(img);
  }
  arr.forEach((color) => {
    const cardDiv = renderFavouriteCard(color);
    fragment.append(cardDiv);
  });
  ele.innerHTML = "";
  ele.append(fragment);
};

export const renderFavourites = async () => {
  const favColorsDiv = document.getElementById("favourite-colors");
  const favItems = await getItems(LS_FAVOURITES_KEY);
  const img = document.getElementById("no-fav-img");
  renderColorsinUI(favColorsDiv, favItems, img);
};

export const renderPrimaryColors = async () => {
  const primaryColorsDiv = document.getElementById("primary-colors");
  renderColorsinUI(primaryColorsDiv, PRIMARY_COLORS);
};

export const renderSecondaryColors = async () => {
  const secondaryColorsDiv = document.getElementById("secondary-colors");
  renderColorsinUI(secondaryColorsDiv, SECONDARY_COLORS);
};

export const renderCommunityColors = async () => {
  const communityColorsDiv = document.getElementById("community-colors");
  const fragment = document.createDocumentFragment();
  COMMUNITY.forEach((color) => {
    const cardDiv = renderCommunityCard(color);
    fragment.append(cardDiv);
  });
  communityColorsDiv.innerHTML = "";
  communityColorsDiv.append(fragment);
};

export const handleMarkFavourite = async (e) => {
  try {
    const colorHex = document.getElementById("colorHEX");
    await addItem(LS_FAVOURITES_KEY, colorHex.textContent);
    showToast("success", "Color marked as a favorite!");
    renderFavourites();
  } catch {
    showToast("error", "Something went wrong!");
  }
};

export const handleOnCopyClick = async (e) => {
  try {
    const copiedColor = e.target.getAttribute("data-color");
    const permssion = await navigator.permissions.query({
      name: "clipboard-write",
    });
    if (copiedColor && permssion.state === "granted") {
      navigator.clipboard.writeText(copiedColor);
      //Show Toast
      showToast("success", "Color copied to clipboard!");
    } else if (permssion.state === "denied") {
      const request = await navigator.permissions.request({
        name: "clipboard-write",
      });
      if (request.state === "granted") {
        navigator.clipboard.writeText(copiedColor);
        //Show Toast
        showToast("success", "Color copied to clipboard!");
      } else {
        showToast("warning", "You don't have permissions enabled!");
      }
    }
  } catch {
    showToast("error", "Something went wrong!");
  }
};

export const debounce = (fn, delay = 500) => {
  let timer;
  return (...ars) => {
    const self = this;
    const args = ars;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => fn.apply(self, args), delay);
  };
};
