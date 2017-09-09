'use strict';

const defaultChestConfig = {
  appearChance: 50,
  position: 1,
  gilChance: 50,
  item1Chance: 50,
  maxGil: 100,
  fixedGil: false
};

module.exports = class ChestValidation {
  /**
   * Sets up the chest and take care of it
   * @param {Object} chestConfig
   */
  constructor(chestConfig = defaultChestConfig) {
    this.config = chestConfig;
    for (const key in this.config) {
      if (this.config[key] === undefined) {
        this.config[key] = defaultChestConfig[key];
      }
    }
  }

  /**
   * See if the chest appears with the RNG
   * @param {Number} percent
   * @return {Boolean}
   */
  ifAppears(percent) {
    if (percent < this.config.appearChance) {
      return true;
    }
    return false;
  }

  /**
   * See if the chest has gil or not
   * @param {Number} percent
   * @return {Boolean}
   */
  isGil(percent) {
    if (percent < this.config.gilChance) {
      return true;
    }
    return false;
  }

  /**
   * Calculate gil amount
   * @param {Number} random
   * @return {Number}
   */
  gilAmount(random) {
    if (this.config.fixedGil) {
      return this.config.maxGil;
    }
    return 1 + (random % this.config.maxGil);
  }

  /**
   * Determines the item in the chest
   * @param {Number} percent
   * @return {String}
   */
  itemContent(percent) {
    if (percent < this.config.item1Chance) {
      return 'item1';
    }
    return 'item2';
  }

  /**
   * Determines next RNG position that spawns the chest
   * @param {Object[]} future
   * @return {Number}
   */
  nextAppear(future) {
    future.forEach((element, index) => {
      if (this.ifAppears(element.percent)) {
        return index;
      }
    }, this);
    return -1;
  }
};
