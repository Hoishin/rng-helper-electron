'use strict';

module.exports = class HealCalculator {
	/**
	 * Defines healing condition
	 * @param {Object} heal - The condition of healing character
	 * @param {String} heal.spell - Which spell is used
	 * @param {Number} heal.level
	 * @param {Number} heal.magick
	 * @param {Boolean} heal.serenity - Serenity multiplies 1.5
	 * @param {Boolean} heal.zodiac - IZJS/TZA adds 1 spell power to some healing spells
	 */
	constructor(heal) {
		if (heal.level > 99 || heal.magick > 255) {
			return false;
		}
		this.spell = this.__healingSpell(heal.spell, heal.zodiac);
		this.level = heal.level;
		this.magick = heal.magick;
		this.serenity = heal.serenity ? 1.5 : 1;
		this.minValue = this.__healFormula(0);
		this.maxValue = this.__healFormula((this.spell * 12.5) - 1);
	}

	/**
	 * Calculates the healing amount according to the random number
	 * @param {Number} random
	 * @return {Number}
	 */
	calculate(random) {
		const result = this.__healFormula(random % (this.spell * 12.5));
		return Math.floor(result);
	}

	/**
	 * If the input heal number is valid
	 * @param {Number} heal
	 * @return {Boolean}
	 */
	isValidNumber(heal) {
		if (heal < this.minValue || heal > this.maxValue) {
			return false;
		}
		return true;
	}

	/**
	 * Determines spell power
	 * @param {String} spell Currently either Cure or Cura
	 * @param {Boolean} zodiac IZJS/TZA adds 1 spell power to Cura
	 * @return {Number}
	 */
	__healingSpell(spell, zodiac) {
		if (spell === 'cura') {
			return zodiac ? 46 : 45;
		}
		return 20;
	}

	/**
	 * Formula to calculate heal number
	 * @param {Number} param
	 * @return {Number}
	 */
	__healFormula(param) {
		return (this.spell + (param / 100)) *
		(((this.level + this.magick) * (this.magick / 256)) + 2) * this.serenity;
	}
};
