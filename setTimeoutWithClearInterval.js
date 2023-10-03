class SetTimeoutPolyfill {
  static ids = new Object();
  static addId(id) {
    if (Object.keys(SetTimeoutPolyfill.ids).includes(id)) {
      return -1;
    }
    SetTimeoutPolyfill.ids[id] = true;
    return 1;
  }

  generatorFunction() {
    let id = Math.floor(Math.random() * 10000000000);
    let ans = SetTimeoutPolyfill.addId(id);
    return ans == 1 ? id : this.generatorFunction();
  }
  constructor(delay, callbackFn, args = []) {
    this.id = this.generatorFunction();
    this.startTime = new Date();
    this.startTimer(delay, callbackFn, args, this.startTime);
  }

  startTimer(delay, callbackFn, args = [], prvsExecution) {
    let currentDate = new Date();
    while (prvsExecution.getTime() == currentDate.getTime())
      currentDate = new Date();
    if (
      currentDate.getTime() >= this.startTime.getTime() + delay &&
      Object.keys(SetTimeoutPolyfill.ids).includes(String(this.id))
    )
      return callbackFn(...args);
    else
      return requestIdleCallback(() =>
        this.startTimer(delay, callbackFn, args, currentDate)
      );
  }

  static clearTimer(id) {
    if (Object.keys(SetTimeoutPolyfill.ids).includes(String(id)))
      delete SetTimeoutPolyfill.ids[String(id)];
  }
}

const newTimeout = new SetTimeoutPolyfill(
  3000,
  () => console.log("hi after 3 seconds"),
  []
);

const newTimeout2 = new SetTimeoutPolyfill(
  1000,
  () => console.log("hi after 1 seconds"),
  []
);

console.log("all ids", SetTimeoutPolyfill.ids);
SetTimeoutPolyfill.clearTimer(newTimeout2.id);

let i = 1;
while (i < 10000000) {
  i++;
}
console.log(i);
