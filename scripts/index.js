import { Progress } from "../components/index.js";

const main = document.querySelector("main");
const inputProgressValue = document.querySelector(
  ".demo-progress__input-value"
);
const inputProgressAnimation = document.querySelector(
  ".demo-progress__input-animation"
);
const inputProgressHiding = document.querySelector(
  ".demo-progress__input-hiding"
);

const progressStyles = {
  size: 120,
  backgroundColor: "transparent",
  stroke: "var(--color-main)",
  backStroke: "var(--color-bg-alt)",
  strokeWidth: 10,
  fill: "transparent",
  transitionDuration: "0.3s",
};
const progress = new Progress(main, "prepend", progressStyles);
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

inputProgressAnimation.addEventListener("change", () => {
  progress.toggleAnimation();
});

inputProgressHiding.addEventListener("change", (evt) => {
  if (evt.target.checked) {
    progress.toggleHiding(0);
  } else {
    progress.toggleHiding(1);
  }
});
