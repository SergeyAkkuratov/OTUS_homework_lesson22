import Calendar from "./firebaseAPI/Calendar";
import { ITask, TaskStatus } from "./interfaces/ITask";
import "./style.css";

const newTask: ITask = {
  id: crypto.randomUUID(),
  date: new Date().toISOString(),
  name: "TEST2",
  status: TaskStatus.NEW,
  tags: ["tag3"],
  description: "For filtering"
};

async function run() {
  const calendar: Calendar = new Calendar("tasks");
  await calendar.addTask(newTask);
  const currentTask: ITask = await calendar.getTask(newTask.id);
  console.log(currentTask);
  const tasks: ITask[] = await calendar.filterTasks(calendar.filters.byTagContains, "tag3")
  console.log(tasks);
  const deleteTask = await calendar.deleteTask(newTask.id);
  console.log(deleteTask);
}

run();
