import { Progress } from "../components/index.js";

const container = document.querySelector(".container");
const inputProgressValue = document.querySelector(
  ".demo-progress__input-value"
);
const inputProgressAnimation = document.querySelector(
  ".demo-progress__input-animation"
);
const inputProgressHiding = document.querySelector(
  ".demo-progress__input-hiding"
);
const inputProgressSizing = document.querySelector(
  ".demo-progress__input-sizing"
);

const progressStyles = {
  size: "stretch",
  backgroundColor: "transparent",
  stroke: "var(--color-main)",
  backStroke: "var(--color-bg-alt)",
  strokeWidth: 10,
  fill: "transparent",
  transitionDuration: "0.3s",
};
const progress = new Progress(container, "append", progressStyles);
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

inputProgressSizing.addEventListener("change", (evt) => {
  progress.setSize(Number(evt.target.value));
});
