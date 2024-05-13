// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  get,
  DatabaseReference,
  child,
  update,
  remove
} from "firebase/database";
import { ITask } from "../interfaces/ITask";
import ICalendar, { defaultFilters } from "../interfaces/ICalendar";
import { IFilters, IFilter } from "../interfaces/IFilter";
import CalendarError from "../interfaces/CalendarError";

export default class Calendar implements ICalendar<ITask> {
  private readonly namespace: string;

  private database: DatabaseReference;

  readonly filters: IFilters<ITask> = defaultFilters;

  private readonly firebaseConfig = {
    apiKey: "AIzaSyBmPq0iWICIbr5Z2WKZ5pcpQo_ND8uuWM4",
    authDomain: "akkuratovcalendar.firebaseapp.com",
    projectId: "akkuratovcalendar",
    storageBucket: "akkuratovcalendar.appspot.com",
    messagingSenderId: "378993322495",
    appId: "1:378993322495:web:0abd7266c4062c67c21fca",
    databaseURL:
      "https://akkuratovcalendar-default-rtdb.europe-west1.firebasedatabase.app",
  };

  constructor(namespace: string) {
    this.namespace = namespace;
    this.database = ref(getDatabase(initializeApp(this.firebaseConfig)), this.namespace);
  }

  async getTask(id: string): Promise<ITask> {
    return new Promise<ITask>((resolve) => {
      get(child(this.database, id)).then((snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          throw new CalendarError(`There is no task with id ${id}`);
        }
      });
    });
  }

  async addTask(task: ITask): Promise<void> {
    set(child(this.database, task.id), task);
  }

  async updateTask(id: string, newTask: ITask): Promise<ITask> {
    const oldTask = await this.getTask(id);

    await update(this.database, { [`/${this.namespace}/${newTask.id}`]: newTask });

    return new Promise<ITask>((resolve) => {
      resolve(oldTask);
    });
  }

  async deleteTask(id: string): Promise<ITask> {
    const oldTask = await this.getTask(id);

    await remove(child(this.database, id));

    return new Promise<ITask>((resolve) => {
      resolve(oldTask);
    });
  }

  async filterTasks(
    filter: IFilter<ITask>,
    ...param: unknown[]
  ): Promise<ITask[]> {
    return new Promise<ITask[]>((resolve) => {
      get(this.database).then((snapshot) => {
        if (snapshot.exists()) {
          const tasks: ITask[] = [];
          Object.keys(snapshot.val()).forEach(key => {
            tasks.push(snapshot.val()[key]);
          }
          )
          const result = tasks.filter((task) => filter(task, ...param));
          if (result) {
            resolve(result);
          } else {
            throw new CalendarError("Unknown error while filtering tasks");
          }
        } else {
          throw new CalendarError(`There is no tasks at all`);
        }
      });
    });
  }
}
