import { Color, Toggle, swifty, watchable } from "@tswift/ui";
export type NSManagedObjectContext = {
  save(): void;
  add(v: unknown): void;
};
let _id = 0;
const UUID = () => `id${_id++}`;

class ItemCategoryClass {
  constructor(public category: string, public color: Color, public id = UUID()) {}
}
export class ItemType {
  public dueDate?: Date;
  public toDoText?: string;
  public category?: string;
  public isDone = watchable(false);
  public timestamp?: Date;
  constructor(private context: NSManagedObjectContext, public id = UUID()) {
    context.add(this);
  }
}
export const Item = swifty(ItemType);
export const ItemCategory = swifty(ItemCategoryClass);
export type ItemCategoryType = InstanceType<typeof ItemCategoryClass>;

export const categories = [
  ItemCategory("Business", Color.cyan),
  ItemCategory("Personal", Color.indigo),
  ItemCategory("Other", Color.mint),
];
