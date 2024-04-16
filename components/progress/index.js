export default class Progress {
  /**
   * @param node - узел, относительно которого произойдёт вставка компонента
   * @param {string} method - метод вставки. before | prepend | append | after
   * @param {number} size - размер svg-контейнера в пикселях
   * @param {string} classPrefix - префикс для имён классов элементов компонента
   */
  constructor(node, method = "append", size = 120, classPrefix = "progress") {
    this.node = node;
    this.method = method;

    this.svg = {
      markup: "",
      className: classPrefix,
      size: `${size}`,
      createSvg() {
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
        this.markup.setAttribute("width", this.size);
        this.markup.setAttribute("height", this.size);
      },
    };
    this.svg.createSvg();

    this.circle = {
      markup: "",
      className: `${classPrefix}__circle`,
      stroke: "#000",
      strokeWidth: 4,
      cx: `${size / 2}`,
      cy: `${size / 2}`,
      createCircle() {
        this.markup = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        this.markup.setAttributeNS(
          "http://www.w3.org/2000/xmlns/",
          "xmlns",
          "http://www.w3.org/2000/svg"
        );
        this.markup.setAttribute("class", this.className);
        this.markup.setAttribute("stroke", this.stroke);
        this.markup.setAttribute("stroke-width", `${this.strokeWidth}`);
        this.markup.setAttribute("cx", this.cx);
        this.markup.setAttribute("cy", this.cy);
        this.markup.setAttribute("r", `${size / 2 - this.strokeWidth * 2}`);
      },
    };
    this.circle.createCircle();

    this.svg.markup.append(this.circle.markup);
  }
  render() {
    this.node[this.method](this.svg.markup);
  }
}
