'use strict';

const MersenneTwister = require('./mersenne-twister');
const HealCalculator = require('./heal-calculator');

const defaultHealConfig = {
	spell: 'cure',
	level: 3,
	magick: 23,
	serenity: false,
	zodiac: false
};

module.exports = class FindPosition {
	/**
	 * This class takes care of everything related to RNG position.
	 * @param {Number} defaultLength - Amount of RNG to keep im memory
	 * @param {Object} healConfig - Heal settings
	 * @param {Boolean} tza - True if platform is PS4
	 */
	constructor(defaultLength = 10000, healConfig = defaultHealConfig, tza = false) {
		this.mt = new MersenneTwister(tza);
		this.heal = new HealCalculator(healConfig);
		this.defaultLength = defaultLength;
		this.position = 0;
		this.healNumbers = [];
		this.past = [];
		this.future = [];
		this.__initialFuture();
	}

	/**
	 * Finds the RNG position using heal numbers and forms future/past arrays
	 * @param {Number} input
	 * @return {Boolean} - False if the input number is not found
	 */
	find(input) {
		if (!this.heal.isValidNumber(input)) {
			return false;
		}
		this.healNumbers.unshift(input);
		if (this.healNumbers[0] === this.future[0].heal) {
			this.past.push(this.future.shift());
			this.__futurePush(this.mt.genRand());
			return true;
		}
		for (let max = 0; max < 10000000; max++) {
			for (let i = 0; i < this.future.length; i++) {
				let sequenceMatch = true;
				for (let j = 0; j < this.healNumbers.length; j++) {
					if (i - j < 0 || this.healNumbers[j] !== this.future[i - j].heal) {
						sequenceMatch = false;
						break;
					}
				}
				if (sequenceMatch) {
					this.past = this.future.splice(0, i + 1).splice(-this.healNumbers.length, this.healNumbers.length);
					for (let j = 0; j < i + 1; j++) {
						this.__futurePush(this.mt.genRand());
					}
					if (this.past.length > this.healNumbers.length) {
						this.past = this.past.splice(-this.healNumbers.length, this.healNumbers.length);
					}
					return true;
				}
			}
			this.past = [];
			this.future.splice(0, this.future.length - this.healNumbers.length);
			for (let i = 0; i < this.defaultLength; i++) {
				this.__futurePush(this.mt.genRand());
			}
		}
		return false;
	}

	/**
	 * Advances RNG for certain positions
	 * @param {Number} number (default 1)
	 */
	advance(number = 1) {
		for (let i = 0; i < number; i++) {
			this.healNumbers.push(this.future[0].heal);
			this.past.push(this.future.shift());
			this.__futurePush(this.mt.genRand());
		}
	}

	/**
	 * Advances defaultLength amount of RNG intially
	 */
	__initialFuture() {
		for (let i = 0; i < this.defaultLength; i++) {
			this.__futurePush(this.mt.genRand());
		}
	}

	/**
	 * Calculates and pushes a new set of RNG into the future array
	 * @param {Number} random
	 */
	__futurePush(random) {
		this.future.push({
			position: this.position++,
			random,
			heal: this.heal.calculate(random)
		});
	}
};
