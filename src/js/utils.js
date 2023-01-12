import { COLORMIND_API_URL } from "./constants";

export const getColorName = async (hex) => {
  const cleanHex = hex.split("#")[1];
  const res = await fetch(`${COLORMIND_API_URL}${cleanHex}`);
  const data = await res.json();

  return data.name.value;
};
