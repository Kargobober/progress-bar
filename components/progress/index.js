const defaultStyles = {
  size: 120,
  backgroundColor: "transparent",
  stroke: "#000",
  // цвет круга на фоне
  backStroke: "#ff0000",
  strokeWidth: 4,
  fill: "transparent",
};

export default class Progress {
  /**
   * @param {object} node - узел, относительно которого произойдёт вставка компонента
   * @param {string} method - метод вставки. before | prepend | append | after
   * @param {object} styles - объект для конфигурации стилей
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
      createSvg(contextClass) {
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
        this.markup.setAttribute("width", contextClass.styles.size);
        this.markup.setAttribute("height", contextClass.styles.size);
      },
    };
    this.svg.createSvg(this);

    function createBasicCircle(currentCircle, contextClass) {
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
        `${contextClass.styles.strokeWidth}`
      );
      currentCircle.markup.setAttribute(
        "cx",
        `${contextClass.styles.size / 2}`
      );
      currentCircle.markup.setAttribute(
        "cy",
        `${contextClass.styles.size / 2}`
      );
      currentCircle.markup.setAttribute(
        "r",
        `${contextClass.styles.size / 2 - contextClass.styles.strokeWidth * 2}`
      );
      currentCircle.markup.setAttribute("fill", contextClass.styles.fill);
    }

    this.circle = {
      markup: "",
      className: `${classPrefix}__circle`,
      createCircle(contextClass) {
        createBasicCircle(this, contextClass);
        this.markup.setAttribute("stroke", contextClass.styles.stroke);
      },
    };
    this.circle.createCircle(this);

    this.backCircle = {
      markup: "",
      className: `${classPrefix}__back-circle`,
      createCircle(contextClass) {
        createBasicCircle(this, contextClass);
        this.markup.setAttribute("stroke", contextClass.styles.backStroke);
      },
    };
    this.backCircle.createCircle(this);

    this.svg.markup.append(this.backCircle.markup);
    this.svg.markup.append(this.circle.markup);
  }

  render() {
    this.node[this.method](this.svg.markup);
  }
}
