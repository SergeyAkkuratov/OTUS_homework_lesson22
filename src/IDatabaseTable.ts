export default interface IDatabaseTable<T> {
  name: string;
  addItem(item: T): void;
  removeItem(id: number): void;
  getItem(id: number): T;
  updateItem(id: number, item: T): void;
}
