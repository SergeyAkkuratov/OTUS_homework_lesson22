import IDatabaseTable from "./IDatabaseTable";

export default class DatabaseTable<T> implements IDatabaseTable<T> {
  name: string;

  table: T[];

  constructor(name: string, defaultValues?: T[]) {
    this.name = name;
    const localData = localStorage.getItem(this.name);
    if (localData) {
      this.table = JSON.parse(localData);
    } else {
      if (defaultValues) {
        this.table = JSON.parse(JSON.stringify(defaultValues));
      } else {
        this.table = [];
      }
      this.updateStorage();
    }
  }

  addItem(item: T): void {
    this.table.push(item);
    this.updateStorage();
  }

  removeItem(id: number): void {
    if (!this.table[id]) {
      throw new Error(`There is no record with id ${id}`);
    }
    this.table.splice(id, 1);
    this.updateStorage();
  }

  getItem(id: number): T {
    if (!this.table[id]) {
      throw new Error(`There is no record with id ${id}`);
    }
    return this.table[id];
  }

  updateItem(id: number, item: T): void {
    if (!this.table[id]) {
      throw new Error(`There is no record with id ${id}`);
    }
    this.table[id] = item;
  }

  private updateStorage(): void {
    localStorage.setItem(this.name, JSON.stringify(this.table));
  }
}
