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
      throw new CalendarError(
        `Couldn't create Calendar object, there is no data with namespace: ${namespace}`,
      );
    }
  }

  async getTask(id: string): Promise<ITask> {
    return new Promise<ITask>((resolve, reject) => {
      const result = this.tasks.find((task) => task.id === id);
      if (result) {
        resolve(result);
      } else {
        reject(new CalendarError(`There is no task with id: ${id}`));
      }
    });
  }

  async addTask(task: ITask): Promise<void> {
    return new Promise<void>((resolve) => {
      this.tasks.push(task);
      this.localStorageUpdate();
      resolve();
    });
  }

  async updateTask(id: string, newTask: ITask): Promise<ITask> {
    return new Promise<ITask>((resolve, reject) => {
      this.getTask(id)
        .then((task) => {
          resolve(task);
          this.tasks[this.tasks.indexOf(task)] = newTask;
          this.localStorageUpdate();
        })
        .catch((error) => reject(error));
    });
  }

  async deleteTask(id: string): Promise<ITask> {
    return new Promise<ITask>((resolve, reject) => {
      this.getTask(id)
        .then((task) => {
          resolve(task);
          this.tasks.splice(this.tasks.indexOf(task));
          this.localStorageUpdate();
        })
        .catch((error) => reject(error));
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
