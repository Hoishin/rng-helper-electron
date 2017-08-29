'use strict';

const MersenneTwister = require('./mersenne-twister');
const HealCalculator = require('./heal-calculator');

module.exports = class findPosition {
	constructor(option) {
		this.mt = new MersenneTwister(option.tza);
		this.heal = new HealCalculator(
			option.heal.spell,
			option.heal.level,
			option.heal.magick,
			option.heal.serenity
		);
		this.defaultLength = option.defaultLength;
		this.position = 0;
		this.healNumbers = [];
		this.past = [];
		this.future = [];
		this.__initialFuture();
	}

	find(input) {
		if (!this.heal.validNumber(input)) {
			return false;
		}
		this.healNumbers.unshift(input);
		if (this.healNumbers[0] === this.future[0].heal) {
			this.past.push(this.future.shift());
			this.__generateRandom(this.mt.genRand());
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
						this.__generateRandom(this.mt.genRand());
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
				this.__generateRandom(this.mt.genRand());
			}
		}
		return false;
	}

	advance(number = 1) {
		for (let i = 0; i < number; i++) {
			this.healNumbers.push(this.future[0].heal);
			this.past.push(this.future.shift());
			this.__generateRandom(this.mt.genRand());
		}
	}

	__initialFuture() {
		for (let i = 0; i < this.defaultLength; i++) {
			this.__generateRandom(this.mt.genRand());
		}
	}

	__generateRandom(random) {
		this.future.push({
			position: this.position++,
			heal: this.heal.calculate(random),
			percent: (random % 100) - 1
		});
	}
};
