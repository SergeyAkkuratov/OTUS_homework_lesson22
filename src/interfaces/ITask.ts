// eslint-disable-next-line no-shadow
export enum TaskStatus {
  NEW,
  STARTED,
  FINISHED,
  CANCELED,
}

export interface ITask {
  id: string;
  date: string;
  name: string;
  status: TaskStatus;
  tags: string[];
  description: string;
}
