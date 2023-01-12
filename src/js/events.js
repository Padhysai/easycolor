import chroma from "chroma-js";
import { getColorName } from "./utils";

export const assignRandomColor = (rand) => {
  //Set random color as value
  const ele = document.getElementById("main-search");
  ele.value = rand;

  //Change the color picker element background
  const picker = document.getElementById("main-picker");
  picker.style.backgroundColor = rand;
};

export const renderColorComponent = async (hex) => {
  let textColor = "#ffffff";
  const colorDelta = await chroma(hex).luminance();
  if (colorDelta > 0.5) {
    textColor = "#000000";
  }

  const ele = document.getElementById("color-comp-main");
  ele.style.backgroundColor = hex;
  ele.style.color = textColor;
  const colorObj = await chroma(hex);

  const colorHex = document.createElement("h3");
  colorHex.textContent = hex;

  const colorName = document.createElement("h3");
  colorName.classList.add("color__name");
  const name = await getColorName(hex);
  colorName.textContent = name;

  const colorsDiv = document.createElement("div");
  colorsDiv.classList.add("color__list");

  const rgbButton = document.createElement("button");
  rgbButton.textContent = colorObj.css();
  rgbButton.setAttribute("data-color", colorObj.css());

  const rgbaButton = document.createElement("button");
  rgbaButton.textContent = colorObj.css("rgba").toUpperCase();
  rgbaButton.setAttribute("data-color", colorObj.alpha(1).css());

  const hslButton = document.createElement("button");
  hslButton.textContent = colorObj.css("hsl");
  hslButton.setAttribute("data-color", colorObj.css("hsl"));

  colorsDiv.append(rgbButton, rgbaButton, hslButton);
  ele.append(colorHex, colorName, colorsDiv);
};
