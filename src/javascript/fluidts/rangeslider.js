goog.module('fluidts.rangeslider');

// goog
const goog_dom_classlist = goog.require('goog.dom.classlist');
const goog_object = goog.require('goog.object');

// fluidts
const { ElementProvider } =
  goog.require('fluidts.rangeslider.ElementProvider');

// momentum
goog.require('momentum.Draggable');
goog.require('momentum.utils');

class RangeSlider {
  /**
   * @param {Element|string} container
   * @param {FluidtsRangeSliderConfig} config
   */
  constructor(container, config) {
    /**
     * @private
     * @type {Element}
     */
    this.container_ = typeof container === 'string'
      ? document.querySelector(container)
      : container;

    /**
     * @private
     * @type {FluidtsRangeSliderConfig}
     */
    this.userConfig_ = config;

    /**
     * @private
     * @type {FluidtsRangeSliderConfig}
     */
    this.config_ = {
      range: [0, 100],
      precision: 0,
      friction: 0.17,
      activateDelay: 0,
      deactivateDelay: 300
    };

    /**
     * @private
     * @type {ElementProvider}
     */
    this.elements_ = new ElementProvider();

    /**
     * @private
     * @type {momentum.Draggable}
     */
    this.draggable_ = null;

    /**
     * @private
     * @type {number}
     */
    this.currentValue_ = 0;

    /**
     * @private
     * @type {boolean}
     */
    this.triggerDown_ = false;

    /**
     * Init slider
     */
    this.init_();
  }

  /**
   * @private
   */
  init_() {
    // Extend default config
    goog_object.extend(this.config_, this.userConfig_);

    // Init element provider
    this.elements_.init(this.container_);

    // Initial update
    this.updateValue_();

    // Init draggable
    setTimeout(() => this.initDraggable_(), 0);
  }

  /**
   * @private
   * @param {number} value
   */
  setMinValue_(value) {
    goog.dom.setTextContent(this.elements_.minLabel, value);
  }

  /**
   * @private
   * @param {number} value
   */
  setMaxValue_(value) {
    goog.dom.setTextContent(this.elements_.maxLabel, value);
  }

  /**
   * @private
   */
  initDraggable_() {
    this.setMinValue_(this.config_.range[0]);
    this.setMaxValue_(this.config_.range[1]);

    this.draggable_ = new momentum.Draggable(this.elements_.displayWrapper, {
      elementBounds: this.elements_.dragContainer,
      lockAxis: { y: true },
      restitution: 0,
      friction: this.config_.friction,
      onDown: this.handleTriggerDown_.bind(this),
      onUp: this.handleTriggerUp_.bind(this),
      onTranslate: this.handleTriggerTranslate_.bind(this)
    });
  }

  /**
   * @private
   * @param {boolean} hit
   * @return boolean
   */
  handleTriggerDown_(hit) {
    this.triggerDown_ = hit;

    this.checkTrigger_();

    return hit;
  }

  /**
   * @private
   */
  handleTriggerUp_() {
    this.triggerDown_ = false;
    this.checkTrigger_();
  }

  /**
   * @private
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {Object} bounds
   */
  handleTriggerTranslate_(x, y, width, height, bounds) {
    const min = this.config_.range[0];
    const max = this.config_.range[1];

    const progress = x / (bounds.width - width);
    const value = min + (max - min) * progress;

    momentum.utils.setTranslation(this.elements_.shapeCircle, x, 0);

    this.updateValue_(value);
  }

  /**
   * @private
   * @param {number=} optValue
   */
  updateValue_(optValue) {
    const value = !isNaN(optValue) ? optValue : this.currentValue_;

    this.currentValue_ = Number(value.toFixed(this.config_.precision));
    goog.dom.setTextContent(this.elements_.displayLabel, this.currentValue_);
  }

  /**
   * @private
   */
  checkTrigger_() {
    this.elements_.enableSvgFilter(
      this.elements_.shapeFilter,
      this.triggerDown_,
      this.triggerDown_
        ? this.config_.activateDelay
        : this.config_.deactivateDelay
    );

    goog_dom_classlist.enable(this.elements_.wrapper, 'fluidts-active', this.triggerDown_);
  }
}

exports = { RangeSlider };