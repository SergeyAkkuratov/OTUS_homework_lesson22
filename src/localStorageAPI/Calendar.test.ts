import CalendarError from "../interfaces/CalendarError";
import { ITask, TaskStatus } from "../interfaces/ITask";
import Calendar from "./Calendar";

describe("Test for checking LocalStorage API", () => {
  const testNamesapce: string = "TEST";
  let calendar: Calendar;
  let testTask: ITask;
  let testTask2: ITask;

  beforeEach(() => {
    localStorage.clear();
    calendar = new Calendar(testNamesapce);
    testTask = {
      id: "ID1",
      date: new Date().toISOString(),
      name: "TEST",
      status: TaskStatus.NEW,
      tags: ["test1", "test2"],
      description: "It just a test task",
    };

    testTask2 = {
      id: "TEST2",
      date: new Date().toISOString(),
      name: "TEST2",
      status: TaskStatus.STARTED,
      tags: ["test1", "test3"],
      description: "It just a test task",
    };
  });

  it("Check constructor, getTask and addTask methods", async () => {
    expect(calendar).toBeInstanceOf(Calendar);
    await calendar.addTask(testTask);

    const calendar2 = new Calendar(testNamesapce);
    const currentTask = await calendar2.getTask(testTask.id);
    expect(currentTask).toStrictEqual(testTask);

    localStorage.setItem("TEST_ERROR", "NOT A JSON STRING");
    expect(() => new Calendar("TEST_ERROR")).toThrow(
      new CalendarError(
        "Couldn't create Calendar object, error: SyntaxError: Unexpected token N in JSON at position 0",
      ),
    );
  });

  it("Check getTask method with errors", async () => {
    await expect(calendar.getTask("ERROR")).rejects.toThrow(
      new CalendarError("There is no task with id: ERROR"),
    );
  });

  it("Check updateTask method", async () => {
    await calendar.addTask(testTask);

    const oldTask = await calendar.updateTask(testTask.id, testTask2);
    testTask2.id = testTask.id;
    const currentTask = await calendar.getTask(testTask2.id);

    expect(oldTask).toStrictEqual(testTask);
    expect(currentTask).toEqual(testTask2);
  });

  it("Check deleteTask method", async () => {
    await calendar.addTask(testTask);
    await calendar.addTask(testTask2);
    const oldTask = await calendar.deleteTask(testTask.id);
    const tasks = await calendar.getTasks();
    expect(oldTask).toStrictEqual(testTask);
    expect(tasks).toStrictEqual([testTask2]);
  });

  it("Check filterTasks method", async () => {
    await calendar.addTask(testTask);
    await calendar.addTask(testTask2);

    const tasks: ITask[] = await calendar.filterTasks(
      calendar.filters.byName,
      "TEST",
    );
    expect(tasks).toStrictEqual([testTask]);
  });

  it("Check clear method", async () => {
    await calendar.addTask(testTask);
    await expect(calendar.getTasks()).resolves.toStrictEqual([testTask]);
    await calendar.clear();
    await expect(calendar.getTasks()).resolves.toStrictEqual([]);
  });
});
