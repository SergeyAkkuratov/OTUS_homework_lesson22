import { Task } from "./ITask";

export interface Filter<T extends Task> {
  (element: T, ...params: never[]): boolean;
}

export interface Filters<T extends Task> {
  byDate: Filter<T>;
  byDateBetween: Filter<T>;
  byName: Filter<T>;
  byNameContains: Filter<T>;
  byStatus: Filter<T>;
  byTag: Filter<T>;
  byTagContains: Filter<T>;
  byDescription: Filter<T>;
  byDescriptionContains: Filter<T>;
}
