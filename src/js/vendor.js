import {
  LS_FAVOURITES_KEY,
  THECOLOR_API_URL,
  TOAST_ERROR_ICON,
  TOAST_SUCCESS_ICON,
  TOAST_WARNING_ICON,
} from "./constants";
import "@simonwep/pickr/dist/themes/classic.min.css";
import Pickr from "@simonwep/pickr";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export const getColorName = async (hex) => {
  const cleanHex = hex.split("#")[1];
  try {
    const res = await fetch(`${THECOLOR_API_URL}${cleanHex}`);
    const data = await res.json();

    return data.name.value;
  } catch (err) {
    console.log(err);
    return "Not Found";
  }
};

export const initPicker = (hex) => {
  console.log("Init picker");
  const pickr = new Pickr({
    el: ".color-picker",
    container: "body",
    theme: "classic",
    closeOnScroll: false,
    useAsButton: false,
    padding: 16,
    inline: false,
    autoReposition: true,
    sliders: "v",
    disabled: false,
    lockOpacity: false,
    outputPrecision: 0,
    comparison: true,
    default: hex,
    swatches: null,
    defaultRepresentation: "HEX",
    showAlways: false,
    closeWithKey: "Escape",
    adjustableNumbers: true,
    components: {
      palette: true,
      preview: true, // Display comparison between previous state and new color
      opacity: true, // Display opacity slider
      hue: true, // Display hue slider
      interaction: {
        // Buttons, if you disable one but use the format in default: or setColor() - set the representation-type too!
        hex: false, // Display 'input/output format as hex' button  (hexadecimal representation of the rgba value)
        rgba: true, // Display 'input/output format as rgba' button (red green blue and alpha)
        hsla: true, // Display 'input/output format as hsla' button (hue saturation lightness and alpha)
        hsva: false, // Display 'input/output format as hsva' button (hue saturation value and alpha)
        cmyk: false, // Display 'input/output format as cmyk' button (cyan mangenta yellow key )

        input: true, // Display input/output textbox which shows the selected color value.
        // the format of the input is determined by defaultRepresentation,
        // and can be changed by the user with the buttons set by hex, rgba, hsla, etc (above).
        cancel: true, // Display Cancel Button, resets the color to the previous state
        clear: false, // Display Clear Button; same as cancel, but keeps the window open
        save: true, // Display Save Button,
      },
    },

    // Translations, these are the default values.
    i18n: {
      // Strings visible in the UI
      "ui:dialog": "color picker dialog",
      "btn:toggle": "toggle color picker dialog",
      "btn:swatch": "color swatch",
      "btn:last-color": "use previous color",
      "btn:save": "Save",
      "btn:cancel": "Cancel",
      "btn:clear": "Clear",

      // Strings used for aria-labels
      "aria:btn:save": "save and close",
      "aria:btn:cancel": "cancel and close",
      "aria:btn:clear": "clear and close",
      "aria:input": "color input field",
      "aria:palette": "color selection area",
      "aria:hue": "hue selection slider",
      "aria:opacity": "selection slider",
    },
  });
  return pickr;
};

export const createElement = (
  ele,
  classNames = null,
  text = null,
  attribute = null
) => {
  const element = document.createElement(ele);

  if (classNames) {
    classNames.forEach((className) => {
      element.classList.add(className);
    });
  }

  if (text) {
    element.textContent = text;
  }

  if (attribute) {
    element.setAttribute("data-color", attribute);
  }
  return element;
};

// Local Storage Operations
export const getItems = async (key = LS_FAVOURITES_KEY) => {
  let items = await localStorage.getItem(key);
  if (!items) {
    localStorage.setItem(key, JSON.stringify([]));
    items = localStorage.getItem(key);
  }
  items = JSON.parse(items);
  if (items.length >= 8) {
    items = items.slice(-8);
  }
  return items;
};

export const addItem = async (key = LS_FAVOURITES_KEY, value) => {
  if (key && value) {
    value = value.toUpperCase();
    let items = await getItems(key);
    if (items.includes(value)) return;
    if (items.length >= 8) {
      items = items.slice(1);
    }
    items.push(value);
    localStorage.setItem(key, JSON.stringify(items));
  }
};

export const showToast = (type, text) => {
  let url;
  switch (type) {
    case "success":
      url = TOAST_SUCCESS_ICON;
      break;
    case "error":
      url = TOAST_ERROR_ICON;
      break;
    case "warning":
      url = TOAST_WARNING_ICON;
      break;
    default:
      url = TOAST_SUCCESS_ICON;
      break;
  }
  Toastify({
    text: text,
    duration: 2000,
    newWindow: true,
    gravity: "bottom", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    avatar: url,
    style: {
      display: "flex",
      alignItems: "center",
      background: "#000000",
      borderRadius: "0.5rem",
    },
  }).showToast();
};
