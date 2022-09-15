import { watchable } from "./util";
import { swifty } from "./swifty";
import { Bindable, Listen } from "./types";

interface TimerConfig {
  date?: Date;
  interval?: number;
  repeats?: boolean;
  block?(t: TimerClass): void;
}
class TimerClass {
  _cancel?: NodeJS.Timeout;
  _bind: Bindable<this>;
  _running = false;
  public userInfo: any;
  public isValid = true;
  public fireDate?;
  public get timeInterval() {
    return this.config.interval;
  }

  constructor(private config: TimerConfig) {
    this._bind = watchable(this);
    if (config.block) {
      this._bind.sink(config.block);
    }
    if (config.date) {
      this.fireDate = config.date;
      const delta = config.date.getTime() - Date.now();
      if (delta > 0) {
        this._cancel = setTimeout(this._start, delta);
      }
    }
  }
  autoconnect = () => {
    this.fireDate = new Date();
    setTimeout(this._start, 0);
    return this;
  };
  _start = () => {
    this.fire();
    if (this.config.repeats && this.config.interval) {
      this._cancel = setInterval(this.fire, this.config.interval * 1000);
    } else {
      this.isValid = false;
    }
  };

  invalidate = () => {
    clearTimeout(this._cancel);
    this.isValid = false;
  };

  fire = () => {
    if (this.config.interval && this.config.repeats) {
      this.fireDate = new Date(Date.now() + this.config.interval * 1000);
    }
    if (this.isValid) this._bind(this);
  };

  sink(listener: Listen<this>) {
    return this._bind.sink(listener);
  }
  static publish(interval: number) {
    return Timer({
      interval,
      repeats: true,
    });
  }
}

export const Timer = swifty(TimerClass);
