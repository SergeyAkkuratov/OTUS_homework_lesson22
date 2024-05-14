import { IFilter, IFilters } from "./IFilter";
import { ITask, TaskStatus } from "./ITask";

export const defaultFilters: IFilters<ITask> = {
  byDate: (element: ITask, date: Date | string) => {
    if (date instanceof Date) {
      return new Date(element.date).getTime() === date.getTime();
    }
    return element.date === date;
  },
  byDateBetween: (element: ITask, start: Date, end: Date) => {
    const elementDate = new Date(element.date);
    return elementDate >= start && elementDate <= end;
  },
  byName: (element: ITask, name: string) => element.name === name,
  byNameContains: (element: ITask, name: string) => element.name.includes(name),
  byStatus: (element: ITask, status: TaskStatus) => element.status === status,
  byTag: (element: ITask, tags: string[]) =>
    JSON.stringify(element.tags) === JSON.stringify(tags),
  byTagContains: (element: ITask, tag: string) => element.tags.includes(tag),
  byDescription: (element: ITask, text: string) => element.description === text,
  byDescriptionContains: (element: ITask, text: string) =>
    element.description.includes(text),
};

export default interface ICalendar<T extends ITask> {
  filters: IFilters<T>;
  getTask(id: string): Promise<T>;
  getTasks(): Promise<ITask[]>;
  addTask(task: T): Promise<void>;
  updateTask(id: string, newTask: T): Promise<T>;
  deleteTask(id: string): Promise<T>;
  filterTasks(filter: IFilter<T>, ...param: unknown[]): Promise<T[]>;
  clear(): Promise<void>;
}
