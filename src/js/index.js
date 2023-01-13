import {
  assignRandomColor,
  debounce,
  getRandomColor,
  handleMarkFavourite,
  handleOnSearchInputChange,
  renderColorComponent,
  renderFavourites,
  renderPrimaryColors,
  renderSecondaryColors,
} from "./utils";
import { initPicker } from "./vendor";

//IIFE
(async () => {
  console.log("Welcome to EasyColors!!!!");
  // Assign Random color
  const rand = await getRandomColor();
  await assignRandomColor(rand);
  await renderColorComponent(rand);
  // Attaching on change event
  const searchInput = document.getElementById("main-search");
  searchInput.oninput = debounce(handleOnSearchInputChange, 1000);
  // Init Color Picker
  const pickr = initPicker(rand);
  pickr
    .on("init", (instance) => {
      console.log("Color Picket Init", instance);
    })
    .on("save", async (color, instance) => {
      await assignRandomColor(color.toHEXA().toString());
      await renderColorComponent(color.toHEXA().toString());
      pickr.hide();
    })
    .on("cancel", (instance) => {
      pickr.hide();
    });
  // Mark-Fav Event Listner
  const FavIcon = document.getElementById("mark-favourite");
  FavIcon.onclick = handleMarkFavourite;
  // Loading Favourites
  renderFavourites();
  // Loading primary Colors Skeleton -- colors with scroll
  renderPrimaryColors();
  // Loading Secondary Colors Skeleton -- colors with
  renderSecondaryColors();
  // Loading Community colors skeleton -- colors with scroll
})();
