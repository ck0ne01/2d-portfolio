import kaplay from "kaplay";

export const k = kaplay({
  global: false,
  touchToMouse: true,
  canvas: document.querySelector("game") as HTMLCanvasElement,
});
