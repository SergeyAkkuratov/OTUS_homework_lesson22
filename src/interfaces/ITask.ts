// eslint-disable-next-line no-shadow
export enum TaskStatus {
  NEW,
  STARTED,
  FINISHED,
  CANCELED,
}

export interface Task {
  id: string | undefined;
  date: Date;
  name: string;
  status: TaskStatus;
  tags: string[];
  description: string;
}
