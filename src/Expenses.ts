/* eslint-disable no-param-reassign */
import DatabaseTable from "./DatabaseTable";

export type Expens = {
  date: Date;
  sum: number;
  subcategoriesId: number;
  comment?: string;
};

export type Category = {
  name: string;
};

export type SubCategory = {
  name: string;
  categoryId: number;
};

export type Filter = {
  fn: (element: Expens) => boolean;
};

export const defaultCategories: Category[] = [
  { name: "Food" },
  { name: "Medicine" },
  { name: "Transport" },
  { name: "Entertainment" },
  { name: "Bills" },
];

export const defaultSubCategories: SubCategory[] = [
  { name: "General", categoryId: 0 },
  { name: "Pet", categoryId: 0 },
  { name: "Child", categoryId: 0 },
  { name: "Subway", categoryId: 2 },
  { name: "Taxi", categoryId: 2 },
  { name: "Cinema", categoryId: 3 },
  { name: "Houes", categoryId: 4 },
  { name: "Taxes", categoryId: 4 },
];

export class Expenses {
  records: DatabaseTable<Expens>;

  categories: DatabaseTable<Category>;

  subCategories: DatabaseTable<SubCategory>;

  constructor() {
    this.categories = new DatabaseTable<Category>(
      "categories",
      defaultCategories,
    );
    this.subCategories = new DatabaseTable<SubCategory>(
      "subCategories",
      defaultSubCategories,
    );
    this.records = new DatabaseTable<Expens>("expens");
  }

  private getRecordsForPeriod(start: Date, end: Date): Expens[] {
    return this.getRecordsWithFilter([
      { fn: (element: Expens) => element.date >= start && element.date <= end },
    ]);
  }

  private getRecordsWithFilter(filters: Filter[]): Expens[] {
    return filters.reduce(
      (filtered, filter) => filtered.filter((record) => filter.fn(record)),
      this.records.table,
    );
  }

  getExpensesByCategories(start: Date, end: Date, sort?: "asc" | "dsc") {
    const expenses = this.getRecordsForPeriod(start, end).reduce(
      (result, record) => {
        const subCategory: SubCategory = this.subCategories.getItem(
          record.subcategoriesId,
        );
        const category = this.categories.getItem(subCategory.categoryId);
        if (Object.keys(result).includes(category.name))
          result[category.name] += record.sum;
        else result[category.name] = record.sum;
        return result;
      },
      {} as Record<string, number>,
    );
    const sortedEpenses = Object.keys(expenses).map((key) => ({
      category: key,
      sum: expenses[key],
    }));

    if (sort) {
      if (sort === "dsc") {
        sortedEpenses.sort((a, b) =>
          // eslint-disable-next-line no-nested-ternary
          a.sum < b.sum ? 1 : a.sum > b.sum ? -1 : 0,
        );
      } else {
        sortedEpenses.sort((a, b) =>
          // eslint-disable-next-line no-nested-ternary
        a.sum < b.sum ? -1 : a.sum > b.sum ? 1 : 0,
        );
      }
      return sortedEpenses;
    }
    return sortedEpenses;
  }

  getExpensesByDay(start: Date, end: Date) {
    const expenses = this.getRecordsForPeriod(start, end).reduce(
      (result, record) => {
        const dateKey = record.date.toISOString().split('T')[0];
        if (Object.keys(result).includes(dateKey)){
          result[dateKey] += record.sum;
        } else {
          result[dateKey] = record.sum;
        }
        return result;
      },
      {} as Record<string, number>,
    );
    return Object.keys(expenses).map((key) => ({
      date: key,
      sum: expenses[key],
    }));
  }

  getExpensesByFilter(filters: Filter[]) {
    return this.getRecordsWithFilter(filters).reduce(
      (result, record) => result + record.sum,
      0,
    );
  }
}
