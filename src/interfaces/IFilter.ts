import { ITask } from "./ITask";

export interface IFilter<T extends ITask> {
  (element: T, ...params: unknown[]): boolean;
}

export interface IFilters<T extends ITask> {
  byDate: IFilter<T>;
  byDateBetween: IFilter<T>;
  byName: IFilter<T>;
  byNameContains: IFilter<T>;
  byStatus: IFilter<T>;
  byTag: IFilter<T>;
  byTagContains: IFilter<T>;
  byDescription: IFilter<T>;
  byDescriptionContains: IFilter<T>;
}
