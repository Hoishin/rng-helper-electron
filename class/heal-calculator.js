'use strict';

module.exports = class HealCalculator {
	constructor(spell = 'cure', level = 3, magick = 23, serenity = false) {
		switch (spell) {
			case 'cure':
				this.spell = 20;
				break;
			default:
				this.spell = 20;
				break;
		}
		this.level = level;
		this.magick = magick;
		this.serenity = serenity ? 1.5 : 1;
	}
	calculate(random = 1288459236) {
		const result = (this.spell + (random % (this.spell * 12.5) / 100)) *
			(((this.level + this.magick) * (this.magick / 256)) + 2) * this.serenity;
		return Math.floor(result);
	}
	validNumber(heal) {
		const minValue = this.calculate(0);
		const maxValue = this.calculate(2147483647);
		if (heal < minValue || heal > maxValue) {
			return false;
		}
		return true;
	}
};
