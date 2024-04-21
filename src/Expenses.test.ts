/* eslint-disable no-nested-ternary */
import DatabaseTable from "./DatabaseTable";
import { Category, Expens, Expenses, SubCategory, defaultCategories, defaultSubCategories } from "./Expenses";

describe("Expenses class tests", () => {
    let expenses: Expenses;

    beforeEach(() => {
        expenses = new Expenses();
        localStorage.clear();
    });

    it("Check constructor", () => {
        expect(expenses.categories).toBeInstanceOf(DatabaseTable<Category>);
        expect(expenses.categories.name).toBe("categories");
        expect(expenses.categories.table).toStrictEqual(defaultCategories);
        expect(expenses.subCategories).toBeInstanceOf(DatabaseTable<SubCategory>);
        expect(expenses.subCategories.name).toBe("subCategories");
        expect(expenses.subCategories.table).toStrictEqual(defaultSubCategories);
        expect(expenses.records).toBeInstanceOf(DatabaseTable<Expens>);
        expect(expenses.records.name).toBe("expens");
        expect(expenses.records.table).toStrictEqual([]);
    });

    it("Check getExpensesByCategories funciton", () => {
        [
            { date: new Date(), sum: 1, subcategoriesId: 0, comment: "test" },
            { date: new Date(), sum: 2, subcategoriesId: 0 },
            { date: new Date(), sum: 3, subcategoriesId: 0, comment: "test" },
            { date: new Date(), sum: 4, subcategoriesId: 3 },
            { date: new Date(), sum: 5, subcategoriesId: 3, comment: "test" },
            { date: new Date(), sum: 6, subcategoriesId: 5 },
            { date: new Date(), sum: 7, subcategoriesId: 5, comment: "test" },
            { date: new Date(), sum: 9, subcategoriesId: 6 },
        ]
            .forEach(record => expenses.records.addItem(record));
        
        const expected = [
            { category: "Food", sum: 6 },
            { category: "Transport", sum: 9 },
            { category: "Entertainment", sum: 13 },
            { category: "Bills", sum: 9 },
        ];

        const start = new Date();
        start.setHours(0);
        const end = new Date();

        expect(expenses.getExpensesByCategories(start, end)).toStrictEqual(expected);

        expected.sort((a, b) => a.sum < b.sum ? -1 : a.sum > b.sum ? 1 : 0);
        expect(expenses.getExpensesByCategories(start, end, "asc")).toStrictEqual(expected);

        expected.sort((a, b) => a.sum < b.sum ? 1 : a.sum > b.sum ? -1 : 0);
        expect(expenses.getExpensesByCategories(start, end, "dsc")).toStrictEqual(expected);
    });

    it("Check getExpensesByDay funciton", () => {
        [
            { date: new Date("2024-01-01T04:00:00"), sum: 1, subcategoriesId: 0, comment: "test" },
            { date: new Date("2024-01-01T05:00:00"), sum: 1, subcategoriesId: 0, comment: "test" },
            { date: new Date("2024-01-02T04:00:00"), sum: 2, subcategoriesId: 0, comment: "test" },
            { date: new Date("2024-01-03T04:00:00"), sum: 3, subcategoriesId: 0, comment: "test" },
            { date: new Date("2024-01-04T04:00:00"), sum: 4, subcategoriesId: 0, comment: "test" },
            { date: new Date("2024-01-05T04:00:00"), sum: 5, subcategoriesId: 0, comment: "test" },
            { date: new Date("2024-01-05T05:00:00"), sum: 5, subcategoriesId: 0, comment: "test" },
        ].forEach(record => expenses.records.addItem(record));

        const expected = [
            {date: "2024-01-01", sum: 2},
            {date: "2024-01-02", sum: 2},
            {date: "2024-01-03", sum: 3},
            {date: "2024-01-04", sum: 4},
            {date: "2024-01-05", sum: 10},
        ];

        const start = new Date("2024-01-01T04:00:00");
        const end = new Date("2024-01-06T04:00:00");
        const received = expenses.getExpensesByDay(start, end);

        expect(received).toStrictEqual(expected);
    });

    it("Check getExpensesByFilter funciton", () => {
        [
            { date: new Date("2024-01-01T04:00:00"), sum: 1, subcategoriesId: 0, comment: "test" },
            { date: new Date("2024-01-01T05:00:00"), sum: 1, subcategoriesId: 0, comment: "true" },
            { date: new Date("2024-01-02T04:00:00"), sum: 2, subcategoriesId: 0},
            { date: new Date("2024-01-03T04:00:00"), sum: 3, subcategoriesId: 0, comment: "test" },
            { date: new Date("2024-01-04T04:00:00"), sum: 4, subcategoriesId: 0, comment: "test" },
            { date: new Date("2024-01-05T04:00:00"), sum: 5, subcategoriesId: 0, comment: "true" },
            { date: new Date("2024-01-05T05:00:00"), sum: 5, subcategoriesId: 0},
        ].forEach(record => expenses.records.addItem(record));

        const filter = {fn: (element: Expens) => (element.comment === "true")};
        const received = expenses.getExpensesByFilter([filter]);

        expect(received).toStrictEqual(6);
    });
});