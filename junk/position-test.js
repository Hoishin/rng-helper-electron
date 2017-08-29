'use strict';

const MersenneTwister = require('./class/mersenne-twister');
const HealCalculator = require('./class/heal-calculator');

const rngPs2 = new MersenneTwister(false);
const calcCure = new HealCalculator('cure', 3, 23, false);
const DEFAULT_LENGTH = 10000; // Number of RNG you want to hold in memory
let position = 0; // Tracks where RNG is at
const healNumbers = []; // Holds heal numbers in reverse order
let past = []; // Holds RNGs right before the current RNG
const future = []; // Holds next DEFAULT_LENGTH of RNG

// Make initial future array
for (let i = 0; i < DEFAULT_LENGTH; i++) {
	generateRandom(rngPs2.genRand());
}

// Input heal numbers here
findPosition(90);
findPosition(91);
findPosition(91);
findPosition(89);
findPosition(80);
findPosition(92);
findPosition(92);
findPosition(92);
findPosition(92);
findPosition(92);

// Output position found
console.log(past);

// Main function that look for the position
function findPosition(input) {
	// Validate heal amount and ignore if it's invalid
	if (!calcCure.validNumber(input)) {
		console.log('Encountered Invalid Number: ' + input);
		return;
	}

	// Store heal numbers in reverse order because it's actually easier to handle
	healNumbers.unshift(input);

	// If heal number matches the next number, just move once
	if (healNumbers[0] === future[0].heal) {
		past.push(future.shift());
		generateRandom(rngPs2.genRand());
	} else {
		// Loop until it finds the position
		let found = false;
		while (!found) {
			// Look for the number in the future array
			for (let i = 0; i < future.length; i++) {
				let sequenceMatch = true;
				// Check if the sequence matches
				for (let j = 0; j < healNumbers.length; j++) {
					if (i - j < 0 || healNumbers[j] !== future[i - j].heal) {
						// Sequence doesn't match
						sequenceMatch = false;
						break;
					}
				}

				// Sequence matches
				if (sequenceMatch) {
					// Store RNGs up to the RNG it found
					past = future.splice(0, i + 1).splice(-healNumbers.length, healNumbers.length);
					// Generate RNGs to make up for the RNG spent to find the RNG
					for (let j = 0; j < i + 1; j++) {
						generateRandom(rngPs2.genRand());
					}
					// Cut off past array if it has more than how many heal numbers are
					if (past.length > healNumbers.length) {
						past = past.splice(-healNumbers.length, healNumbers.length);
					}
					found = true;
					break;
				}
			}

			// Couldn't find RNG in current future array
			// Refresh and load next future array and continue the loop
			if (!found) {
				past = [];
				future.splice(0, future.length - healNumbers.length);
				for (let i = 0; i < DEFAULT_LENGTH; i++) {
					generateRandom(rngPs2.genRand());
				}
			}
		}
	}
}

// Takes random number from Mersenne Twister, adds RNG to future array
function generateRandom(random) {
	future.push({
		position: position++,
		heal: calcCure.calculate(random),
		percent: (random % 100) - 1
	});
}
