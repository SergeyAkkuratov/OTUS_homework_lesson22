import { Filter, Filters } from "./IFilter";
import { Task, TaskStatus } from "./ITask";

export const defaultFilters: Filters<Task> = {
  byDate: (element: Task, date: Date) => element.date === date,
  byDateBetween: (element: Task, start: Date, end: Date) =>
    element.date >= start && element.date <= end,
  byName: (element: Task, name: string) => element.name === name,
  byNameContains: (element: Task, name: string) => element.name.includes(name),
  byStatus: (element: Task, status: TaskStatus) => element.status === status,
  byTag: (element: Task, tags: string[]) => element.tags === tags,
  byTagContains: (element: Task, tag: string) => element.tags.includes(tag),
  byDescription: (element: Task, text: string) => element.description === text,
  byDescriptionContains: (element: Task, text: string) =>
    element.description.includes(text),
};

export default interface ICalendar<T extends Task> {
  getTask(id: string): T;
  addTask(task: T): void;
  updateTask(id: string, newTask: T): T;
  deleteTask(id: string): T;
  filterTasks(filter: Filter<T>): T[];
  filters: Filters<T>;
}
