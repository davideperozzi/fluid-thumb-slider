goog.module('fluidts');

const { RangeSlider } =
  goog.require('fluidts.rangeslider');

// Export for internal use
exports.fluidts = { RangeSlider: RangeSlider };

// Export for external use
goog.exportSymbol('fluidts.RangeSlider', RangeSlider);