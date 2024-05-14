import { ITask } from "./ITask";

export interface IFilter<T extends ITask> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (element: T, ...params: any[]): boolean;
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
