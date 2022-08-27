import { ReadonlyMap } from 'typescript';

interface NSFetchRequest<T> {}
interface NSFetchRequestResult {}
export type NSManagedObjectID = string;

// func registeredObject(for: NSManagedObjectID) -> NSManagedObject?
// Returns an object that exists in the context.
// func object(with: NSManagedObjectID) -> NSManagedObject
// Returns either an existing object from the context or a fault that represents that object.
// func existingObject(with: NSManagedObjectID) -> NSManagedObject
// Returns an existing object from either the context or the persistent store.
// var registeredObjects: Set<NSManagedObject>
// The set of registered managed objects in the context.
// func count<T>(for: NSFetchRequest<T>) -> Int
// Returns a count of the objects the specified request fetches when it executes.
// func execute(NSPersistentStoreRequest) -> NSPersistentStoreResult
// Passes a request to the persistent store without affecting the contents of the managed object context, and returns a persistent store result.
// func refreshAllObjects()
// Refreshes all of the registered managed objects in the context.
// var retainsRegisteredObjects: Bool
// A Boolean value that indicates whether the context keeps strong references to all registered managed objects.
export class NSManagedObjectContext {
  public parent?: NSManagedObjectContext;
  public name?: string;
  public userInfo?: NSMutableDictionaryClass;

  public registeredObjects = new Set<NSManagedObjectID>();
  public insertedObjects = new Set<NSManagedObjectID>();

  // func fetch(NSFetchRequest<NSFetchRequestResult>) -> [Any]
  // Returns an array of objects that meet the criteria of the specified fetch request.
  // func fetch<T>(NSFetchRequest<T>) -> [T]
  // Returns an array of items of the specified type that meet the fetch request’s critieria.
  fetch<T>(req: NSFetchRequest<T>): T[] {
    return [];
  }

  count(req: NSFetchRequest<NSFetchRequestResult>): number {
    return 0;
  }
  registeredObject(forId: NSManagedObjectID) {}
  existingObject(withid: NSManagedObjectID) {}
  // Returns the number of objects the specified request fetches when it executes.
}
export type AnyHashable =
  | NSDictionaryClass
  | Record<string, unknown>
  | Map<string, unknown>;

type ErrorFn = (error: Error) => void;
type NeededUnionType<T extends string[]> = T[number];
export class NSDictionaryClass implements Record<string, unknown> {
  protected dict = new Map<string, unknown>();

  public description: string = '';

  constructor();
  constructor(url: URL, onError?: ErrorFn);
  constructor(hashable: AnyHashable);
  constructor(hashable: AnyHashable, copy: boolean);
  constructor(object: unknown, key: string);
  constructor(objects: unknown[], keys: string[]);

  constructor(
    ...[objects, keys]:
      | [URL, ErrorFn?]
      | [AnyHashable, boolean?]
      | [unknown, string]
      | [unknown[], string[] | []]
  ) {
    if (objects === undefined) {
      //no objects ininitialization
    } else if (Array.isArray(keys) && Array.isArray(objects)) {
      for (let i = 0; i < keys.length; i++) {
        this.dict.set(keys[i], objects[i]);
      }
    } else if (typeof keys === 'string') {
      this.dict.set(keys, objects);
    } else if (objects instanceof Map<String, unknown>) {
      if (!keys) {
        objects.forEach(this.dict.set, this.dict);
      } else {
        objects.forEach((key, value) => {
          this.dict.set(key, { ...value });
        });
      }
    } else if (objects instanceof NSDictionaryClass) {
      objects.dict.forEach((v, k) => this.dict.set(k, v));
    } else if (objects instanceof URL) {
      throw new Error(`URL loading not supported yet`);
    }
  }
  sharedKeySet<K extends string[]>(
    forKeys: K
  ): Record<NeededUnionType<K>, unknown> {
    return forKeys.reduce((ret, k) => {
      ret[k] = this.value(k);
      return ret;
    }, {} as any);
  }
  value = (k: string): unknown => this.dict.get(k);
  object = this.value;
  get allKeys() {
    return this.dict.keys();
  }
  get allValues() {
    return this.dict.values();
  }
  objects(forKeys: string[]) {
    return forKeys.map(this.value);
  }
  keys(forValue: unknown): string[] {
    return Array.from(this.dict.entries()).reduce((ret, [k, v]) => {
      if (v === forValue) {
        ret.push(k);
      }
      return ret;
    }, [] as string[]);
  }
  count() {
    return this.dict.size;
  }
  keysSortedByValue = (comparator: Selector) => {
    return Array.from(this.dict.entries())
      .sort(([, va], [, vb]) => comparator(va, vb))
      .map((v) => v[0]);
  };
  keysOfEntries = (passingTest: Predicate) => {
    const keys = new Set<string>();
    this.dict.forEach((v, k) => passingTest(v) && keys.add(k));
    return keys;
  };
  [k: string]: unknown;
}
type Predicate = (a: unknown) => boolean;
type Selector = (a: unknown, b: unknown) => number;

export class NSMutableDictionaryClass extends NSDictionaryClass {
  setValue(v: unknown | null, key: string) {
    if (v == null) {
      this.removeObject(key);
      return;
    }
    this.dict.set(key, v);
  }
  setObject(v: unknown | undefined | null, key: string) {
    this.dict.set(key, v);
  }
  addEntries(other: NSMutableDictionaryClass) {
    other.dict.forEach(this.setObject, this);
  }
  removeObject(key: string) {
    this.dict.delete(key);
  }
  removeObjects(keys: string[]) {
    keys.forEach(this.removeObject, this);
  }
  removeAllObjects() {
    this.dict.clear();
  }
}
export const NSDictionary = (
  ...args: ConstructorParameters<typeof NSDictionaryClass>
) => {
  const dic = new NSDictionaryClass(...args);

  return new Proxy(dic, {
    get(target, key) {
      if (typeof key === 'string') return target.value(key);
    },
    ownKeys(target) {
      return Array.from(target.allKeys);
    },
  });
};
export const NSMutableDictionary = (
  ...args: ConstructorParameters<typeof NSMutableDictionaryClass>
) => {
  const dic = new NSMutableDictionaryClass(...args);
  return new Proxy(dic, {
    get(target, key) {
      if (typeof key === 'string') return target.value(key);
    },
    ownKeys(target) {
      return Array.from(target.allKeys);
    },
    deleteProperty(target, p) {
      if (typeof p === 'string') {
        target.removeObject(p);
        return true;
      }
      return false;
    },
    set(target, key, value) {
      if (typeof key === 'string') {
        target.setObject(key, value);
        return true;
      }
      return false;
    },
  });
};
