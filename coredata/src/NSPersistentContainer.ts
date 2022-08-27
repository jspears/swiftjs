import { NSManagedObjectContext } from './NSManagedObjectContext';
export interface HasId {
  id: string;
}

export class ViewContext<T extends HasId> extends NSManagedObjectContext {
  entites = new Map<string, T>();
  add(e: T) {
    this.entites.set(e.id, e);
  }
  remove(id: string) {
    this.entites.delete(id);
  }
  delete(item: T) {}
  save() {}
}

export class NSPersistentContainer {
  viewContext = new ViewContext();

  constructor(public name: string) {}
}
