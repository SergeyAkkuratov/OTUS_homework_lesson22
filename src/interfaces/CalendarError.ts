export default class CalendarError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "CalendarError";
    }
  }