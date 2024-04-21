import IDatabaseTable from "./IDatabaseTable";

export default class DatabaseTable<T> implements IDatabaseTable<T> {
  name: string;

  table: T[];

  constructor(name: string, defaultValues?: T[]) {
    this.name = name;
    if (defaultValues) {
      this.table = JSON.parse(
        localStorage.getItem(this.name) ?? JSON.stringify(defaultValues),
      );
    } else {
      this.table = JSON.parse(localStorage.getItem(this.name) ?? "[]");
    }
    this.update();
  }

  addItem(item: T) {
    this.table.push(item);
    this.update();
  }

  removeItem(id: number) {
    if (id < 0) {
      throw new Error("id must be 0 or greater!");
    }
    this.table.splice(id, 1);
    this.update();
  }

  getItem(id: number): T {
    if (id < 0) {
      throw new Error("id must be 0 or greater!");
    }
    return this.table[id]!;
  }

  updateItem(id: number, item: T): void {
    if (id < 0) {
      throw new Error("id must be 0 or greater!");
    }
    this.table[id] = item;
  }

  private update() {
    localStorage.setItem(this.name, JSON.stringify(this.table));
  }
}
