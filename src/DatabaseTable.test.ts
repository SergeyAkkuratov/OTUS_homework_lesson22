/* eslint-disable no-underscore-dangle */
import DatabaseTable from "./DatabaseTable";

type TestItem = {
  name: string;
  value: string;
};
describe("DatabaseTable tests", () => {
  const testName = "test";
  let dbTable: DatabaseTable<TestItem>;

  beforeEach(() => {
    localStorage.clear();
  });

  it("Check constructor", () => {
    dbTable = new DatabaseTable<TestItem>(testName);
    expect(dbTable.name).toBe(testName);
    expect(dbTable.table).toBeInstanceOf(Array<TestItem>);
    expect(dbTable.table).toStrictEqual([]);
    expect(localStorage.setItem).toHaveBeenLastCalledWith(
      testName,
      JSON.stringify([]),
    );
    expect(localStorage.__STORE__[testName]).toBe(JSON.stringify([]));
    expect(Object.keys(localStorage.__STORE__).length).toBe(1);
  });

  it("Check constructor with defaults", () => {
    const testDefault = [
      { name: "test1", value: "1" },
      { name: "test2", value: "2" },
      { name: "test3", value: "3" },
    ];

    dbTable = new DatabaseTable<TestItem>(testName, testDefault);

    expect(dbTable.name).toBe(testName);
    expect(dbTable.table).toBeInstanceOf(Array<TestItem>);
    expect(dbTable.table).toStrictEqual(testDefault);
    expect(localStorage.setItem).toHaveBeenLastCalledWith(
      testName,
      JSON.stringify(testDefault),
    );
    expect(localStorage.__STORE__[testName]).toBe(JSON.stringify(testDefault));
    expect(Object.keys(localStorage.__STORE__).length).toBe(1);
  });

  it("Checks constructor with privious data", () => {
    const testDefault = [
      { name: "test1", value: "1" },
      { name: "test2", value: "2" },
      { name: "test3", value: "3" },
    ];

    dbTable = new DatabaseTable<TestItem>(testName, testDefault);

    const newDefault = [
      ...testDefault,
      { name: "test4", value: "4" },
      { name: "test5", value: "5" },
      { name: "test6", value: "6" },
    ];

    dbTable = new DatabaseTable<TestItem>(testName, newDefault);

    expect(dbTable.name).toBe(testName);
    expect(dbTable.table).toBeInstanceOf(Array<TestItem>);
    expect(dbTable.table).toStrictEqual(testDefault);
    expect(localStorage.setItem).toHaveBeenLastCalledWith(
      testName,
      JSON.stringify(testDefault),
    );
    expect(localStorage.__STORE__[testName]).toBe(JSON.stringify(testDefault));
    expect(Object.keys(localStorage.__STORE__).length).toBe(1);
  });

  it("Checks addItem function", () => {
    dbTable = new DatabaseTable<TestItem>(testName);
    dbTable.addItem({ name: "test1", value: "1" });

    expect(dbTable.table).toStrictEqual([{ name: "test1", value: "1" }]);
    expect(localStorage.setItem).toHaveBeenLastCalledWith(
      testName,
      JSON.stringify([{ name: "test1", value: "1" }]),
    );
    expect(localStorage.__STORE__[testName]).toBe(
      JSON.stringify([{ name: "test1", value: "1" }]),
    );
    expect(Object.keys(localStorage.__STORE__).length).toBe(1);
  });

  it("Checks removeItem function", () => {
    const testDefault = [
      { name: "test1", value: "1" },
      { name: "test2", value: "2" },
      { name: "test3", value: "3" },
    ];

    dbTable = new DatabaseTable<TestItem>(testName, testDefault);
    dbTable.removeItem(0);

    testDefault.splice(0, 1);

    expect(dbTable.table).toStrictEqual(testDefault);
    expect(localStorage.setItem).toHaveBeenLastCalledWith(
      testName,
      JSON.stringify(testDefault),
    );
    expect(localStorage.__STORE__[testName]).toBe(JSON.stringify(testDefault));
    expect(Object.keys(localStorage.__STORE__).length).toBe(1);

    const errorCall = () => dbTable.removeItem(-1);
    expect(errorCall).toThrow("There is no record with id -1");
  });

  it("Checks getItem function", () => {
    const testDefault = [
      { name: "test1", value: "1" },
      { name: "test2", value: "2" },
      { name: "test3", value: "3" },
    ];

    dbTable = new DatabaseTable<TestItem>(testName, testDefault);

    const errorCall = () => dbTable.getItem(-1);
    expect(errorCall).toThrow("There is no record with id -1");

    const item: TestItem = dbTable.getItem(0);
    expect(item).toStrictEqual(testDefault[0]);
  });

  it("Checks updateItem function", () => {
    const testDefault = [
      { name: "test1", value: "1" },
      { name: "test2", value: "2" },
      { name: "test3", value: "3" },
    ];

    dbTable = new DatabaseTable<TestItem>(testName, testDefault);

    const errorCall = () => dbTable.updateItem(-1, testDefault[0]);
    expect(errorCall).toThrow("There is no record with id -1");

    dbTable.updateItem(1, testDefault[0]);
    // eslint-disable-next-line prefer-destructuring
    testDefault[1] = testDefault[0];
    expect(dbTable.table).toStrictEqual(testDefault);
  });
});
