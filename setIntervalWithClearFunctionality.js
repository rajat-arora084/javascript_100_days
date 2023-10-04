class TimerClass {
  static ids = new Object();
  static addId(id) {
    if (Object.keys(TimerClass.ids).includes(id)) {
      return -1;
    }
    TimerClass.ids[id] = true;
    return 1;
  }
}

class SetIntervalPolyfill {
  generatorFunction() {
    let id = Math.floor(Math.random() * 10000000000);
    let ans = TimerClass.addId(id);
    return ans == 1 ? id : this.generatorFunction();
  }

  constructor(delay, callbackFn, args = []) {
    this.id = this.generatorFunction();
    this.startTime = new Date();
    this.startInterval(delay, callbackFn, args, this.startTime);
  }

  startInterval(delay, callbackFn, args = [], prvsExecution) {
    let currentDate = new Date();
    while (prvsExecution.getTime() == currentDate.getTime())
      currentDate = new Date();
    if (
      currentDate.getTime() >= this.startTime.getTime() + delay &&
      Object.keys(TimerClass.ids).includes(String(this.id))
    ) {
      callbackFn(...args);
      let newPrvsExecution = new Date();
      this.startTime = newPrvsExecution;
      this.startInterval(delay, callbackFn, args, newPrvsExecution); // restart the timer
    } else {
      requestIdleCallback(() =>
        this.startInterval(delay, callbackFn, args, currentDate)
      );
    }
  }

  static clearTimer(id) {
    if (Object.keys(TimerClass.ids).includes(String(id)))
      delete TimerClass.ids[String(id)];
  }
}

const newTimeout = new SetIntervalPolyfill(
  3000,
  () => console.log("hi after 3 seconds"),
  []
);

const newTimeout2 = new SetIntervalPolyfill(
  1000,
  () => console.log("hi after 1 seconds"),
  []
);

SetIntervalPolyfill.clearTimer(newTimeout.id);

let i = 1;
while (i < 10000000) {
  i++;
}
console.log(i);
