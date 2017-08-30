const FindPosition = require('./class/find-position');

const positionFinder = new FindPosition({
	tza: false,
	heal: {
		spell: 'cure',
		level: 3,
		magick: 23,
		serenity: false
	},
	defaultLength: 100000
});

const startTime = Date.now();
positionFinder.find(90);
positionFinder.find(90);
positionFinder.find(90);
positionFinder.find(90);
positionFinder.find(90);
positionFinder.find(90);
console.log(positionFinder.past);
console.log(Date.now() - startTime);
