import Calendar from "./firebaseAPI/Calendar";
import { ITask, TaskStatus } from "./interfaces/ITask";
import "./style.css";

const newTask: ITask = {
  id: crypto.randomUUID(),
  date: new Date(),
  name: "TEST2",
  status: TaskStatus.NEW,
  tags: ["tag3"],
  description: "For filtering"
};

async function run() {
  const calendar: Calendar = new Calendar("tasks");
  const task: ITask = await calendar.getTask("47fb091c-a676-4462-88ca-dc57508a09e9");
  console.log(task);
  await calendar.addTask(newTask);
  const tasks: ITask[] = await calendar.filterTasks(calendar.filters.byTagContains, "tag3")
  console.log(tasks);
  const deleteTask = await calendar.deleteTask(newTask.id);
  console.log(deleteTask);
}

run();
