const FindPosition = require('./class/find-position');
const ChestValidation = require('./class/chest-validation');

const chest = new ChestValidation({fixedGil: true});
const output = ['position', 'heal', 'appears', 'content'];
const futureAmount = 10;

class ChestFinder extends FindPosition {
  calcChestContent() {
    for (let i = 0; i < this.future.length - 1; i++) {
      if (this.future[i].content === 'gil') {
        this.future[i].content = chest.gilAmount(this.future[i + 1].random) + ' gil';
      } else {
        this.future[i].content = chest.itemContent(this.future[i + 1].percent);
      }
    }
  }

  __futurePush(random) {
    const percent = random % 100;
    this.future.push({
      position: this.position++,
      heal: this.heal.calculate(random),
      percent,
      appears: chest.ifAppears(percent),
      content: chest.isGil(percent) ? 'gil' : 'item',
      random
    });
  }

  returnPast() {
    return this.past.map(currentValue => {
      const result = [];
      output.forEach(element => {
        result.push(currentValue[element]);
      }, this);
      return result;
    });
  }

  returnFuture() {
    const result = [];
    for (let i = 0; i < futureAmount; i++) {
      const resultItem = [];
      output.forEach(element => {
        resultItem.push(this.future[i][element]);
      }, this);
      result.push(resultItem);
    }
    return result;
  }
}
const positionFinder = new ChestFinder();

const startTime = Date.now();
positionFinder.find(90);
positionFinder.find(90);
positionFinder.find(90);
positionFinder.find(90);
positionFinder.calcChestContent();
console.log(positionFinder.returnPast());
console.log(positionFinder.returnFuture());
console.log(Date.now() - startTime);
