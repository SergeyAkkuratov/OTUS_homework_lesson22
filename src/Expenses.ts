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

const defaultCategories: Category[] = [
  { name: "Food" },
  { name: "Medicine" },
  { name: "Transport" },
  { name: "Entertainment" },
  { name: "Bills" },
];

const defaultSubCategories: SubCategory[] = [
  { name: "General", categoryId: 0 },
  { name: "Pet", categoryId: 0 },
  { name: "Child", categoryId: 0 },
  { name: "Subway", categoryId: 2 },
  { name: "Taxi", categoryId: 2 },
  { name: "Cinema", categoryId: 3 },
  { name: "Houes", categoryId: 4 },
  { name: "Taxes", categoryId: 3 },
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
    this.records = new DatabaseTable<Expens>("records");
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

    if (sort) {
      const sortedEpenses = Object.keys(expenses).map((key) => ({
        category: key,
        sum: expenses[key],
      }));
      if (sort === "asc") {
        sortedEpenses.sort((a, b) =>
          // eslint-disable-next-line no-nested-ternary
          a.sum < b.sum ? -1 : a.sum > b.sum ? 1 : 0,
        );
      } else {
        sortedEpenses.sort((a, b) =>
          // eslint-disable-next-line no-nested-ternary
          a.sum < b.sum ? 0 : a.sum > b.sum ? 1 : -1,
        );
      }
      return sortedEpenses;
    }
    return expenses;
  }

  getExpensesByDay(start: Date, end: Date) {
    return this.getRecordsForPeriod(start, end).reduce(
      (result, record) => {
        if (Object.keys(result).includes(record.date.toDateString()))
          result[record.date.toDateString()] += record.sum;
        else result[record.date.toDateString()] = record.sum;
        return result;
      },
      {} as Record<string, number>,
    );
  }

  getExpensesByFilter(filters: Filter[]) {
    return this.getRecordsWithFilter(filters).reduce(
      (result, record) => result + record.sum,
      0,
    );
  }
}
