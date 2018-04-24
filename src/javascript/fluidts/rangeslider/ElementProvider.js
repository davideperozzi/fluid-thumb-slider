goog.module('fluidts.rangeslider.ElementProvider');

// goog
const goog_dom = goog.require('goog.dom');

class ElementProvider {
  constructor() {
    /**
     * @private
     * @type {string}
     */
    this.cssClassPrefix_ = 'fluidts-';

    /**
     * @public
     * @type {Element}
     */
    this.wrapper = null;

    /**
     * @public
     * @type {Element}
     */
    this.minLabel = null;

    /**
     * @public
     * @type {Element}
     */
    this.maxLabel = null;

    /**
     * @public
     * @type {Element}
     */
    this.dragContainer = null;

    /**
     * @public
     * @type {Element}
     */
    this.displayWrapper = null;

    /**
     * @public
     * @type {Element}
     */
    this.displayCircle = null;

    /**
     * @public
     * @type {Element}
     */
    this.shapeWrapper = null;

    /**
     * @public
     * @type {Element}
     */
    this.shapeBox = null;

    /**
     * @public
     * @type {Element}
     */
    this.shapeCircle = null;

    /**
     * @public
     * @type {Element}
     */
    this.shapeFilter = null;

    /**
     * @public
     * @type {Element}
     */
    this.displayLabel = null;

    /**
     * @private
     * @type {Element}
     */
    this.svgFilter = null;

    /**
     * @public
     * @type {string}
     */
    this.svgFilterName = '';

    /**
     * @public
     * @type {Element}
     */
    this.displayContainer = null;

    /**
     * @public
     * @type {Element}
     */
    this.dotWrapper = null;

    /**
     * @private
     * @type {number}
     */
    this.filterDelay_ = -1;
  }

  /**
   * @public
   * @param {Element} parent
   */
  init(parent) {
    this.createDomElements_();
    this.appendDomElements_(parent);
  }

  /**
   * @private
   */
  createDomElements_() {
    this.dragContainer = this.createElement_('drag-container', [
      this.shapeWrapper = this.createElement_('shape-wrapper', [
        this.shapeFilter = this.createElement_('shape-filter', [
          this.shapeBox = this.createElement_('shape-box'),
          this.shapeCircle = this.createElement_('shape-circle'),
        ])
      ]),
      this.displayWrapper = this.createElement_('display-wrapper', [
        this.displayContainer = this.createElement_('display-container', [
          this.displayLabel = this.createElement_('display-label', null, 'span'),
          this.displayCircle = this.createElement_('display-circle'),
        ])
      ])
    ]);

    this.wrapper = this.createElement_('wrapper', [
      this.minLabel = this.createElement_(['range-label', 'min-label']),
      this.dragContainer,
      this.maxLabel = this.createElement_(['range-label', 'max-label']),
    ]);

    this.svgFilterName = this.getCssClass_('filter');
    this.svgFilter = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svgFilter.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this.svgFilter.setAttribute('version', '1.1');
    this.svgFilter.style.height = '0px';
    this.svgFilter.style.position = 'absolute';
    this.svgFilter.innerHTML = `
      <defs>
        <filter id="${this.svgFilterName}">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="${this.svgFilterName}" />
          <feBlend in="SourceGraphic" in2="${this.svgFilterName}" />
          <feComposite in="SourceGraphic" in2="${this.svgFilterName}" operator="atop"/>
        </filter>
      </defs>
    `;
  }

  /**
   * @private
   * @param {Element} parent
   */
  appendDomElements_(parent) {
    goog_dom.appendChild(parent, this.wrapper);
    goog_dom.appendChild(parent, this.svgFilter);
  }

  /**
   * @private
   * @param {string|Array} classes
   * @param {Array<Element>=} optChildren
   * @param {string=} optTagName
   * @return {Element}
   */
  createElement_(classes, optChildren, optTagName) {
    const element = document.createElement(optTagName || 'div');

    element.setAttribute('class', this.getCssClass_(classes));

    if (optChildren && goog.typeOf(optChildren) == 'array') {
      for (let i = 0, len = optChildren.length; i < len; i++) {
        goog_dom.appendChild(element, optChildren[i]);
      }
    }

    return element;
  }

  /**
   * @public
   * @param {Element} element
   * @param {boolean} enable
   * @param {number=} optDelay
   * @return {boolean}
   */
  enableSvgFilter(element, enable, optDelay) {
    clearTimeout(this.filterDelay_);

    if (enable) {
      this.filterDelay_ = setTimeout(() => {
        element.style.filter = `url(#${this.svgFilterName})`;
      }, optDelay || 0);
    }
    else {
      this.filterDelay_ = setTimeout(() => {
        element.style.filter = 'none';
      }, optDelay || 0);
    }

    return enable;
  }

  /**
   * @private
   * @param {string|Array<string>} value
   * @return {string}
   */
  getCssClass_(value) {
    if (goog.isArray(value)) {
      const classes = [];

      for (let i = 0, len = value.length; i < len; i++) {
        classes.push(this.cssClassPrefix_ + value[i]);
      }

      return classes.join(' ');
    }

    return this.cssClassPrefix_ + value;
  }
}

exports = { ElementProvider };