const MersenneTwiester = require('./class/mersenne-twister');
const HealCalculator = require('./class/heal-calculator');

const rngPs2 = new MersenneTwiester(false);
const calcCure = new HealCalculator('cure', 3, 23, false);

const DEFAULT_LENGTH = 10;

let cureNumbers = [];
let past = [];
let future = [];

// Make initial future table
for (let i = 0; i < DEFAULT_LENGTH; i++) {
	const random = rngPs2.genRand();
	future.push({
		position: i,
		heal: calcCure.calculate(random),
		percent: (random % 100) + 1
	});
}
console.log('default:');
console.log(future);

findPosition(91);
findPosition(88);
findPosition(86);

function findPosition(input) {
	// Validate heal amount and reset if it's false
	if (!calcCure.validNumber(input)) {
		console.log('Invalid number');
		cureNumbers = [];
		return;
	}
	// Reverse order for convinience
	cureNumbers.unshift(input);
	// If input number is next number, just move 1 up
	if (cureNumbers[0] === future[0].heal) {
		past.push(future.shift());
		const random = rngPs2.genRand();
		future.push({
			position: future[future.length - 1].position + 1,
			heal: calcCure.calculate(random),
			percent: (random % 100) + 1
		});
		console.log('>>>>>>>>found it<<<<<<<<');
		console.log('Past:');
		console.log(past);
		console.log('Future:');
		console.log(future);
	} else {
		let found = false;
		// Try to find cure number in the existing array.
		for (let j = 1; j < future.length; j++) {
			if (cureNumbers[0] === future[j].heal) {
				// Found the number in existing array at j
				// Checks if sequense matches
				let sequenceMatch = true;
				for (let i = 1; i < cureNumbers.length && j - i >= 0; i++) {
					if (cureNumbers[i] !== future[j - i].heal) {
						sequenceMatch = false;
						break;
					}
				}
				if (sequenceMatch) {
					// Then move the items in future to past, and add more items
					for (let i = 0; i < j + 1; i++) {
						past.push(future.shift());
						if (past.length > cureNumbers.length) {
							past.shift();
						}
						const random = rngPs2.genRand();
						future.push({
							position: future[future.length - 1].position + 1,
							heal: calcCure.calculate(random),
							percent: (random % 100) + 1
						});
					}
					found = true;
					console.log('>>>>>>>>found it<<<<<<<<');
					console.log('Past:');
					console.log(past);
					console.log('Future:');
					console.log(future);
					break;
				}
			}
		}

		// Couldn't find the number in the existing array
		while (!found) {
			const position = future[future.length - 1].position + 1;
			past = [];
			future = future.splice(-cureNumbers.length + 1, cureNumbers.length - 1);
			// Make initial table
			for (let i = 0; future.length <= DEFAULT_LENGTH; i++) {
				const random = rngPs2.genRand();
				future.push({
					position: position + i,
					heal: calcCure.calculate(random),
					percent: (random % 100) + 1
				});
			}
			// If input number is next number, just move 1 up
			if (cureNumbers[0] === future[0].heal) {
				past.push(future.shift());
				const random = rngPs2.genRand();
				future.push({
					position: future[future.length - 1].position + 1,
					heal: calcCure.calculate(random),
					percent: (random % 100) + 1
				});
				found = true;
				console.log('>>>>>>>>found it<<<<<<<<');
				console.log('Past:');
				console.log(past);
				console.log('Future:');
				console.log(future);
			} else {
				// Try to find cure number in the existing array.
				for (let j = 1; j < future.length; j++) {
					if (cureNumbers[0] === future[j].heal) {
						// Found the number in existing array at j
						// Checks if sequense matches
						let sequenceMatch = true;
						for (let i = 1; i < cureNumbers.length; i++) {
							if (j - i >= 0 || cureNumbers[i] !== future[j - i].heal) {
								sequenceMatch = false;
								break;
							}
						}
						if (sequenceMatch) {
							// Then move the items in future to past, and add more items
							for (let i = 0; i < j + 1; i++) {
								past.push(future.shift());
								if (past.length > cureNumbers.length) {
									past.shift();
								}
								const random = rngPs2.genRand();
								future.push({
									position: future[future.length - 1].position + 1,
									heal: calcCure.calculate(random),
									percent: (random % 100) + 1
								});
							}
							found = true;
							console.log('>>>>>>>>found it<<<<<<<<');
							console.log('Past:');
							console.log(past);
							console.log('Future:');
							console.log(future);
							break;
						}
					}
				}
			}
		}
	}
}
