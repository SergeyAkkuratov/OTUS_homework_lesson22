// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  get,
  DatabaseReference,
  child
} from "firebase/database";
import { ITask } from "../interfaces/ITask";
import ICalendar, { defaultFilters } from "../interfaces/ICalendar";
import { IFilters, IFilter } from "../interfaces/IFilter";
import CalendarError from "../interfaces/CalendarError";

const firebaseConfig = {
  apiKey: "AIzaSyBmPq0iWICIbr5Z2WKZ5pcpQo_ND8uuWM4",
  authDomain: "akkuratovcalendar.firebaseapp.com",
  projectId: "akkuratovcalendar",
  storageBucket: "akkuratovcalendar.appspot.com",
  messagingSenderId: "378993322495",
  appId: "1:378993322495:web:0abd7266c4062c67c21fca",
  databaseURL:
    "https://akkuratovcalendar-default-rtdb.europe-west1.firebasedatabase.app",
};

export default class Calendar implements ICalendar<ITask> {
  private database: DatabaseReference;

  readonly filters: IFilters<ITask> = defaultFilters;

  constructor(namespace: string) {
    this.database = ref(getDatabase(initializeApp(firebaseConfig)), namespace);
  }

  async getTask(id: string): Promise<ITask> {
    return new Promise<ITask>((resolve) => {
      get(child(this.database, id)).then((snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        }
        throw new CalendarError(`There is no task with id ${id}`);
      }).catch((error) => {
        throw new CalendarError(`Couldn't get information from remote Database. Error: ${error}`);
      });
    });
  }

  async addTask(task: ITask): Promise<void> {
    set(child(this.database, task.id), task);
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
