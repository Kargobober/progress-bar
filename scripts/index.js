import { Progress } from "../components/index.js";

console.log("Well hello there!");

const main = document.querySelector("main");

const progress = new Progress(main, "append", null, "myBar");
progress.render();
