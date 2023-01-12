import chroma from "chroma-js";
import { assignRandomColor, renderColorComponent } from "./events";

//IIFE
(async () => {
  console.log("Welcome to EasyColors!!!!");

  const rand = await chroma.random().hex();
  assignRandomColor(rand);
  renderColorComponent(rand);
})();
