import CalendarError from "../interfaces/CalendarError";
import ICalendar, { defaultFilters } from "../interfaces/ICalendar";
import { IFilter, IFilters } from "../interfaces/IFilter";
import { ITask } from "../interfaces/ITask";

export default class Calendar implements ICalendar<ITask> {
  private tasks: ITask[];

  private namespace: string;

  readonly filters: IFilters<ITask> = defaultFilters;

  constructor(namespace: string) {
    this.namespace = namespace;
    const data = localStorage.getItem(namespace);
    if (data) {
      try {
        this.tasks = JSON.parse(data);
      } catch (err) {
        throw new CalendarError(
          `Couldn't create Calendar object, error: ${err}`,
        );
      }
    } else {
      this.tasks = [];
    }
  }

  async getTask(id: string): Promise<ITask> {
    return new Promise<ITask>((resolve) => {
      const result = this.tasks.find((task) => task.id === id);
      if (result) {
        resolve(result);
      } else {
        throw new CalendarError(`There is no task with id: ${id}`);
      }
    });
  }

  async getTasks(): Promise<ITask[]> {
    return new Promise<ITask[]>((resolve) => {
      resolve(this.tasks);
    });
  }

  async addTask(task: ITask): Promise<void> {
    return new Promise<void>((resolve) => {
      this.tasks.push(task);
      this.localStorageUpdate();
      resolve();
    });
  }

  async updateTask(id: string, task: ITask): Promise<ITask> {
    const oldTask = await this.getTask(id);
    return new Promise<ITask>((resolve) => {
      const newTask: ITask = structuredClone(task);
      newTask.id = oldTask.id;
      this.tasks[this.tasks.indexOf(oldTask)] = newTask;
      this.localStorageUpdate();
      resolve(oldTask);
    });
  }

  async deleteTask(id: string): Promise<ITask> {
    const oldTask = await this.getTask(id);
    return new Promise<ITask>((resolve) => {
      this.tasks.splice(this.tasks.indexOf(oldTask), 1);
      this.localStorageUpdate();
      resolve(oldTask);
    });
  }

  async filterTasks(
    filter: IFilter<ITask>,
    ...param: never[]
  ): Promise<ITask[]> {
    return new Promise<ITask[]>((resolve, reject) => {
      const result = this.tasks.filter((task) => filter(task, ...param));
      if (result) {
        resolve(result);
      } else {
        reject(new CalendarError("Unknown error while filtering tasks"));
      }
    });
  }

  async localStorageUpdate(): Promise<void> {
    return new Promise<void>((resolve) => {
      localStorage.setItem(this.namespace, JSON.stringify(this.tasks));
      resolve();
    });
  }
}
