import { getContentSize } from "../../scripts/utils.js";

const defaultStyles = {
  /**
   * number или "stretch" - в таком случае компонент растянется на ширину родителя
   */
  size: 120,
  backgroundColor: "transparent",
  stroke: "#000",
  // цвет круга на фоне
  backStroke: "#ff0000",
  strokeWidth: 10,
  fill: "transparent",
  transitionDuration: "0.3s",
};

export default class Progress {
  /**
   * @param {object} node - узел, относительно которого произойдёт вставка компонента
   * @param {string} method - метод вставки. before | prepend | append | after
   * @param {object} styles - объект для конфигурации стилей, см. пример по defaultStyles
   * @param {string} classPrefix - префикс для имён классов элементов компонента.
   * Правила для селекторов можно прописать в файле "./index.css" данного компонента.
   * Нестилизуемые из CSS svg-атрибуты следует передавать через аргумент styles.
   */
  constructor(node, method = "append", styles, classPrefix = "progress") {
    this.node = node;
    this.method = method;
    this.styles = styles ?? defaultStyles;

    if (this.styles.size === "stretch") {
      if (this.method === "append" || this.method === "prepend") {
        this.styles.size = Math.min(
          getContentSize(this.node).width,
          getContentSize(this.node).height
        );
        window.addEventListener("resize", () => {
          this.setSize(
            Math.min(
              getContentSize(this.node).width,
              getContentSize(this.node).height
            )
          );
        });
      } else {
        // поиск родителя при before | after
        const parent = this.node.parentNode;
        this.styles.size = Math.min(
          getContentSize(parent).width,
          getContentSize(parent).height
        );
        window.addEventListener("resize", () => {
          this.setSize(
            Math.min(
              getContentSize(parent).width,
              getContentSize(parent).height
            )
          );
        });
      }
    }

    this.svg = {
      markup: "",
      className: classPrefix,
      createSvg(externalContext) {
        this.markup = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        this.markup.setAttributeNS(
          "http://www.w3.org/2000/xmlns/",
          "xmlns",
          "http://www.w3.org/2000/svg"
        );
        this.markup.setAttribute("class", this.className);
        this.calcSize(externalContext);
      },
      calcSize(externalContext) {
        this.markup.setAttribute("width", externalContext.styles.size);
        this.markup.setAttribute("height", externalContext.styles.size);
      },
    };
    this.svg.createSvg(this);
    this.svg.markup.style.visibility = "visible";
    this.svg.markup.style.opacity = "1";
    this.svg.markup.style.transition = `visibility 0s,
      opacity ${this.styles.transitionDuration} linear`;

    this.calcCircleSize = (currentCircle) => {
      currentCircle.markup.setAttribute("cx", `${this.styles.size / 2}`);
      currentCircle.markup.setAttribute("cy", `${this.styles.size / 2}`);
      currentCircle.markup.setAttribute(
        "r",
        `${this.styles.size / 2 - this.styles.strokeWidth / 2}`
      );
    };

    function createBasicCircle(currentCircle, externalContext) {
      currentCircle.markup = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      currentCircle.markup.setAttributeNS(
        "http://www.w3.org/2000/xmlns/",
        "xmlns",
        "http://www.w3.org/2000/svg"
      );
      currentCircle.markup.setAttribute("class", currentCircle.className);
      currentCircle.markup.setAttribute(
        "stroke-width",
        `${externalContext.styles.strokeWidth}`
      );
      externalContext.calcCircleSize(currentCircle);
      currentCircle.markup.setAttribute("fill", externalContext.styles.fill);
    }

    this.circle = {
      markup: "",
      className: `${classPrefix}__circle`,
      createCircle(externalContext) {
        createBasicCircle(this, externalContext);
        this.markup.setAttribute("stroke", externalContext.styles.stroke);
      },
      setProgress(value) {
        this.lastValue = value;
        const offset = this.circumference - (value / 100) * this.circumference;
        this.markup.style.strokeDashoffset = offset;
      },
      handleResize() {
        this.radius = this.markup.r.baseVal.value;
        this.circumference = 2 * Math.PI * this.radius;
        this.markup.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.markup.style.strokeDashoffset = this.circumference;
      },
      toggleAnimation() {
        this.markup.classList.toggle("progress_animated");
      },
    };
    this.circle.createCircle(this);
    this.circle.handleResize();
    this.circle.markup.style.transformOrigin = "center";
    this.circle.markup.style.transform = "rotate(-90deg)";
    this.circle.markup.style.transition = `stroke-dashoffset ${this.styles.transitionDuration} linear`;

    this.backCircle = {
      markup: "",
      className: `${classPrefix}__back-circle`,
      createCircle(externalContext) {
        createBasicCircle(this, externalContext);
        this.markup.setAttribute("stroke", externalContext.styles.backStroke);
      },
    };
    this.backCircle.createCircle(this);

    this.svg.markup.append(this.backCircle.markup);
    this.svg.markup.append(this.circle.markup);
  }

  render() {
    this.node[this.method](this.svg.markup);
  }

  /**
   * @param {0 | 1} condition - 1 = видно
   */
  toggleHiding(condition) {
    if (condition) {
      this.svg.markup.style.visibility = "visible";
      this.svg.markup.style.opacity = "1";
      this.svg.markup.style.transition = `visibility 0s,
        opacity ${this.styles.transitionDuration} linear`;
    } else {
      this.svg.markup.style.visibility = "hidden";
      this.svg.markup.style.opacity = "0";
      this.svg.markup.style.transition = `visibility 0s ${this.styles.transitionDuration},
        opacity ${this.styles.transitionDuration} linear`;
    }
  }

  toggleAnimation() {
    this.circle.toggleAnimation();
  }

  setProgress(value) {
    if (value > 100) {
      this.circle.setProgress(100);
      return;
    }
    if (value < 0) {
      this.circle.setProgress(0);
      return;
    }
    this.circle.setProgress(value);
  }

  setSize(value) {
    // при ресайзе скачет длина окружности, потому отключаем плавность
    this.circle.markup.style.transition = `stroke-dashoffset 0s linear`;
    this.styles.size = value;
    this.svg.calcSize(this);
    this.calcCircleSize(this.backCircle);
    this.calcCircleSize(this.circle);
    this.circle.handleResize();
    this.circle.setProgress(this.circle.lastValue);
    // после окончания вычислений восстанавливем плавность изм-ий длины окружности
    setTimeout(() => {
      this.circle.markup.style.transition = `stroke-dashoffset ${this.styles.transitionDuration} linear`;
    }, 0);
  }
}
