import { ITask, TaskStatus } from "./ITask";
import { defaultFilters } from "./ICalendar";

describe("Default filters checks", () => {
  const date1: string = "2024-05-13T15:10:27.862Z";
  const date2: string = "2024-05-14T15:10:27.862Z";
  const task1: ITask = {
    id: "ID_1",
    date: date1,
    name: "TEST1",
    status: TaskStatus.NEW,
    tags: ["tag1", "tag2"],
    description: "It's a test task number 1",
  };
  const task2: ITask = {
    id: "ID_2",
    date: date2,
    name: "TEST2",
    status: TaskStatus.STARTED,
    tags: ["tag1", "tag3"],
    description: "It's a test task number 2",
  };
  let tasks: ITask[];

  beforeEach(() => {
    tasks = [task1, task2];
  });

  it("Check byName and byNameContains filter", () => {
    expect(
      tasks.filter((task) => defaultFilters.byName(task, task1.name)),
    ).toStrictEqual([task1]);
    expect(
      tasks.filter((task) => defaultFilters.byNameContains(task, "TEST")),
    ).toStrictEqual([task1, task2]);
  });

  it("Check byDate and byDateBetween filter", () => {
    expect(
      tasks.filter((task) => defaultFilters.byDate(task, date1)),
    ).toStrictEqual([task1]);
    expect(
      tasks.filter((task) => defaultFilters.byDate(task, new Date(date1))),
    ).toStrictEqual([task1]);

    const start = new Date(date1);
    start.setDate(start.getDate() - 1);

    const end = new Date(date2);
    end.setDate(end.getDate() + 1);
    expect(
      tasks.filter((task) => defaultFilters.byDateBetween(task, start, end)),
    ).toStrictEqual([task1, task2]);
  });

  it("Check byStatus filter", () => {
    const task3: ITask = structuredClone(task1);
    task3.status = TaskStatus.FINISHED;
    tasks.push(task3);
    const task4: ITask = structuredClone(task1);
    task4.status = TaskStatus.CANCELED;
    tasks.push(task4);

    expect(
      tasks.filter((task) => defaultFilters.byStatus(task, TaskStatus.NEW)),
    ).toStrictEqual([task1]);
    expect(
      tasks.filter((task) => defaultFilters.byStatus(task, TaskStatus.STARTED)),
    ).toStrictEqual([task2]);
    expect(
      tasks.filter((task) =>
        defaultFilters.byStatus(task, TaskStatus.FINISHED),
      ),
    ).toStrictEqual([task3]);
    expect(
      tasks.filter((task) =>
        defaultFilters.byStatus(task, TaskStatus.CANCELED),
      ),
    ).toStrictEqual([task4]);
  });

  it("Check byTag and byTagContains filters", () => {
    expect(
      tasks.filter((task) => defaultFilters.byTag(task, ["tag1", "tag2"])),
    ).toStrictEqual([task1]);
    expect(
      tasks.filter((task) => defaultFilters.byTagContains(task, "tag1")),
    ).toStrictEqual([task1, task2]);
  });

  it("check byDescription and byDescriptionContains filters", () => {
    expect(
      tasks.filter((task) =>
        defaultFilters.byDescription(task, "It's a test task number 1"),
      ),
    ).toStrictEqual([task1]);
    expect(
      tasks.filter((task) =>
        defaultFilters.byDescriptionContains(task, "It's a test task number"),
      ),
    ).toStrictEqual([task1, task2]);
  });
});
