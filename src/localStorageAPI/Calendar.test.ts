import { ITask, TaskStatus } from "../interfaces/ITask";
import Calendar from "./Calendar"

describe("Test for checking LocalStorage API", () => {
    const testNamesapce: string = "TEST";
    let calendar: Calendar;
    let testTask: ITask;

    beforeEach(() => {
        localStorage.clear();
        calendar = new Calendar(testNamesapce);
        testTask = {
            id: "TEST",
            date: new Date().toISOString(),
            name: "TEST",
            status: TaskStatus.NEW,
            tags: ["test1", "test2"],
            description: "It just a test task"
        }
    })

    it("Check constructor, getTask, addTask", async () => {
        expect(calendar).toBeInstanceOf(Calendar);
        await calendar.addTask(testTask);

        const calendar2 = new Calendar(testNamesapce);
        const currentTask = await calendar2.getTask("TEST");
        expect(currentTask).toStrictEqual(testTask);
    })

})