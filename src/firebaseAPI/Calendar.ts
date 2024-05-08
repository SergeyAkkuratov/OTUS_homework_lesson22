// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  get,
  DatabaseReference,
} from "firebase/database";
import { ITask } from "../interfaces/ITask";
import ICalendar, { defaultFilters } from "../interfaces/ICalendar";
import { IFilters, IFilter } from "../interfaces/IFilter";
import CalendarError from "../interfaces/CalendarError";

export default class Calendar implements ICalendar<ITask> {
  private tasks!: ITask[];

  private namespace: string;

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

  public static async build(namespace: string): Promise<Calendar> {
    const calendar = new Calendar(namespace);
    calendar.init();
    return calendar;
  }

  private constructor(namespace: string) {
    this.namespace = namespace;
    this.database = ref(
      getDatabase(initializeApp(this.firebaseConfig)),
      this.namespace,
    );
  }

  private async init() {
    get(this.database)
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log("3");
          this.tasks = snapshot.val();
        } else {
          throw new CalendarError(
            `There is no reference with namespace "${this.namespace}" in database.`,
          );
        }
      })
      .catch((error) => {
        throw new CalendarError(
          `Couldn't read data from Firebase database with error: ${error}`,
        );
      });
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
      this.firebaseUpdate();
      resolve();
    });
  }

  async updateTask(id: string, newTask: ITask): Promise<ITask> {
    return new Promise<ITask>((resolve, reject) => {
      this.getTask(id)
        .then((task) => {
          resolve(task);
          this.tasks[this.tasks.indexOf(task)] = newTask;
          this.firebaseUpdate();
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
          this.firebaseUpdate();
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

  async firebaseUpdate(): Promise<void> {
    return new Promise<void>((resolve) => {
      set(this.database, this.tasks);
      resolve();
    });
  }
}
