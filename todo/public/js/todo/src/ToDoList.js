//
//  ContentView.swift
//  TodoAppSwiftUI3
//
//  Created by Roman Luzgin on 21.06.21.
//
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "swiftjs", "swiftjs/CoreData", "./Models"], function (require, exports, swiftjs_1, CoreData_1, Models_1) {
    "use strict";
    var _a, _b;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ToDoList = void 0;
    //https://raw.githubusercontent.com/roman-luzgin/TodoAppSwiftUI3/main/TodoAppSwiftUI3/ToDoList.swift
    class ToDoList extends swiftjs_1.Viewable {
        constructor() {
            super(...arguments);
            this.viewContext = new CoreData_1.ViewContext();
            this.items = [];
            this.searchQuery = "";
            this.notDoneOnly = false;
            this.body = ({ $notDoneOnly }, self = this) => (0, swiftjs_1.NavigationView)((0, swiftjs_1.List)((0, swiftjs_1.Section)((0, swiftjs_1.HStack)((0, swiftjs_1.Toggle)({ $isOn: $notDoneOnly }, (0, swiftjs_1.Text)(self.notDoneOnly ? "Show all items" : "Show not done only")
                .frame({ maxWidth: '.infinity' }))
                .toggleStyle('.button')
                .tint('.indigo')
                .clipShape((0, swiftjs_1.Capsule)())
                .animation('.easeInOut', this.notDoneOnly))), (0, swiftjs_1.Section)((0, swiftjs_1.ForEach)(this.searchResults, item => (0, swiftjs_1.HStack)((0, swiftjs_1.Image)({ systemName: item.isDone?.() ? "circle.fill" : "circle" })
                .resizable()
                .foregroundColor(this.getCategoryColor(item))
                .frame({ width: 30, height: 30 })
                .onTapGesture(() => (0, swiftjs_1.withAnimation)(() => {
                Models_1.ViewContextMethods.isDone(item, this.viewContext);
            }))
                .padding('.trailing', 10), (0, swiftjs_1.VStack)((0, swiftjs_1.HStack)((0, swiftjs_1.Text)(item.toDoText ?? '')
                .fixedSize({ horizontal: false, vertical: true }), (0, swiftjs_1.Spacer)())
                .padding('.bottom', 5), (0, swiftjs_1.HStack)((0, swiftjs_1.Text)(`Due: ${this.itemFormatter.format(item.dueDate)}`)
                .font('.caption')
                .foregroundColor('.secondary'), (0, swiftjs_1.Spacer)(), (0, swiftjs_1.Text)(item.category ?? "Unknown")
                .font('.caption')
                .foregroundColor('.secondary'))).padding('.leading', 5))
                .frame({ maxHeight: 130 })
                .listRowSeparator('.hidden') // no separators
            )
                .onDelete(this.deleteItems)))
                .listStyle((0, swiftjs_1.InsetGroupedListStyle)())
                .refreshable(() => {
                //await store.loadStats()
                console.log("refreshed");
            })
                .searchable("Search in history", this.searchQuery, '.automatic')
                .navigationTitle("All todo items"));
            this.deleteItems = (offsets) => {
                (0, swiftjs_1.withAnimation)(() => {
                    //offsets.map { items[$0] }.forEach(viewContext.delete)
                    offsets.forEach($0 => this.viewContext.delete(this.items[$0]));
                    try {
                        this.viewContext.save();
                    }
                    catch (error) {
                        // Replace this implementation with code to handle the error appropriately.
                        // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
                        // let nsError = error as NSError
                        // fatalError("Unresolved error \(nsError), \(nsError.userInfo)")
                    }
                });
            };
        }
        get searchResults() {
            if (!(0, swiftjs_1.isEmpty)(this.searchQuery)) {
                switch (this.notDoneOnly) {
                    case true:
                        return this.items.filter($0 => !(0, swiftjs_1.isEmpty)($0.toDoText) && $0.isDone() == false);
                    default:
                        return this.items.filter($0 => !(0, swiftjs_1.isEmpty)($0.toDoText));
                }
            }
            else {
                switch (this.notDoneOnly) {
                    case true:
                        return this.items.filter($0 => $0.toDoText?.toLocaleLowerCase().includes(this.searchQuery.toLocaleLowerCase()) && $0.isDone() == false);
                    default:
                        return this.items.filter($0 => $0.toDoText?.toLocaleLowerCase().includes(this.searchQuery.toLocaleLowerCase()));
                }
            }
        }
        getCategoryColor(toDoItem) {
            return Models_1.categories.find(v => toDoItem.id === v.id)?.color;
        }
        get itemFormatter() {
            return new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' });
        }
    }
    __decorate([
        (0, swiftjs_1.Environment)('.managedObjectContext'),
        __metadata("design:type", typeof (_a = typeof CoreData_1.ViewContext !== "undefined" && CoreData_1.ViewContext) === "function" ? _a : Object)
    ], ToDoList.prototype, "viewContext", void 0);
    __decorate([
        (0, swiftjs_1.FetchRequest)({
            sortDescriptors: [(0, CoreData_1.NSSortDescriptor)({ keyPath: '.dueDate', ascending: false })],
            animation: '.default'
        }),
        __metadata("design:type", typeof (_b = typeof CoreData_1.FetchedResults !== "undefined" && CoreData_1.FetchedResults) === "function" ? _b : Object)
    ], ToDoList.prototype, "items", void 0);
    __decorate([
        swiftjs_1.State,
        __metadata("design:type", Object)
    ], ToDoList.prototype, "searchQuery", void 0);
    __decorate([
        swiftjs_1.State,
        __metadata("design:type", Object)
    ], ToDoList.prototype, "notDoneOnly", void 0);
    exports.ToDoList = ToDoList;
});
// private let itemFormatter: DateFormatter = {
//     let formatter = DateFormatter()
//     formatter.dateStyle = .short
//     //formatter.timeStyle = .medium
//     return formatter
// }()
// struct ToDoList_Previews: PreviewProvider {
//     static var previews: some View {
//         ToDoList().environment(\.managedObjectContext, PersistenceController.preview.container.viewContext)
//     }
// }
