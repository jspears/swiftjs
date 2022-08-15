//
//  MainScreen.swift
//  TodoAppSwiftUI3
//
//  Created by Roman Luzgin on 22.06.21.
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
define(["require", "exports", "swiftjs", "swiftjs/CoreData", "./Models", "./NewItem", "./Settings", "./ViewModels/CategoryCards"], function (require, exports, swiftjs_1, CoreData_1, Models_1, NewItem_1, Settings_1, CategoryCards_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MainScreen = void 0;
    const { white, black } = swiftjs_1.Color;
    class MainScreen extends swiftjs_1.Viewable {
        constructor() {
            super(...arguments);
            this.viewContext = new CoreData_1.ViewContext();
            this.items = [];
            this.newItemOpen = false;
            this.settingsOpen = false;
            this.userName = "";
            this.body = ({ $newItemOpen, newItemOpen, $menuOpen, $settingsOpen }, { userName, ...self } = this) => (0, swiftjs_1.ZStack)(!newItemOpen ?
                (0, swiftjs_1.NavigationView)((0, swiftjs_1.ZStack)((0, swiftjs_1.ScrollView)((0, swiftjs_1.VStack)((0, swiftjs_1.HStack)((0, swiftjs_1.Text)("Categories")
                    .font(swiftjs_1.Font.body.smallCaps())
                    .foregroundColor('.secondary'), (0, swiftjs_1.Spacer)()).padding('.horizontal'), (0, swiftjs_1.ScrollView)({
                    alignment: '.horizontal',
                    showsIndicators: false,
                    content: () => (0, swiftjs_1.LazyHStack)({ spacing: 20 }, (0, swiftjs_1.ForEach)(Models_1.categories, category => (0, CategoryCards_1.CategoryCards)({
                        category: category.category,
                        color: category.color,
                        numberOfTasks: this.getTotalTasksNumber(category),
                        tasksDone: this.getDoneTasksNumber(category)
                    })))
                        .padding('.bottom', 30)
                })
                    .padding('.leading', 20)
                    .padding('.trailing', 30))
                    .frame({ height: 190 })).padding('.top', 30), 
                // MARK: Actual list of todo items
                (0, swiftjs_1.VStack)((0, swiftjs_1.HStack)((0, swiftjs_1.Text)("Today's tasks")
                    .font(swiftjs_1.Font.body.smallCaps())
                    .foregroundColor('.secondary'), (0, swiftjs_1.Spacer)()).padding('.horizontal'), this.todaysItems.length ?
                    (0, swiftjs_1.LazyVStack)({ spacing: 10 }, (0, swiftjs_1.ForEach)(this.todaysItems, toDoItem => 
                    // MARK: Today's tasks list view
                    (0, swiftjs_1.VStack)({ alignment: '.leading' }, (0, swiftjs_1.HStack)((0, swiftjs_1.Image)({ systemName: toDoItem.isDone() ? "circle.fill" : "circle" })
                        .resizable()
                        .foregroundColor(this.getCategoryColor(toDoItem))
                        .frame({ width: 30, height: 30 })
                        .onTapGesture(() => (0, swiftjs_1.withAnimation)(() => Models_1.ViewContextMethods.isDone(toDoItem, this.viewContext)))
                        .padding('.leading', 20)
                        .padding('.trailing', 10), (0, swiftjs_1.Text)(toDoItem.toDoText ?? ""), (0, swiftjs_1.Spacer)()))
                        .frame({ maxWidth: '.infinity' })
                        .frame({ height: 100 })
                        .background((0, swiftjs_1.ZStack)({ color: self.getCategoryColor(toDoItem)?.opacity(0.7) })
                        .frame({ maxWidth: '.infinity', maxHeight: '.infinity' })
                        .padding('.horizontal', 30)
                        .padding('.vertical', 20), (0, swiftjs_1.VStack)(
                    // empty VStack for the blur
                    ).frame({ maxWidth: '.infinity', maxHeight: '.infinity' })
                        .background('.thinMaterial', { in: (0, swiftjs_1.RoundedRectangle)({ cornerRadius: 20 }) })))
                        .shadow({ color: black.opacity(0.1), radius: 20, x: 5, y: 10 })
                        .shadow({ color: black.opacity(0.1), radius: 1, x: 1, y: 1 })
                        .shadow({ color: white.opacity(1), radius: 5, x: -1, y: -1 })
                        .padding('.horizontal'))
                        .padding('.bottom', 60)
                    :
                        (0, swiftjs_1.VStack)((0, swiftjs_1.Text)("No tasks for today")
                            .foregroundColor('.secondary')).frame({ height: 200 }))), 
                // MARK: Bottom button to add new item
                (0, swiftjs_1.VStack)((0, swiftjs_1.Spacer)(), (0, swiftjs_1.HStack)((0, swiftjs_1.Spacer)(), (0, swiftjs_1.Button)({
                    action() {
                        (0, swiftjs_1.withAnimation)((0, swiftjs_1.toggle)($newItemOpen));
                    }
                }, (0, swiftjs_1.Image)({ systemName: "plus.circle.fill" })
                    .resizable()
                    .frame({ width: 70, height: 70 })
                    .foregroundColor('.indigo')
                    .shadow({ color: swiftjs_1.Color.indigo.opacity(0.3), radius: 10, x: 0, y: 10 })
                    .padding()))
                    .matchedGeometryEffect({ id: "button", in: this.namespace })))
                    .navigationTitle(!userName ? "Hi there!" : `What's up, ${userName}!`)
                    // MARK: Navigation bar buttons to open different menus
                    .navigationBarItems({
                    leading: (0, swiftjs_1.Button)({
                        action() {
                            (0, swiftjs_1.withAnimation)(() => $menuOpen(!self.menuOpen));
                            swiftjs_1.Haptics.giveSmallHaptic();
                        },
                    }, (0, swiftjs_1.Image)({ systemName: "rectangle.portrait.leftthird.inset.filled" })
                        .foregroundColor(swiftjs_1.Color.indigo)).buttonStyle((0, swiftjs_1.PlainButtonStyle)()),
                    trailing: (0, swiftjs_1.Button)({
                        action() {
                            (0, swiftjs_1.withAnimation)(() => $settingsOpen(!self.settingsOpen));
                            swiftjs_1.Haptics.giveSmallHaptic();
                        }
                    }, (0, swiftjs_1.Image)({ systemName: "gear.circle.fill" })
                        .resizable()
                        .frame({ width: 40, height: 40 })
                        .foregroundColor(swiftjs_1.Color.indigo))
                        .buttonStyle((0, swiftjs_1.PlainButtonStyle)())
                        .sheet({ isPresented: $settingsOpen, onDismiss() { self.settingsOpen = false; }, content: (0, Settings_1.Settings)() }),
                })
                // MARK: New item view
                : (0, NewItem_1.NewItem)({ namespace: this.namespace || '', newItemOpen: $newItemOpen }));
            // MARK: functions
            // func getCategoryColor(toDoItem: Item) -> Color {
            //     var category: [ItemCategory] {
            //         categories.filter {
            //             $0.category == toDoItem.category
            //         }
            //     }
            //     return category[0].color
            // }
            this.getCategoryColor = (toDoItem) => {
                return Models_1.categories.find($0 => $0.category == toDoItem.category)?.color;
            };
        }
        get todaysItems() {
            return this.items?.filter($0 => swiftjs_1.Calendar.current.isDate($0.dueDate ?? new Date(), new Date, '.day')) ?? [];
        }
        // func getTotalTasksNumber(category: ItemCategory) -> Int {
        //     var categoryTasks: [Item] {
        //         items.filter {
        //             $0.category == category.category
        //         }
        //     }
        //     return categoryTasks.count
        // }
        getTotalTasksNumber(category) {
            return this.items.filter($0 => $0.category === category.category).length;
        }
        getDoneTasksNumber(category) {
            // var categoryTasksDone: [Item] {
            //     items.filter {
            //         $0.category == category.category && $0.isDone == true
            //     }
            // }
            // return categoryTasksDone.count
            return this.items.filter($0 => $0.category === category.category && $0.isDone() == true).length;
        }
    }
    __decorate([
        (0, swiftjs_1.Environment)('.managedObjectContext'),
        __metadata("design:type", Object)
    ], MainScreen.prototype, "viewContext", void 0);
    __decorate([
        swiftjs_1.Namespace,
        __metadata("design:type", String)
    ], MainScreen.prototype, "namespace", void 0);
    __decorate([
        (0, swiftjs_1.FetchRequest)({
            sortDescriptors: [(0, CoreData_1.NSSortDescriptor)({ keyPath: '.timestamp', ascending: false })],
            animation: '.default'
        }),
        __metadata("design:type", typeof (_a = typeof CoreData_1.FetchedResults !== "undefined" && CoreData_1.FetchedResults) === "function" ? _a : Object)
    ], MainScreen.prototype, "items", void 0);
    __decorate([
        swiftjs_1.State,
        __metadata("design:type", Object)
    ], MainScreen.prototype, "newItemOpen", void 0);
    __decorate([
        swiftjs_1.State,
        __metadata("design:type", Object)
    ], MainScreen.prototype, "settingsOpen", void 0);
    __decorate([
        swiftjs_1.Binding,
        __metadata("design:type", Boolean)
    ], MainScreen.prototype, "menuOpen", void 0);
    __decorate([
        (0, swiftjs_1.AppStorage)("userName"),
        __metadata("design:type", Object)
    ], MainScreen.prototype, "userName", void 0);
    exports.MainScreen = MainScreen;
});
// struct MainScreen_Previews: PreviewProvider {
//     static  previews = View(
//         MainScreen(menuOpen: .constant(false))
//     )
// }
