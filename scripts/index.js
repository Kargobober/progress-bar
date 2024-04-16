import { Progress } from "../components/index.js";

const main = document.querySelector("main");
const inputProgressValue = document.querySelector(
  ".demo-progress__input-value"
);

const progress = new Progress(main, "prepend", null, "myBar");
progress.render();

inputProgressValue.addEventListener("change", (evt) => {
  const value = evt.target.value;
  if (value > 100) {
    evt.target.value = 100;
  }
  if (value < 0) {
    evt.target.value = 0;
  }
  progress.setProgress(evt.target.value);
});
