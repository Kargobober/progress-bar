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
        this.markup.setAttribute("width", externalContext.styles.size);
        this.markup.setAttribute("height", externalContext.styles.size);
      },
      toggleAnimation() {
        this.markup.classList.toggle("progress_animated");
      },
    };
    this.svg.createSvg(this);
    this.svg.markup.style.visibility = "visible";
    this.svg.markup.style.opacity = "1";
    this.svg.markup.style.transition = `visibility 0s,
      opacity ${this.styles.transitionDuration} linear`;

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
      currentCircle.markup.setAttribute(
        "cx",
        `${externalContext.styles.size / 2}`
      );
      currentCircle.markup.setAttribute(
        "cy",
        `${externalContext.styles.size / 2}`
      );
      currentCircle.markup.setAttribute(
        "r",
        `${
          externalContext.styles.size / 2 -
          externalContext.styles.strokeWidth / 2
        }`
      );
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
        const offset = this.circumference - (value / 100) * this.circumference;
        this.markup.style.strokeDashoffset = offset;
      },
    };
    this.circle.createCircle(this);

    this.circle.radius = this.circle.markup.r.baseVal.value;
    this.circle.circumference = 2 * Math.PI * this.circle.radius;
    this.circle.markup.style.strokeDasharray = `${this.circle.circumference} ${this.circle.circumference}`;
    this.circle.markup.style.strokeDashoffset = this.circle.circumference;
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
    this.svg.toggleAnimation();
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
}
