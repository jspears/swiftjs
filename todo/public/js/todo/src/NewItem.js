//
//  NewItem.swift
//  TodoAppSwiftUI3
//
//  Created by Roman Luzgin on 28.06.21.
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
define(["require", "exports", "swiftjs/CoreData", "swiftjs", "./Models"], function (require, exports, CoreData_1, swiftjs_1, Models_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NewItem = void 0;
    const { white, black } = swiftjs_1.Color;
    class NewItemClass extends swiftjs_1.Viewable {
        constructor({ namespace, newItemOpen }) {
            super();
            this.viewContext = new CoreData_1.ViewContext();
            this.category = "Business";
            this.dueDate = new Date();
            this.toDoText = "";
            this.toDoTextLimit = 70;
            this.body = ({ $category, category, newItemOpen, $dueDate, $toDoText }, self = this) => (0, swiftjs_1.ZStack)((0, swiftjs_1.ScrollView)((0, swiftjs_1.VStack)((0, swiftjs_1.Picker)({
                selection: $category,
                label: (0, swiftjs_1.Text)(category)
            })
                .font(swiftjs_1.Font.body.bold())
                .padding()
                .foregroundColor('.black')
                .frame({ maxWidth: '.infinity', alignment: '.leading' })
                //.frame(height: 50)
                .background((0, swiftjs_1.ZStack)()
                .color(this.getCategoryColor(category)?.opacity(0.7))
                .frame({ maxWidth: '.infinity', maxHeight: '.infinity' })
                .padding('.horizontal', 10)
                .padding('.vertical', 2), (0, swiftjs_1.VStack)(
            // empty VStack for the blur
            )
                .frame({ maxWidth: '.infinity', maxHeight: '.infinity' })
                .background('.thinMaterial', (0, swiftjs_1.RoundedRectangle)({ cornerRadius: 5 })))))
                .shadow({ color: black.opacity(0.1), radius: 20, x: 5, y: 10 })
                .shadow({ color: black.opacity(0.1), radius: 1, x: 1, y: 1 })
                .shadow({ color: white.opacity(1), radius: 5, x: -1, y: -1 }), (0, swiftjs_1.ForEach)(Models_1.categories, $0 => ((0, swiftjs_1.Text)($0.category)
                .tag($0.category)))
                .pickerStyle((0, swiftjs_1.MenuPickerStyle)())
                .padding(), (0, swiftjs_1.DatePicker)({ selection: $dueDate, displayedComponents: 'date' }, (0, swiftjs_1.Text)("Due date"))
                .padding('.horizontal')
                .padding('.vertical', 10)
                .accentColor(swiftjs_1.Color.indigo)
                .padding(), (0, swiftjs_1.ZStack)({
                alignment: '.leading',
            }, ...(self.toDoText?.length ?
                [(0, swiftjs_1.VStack)({ alignment: '.leading' }, (0, swiftjs_1.Text)("Enter your todo item")
                        .font(swiftjs_1.Font.body)
                        .foregroundColor(swiftjs_1.Color.gray), (0, swiftjs_1.Spacer)())] : []))
                .padding('.vertical', 12)
                .padding('.horizontal', 4)
                .zIndex(0), (0, swiftjs_1.TextEditor)({ text: $toDoText })
                .frame({ height: 200, alignment: '.leading' })
                .frame({ maxWidth: '.infinity' })
                .lineSpacing(5)
                //     .onReceive(Just(toDoText)) {
                //         toDoText in
                //         textChanged(upper: toDoTextLimit, text: & self.toDoText)
                // }
                .zIndex(1)
                .opacity(self.toDoText.length ? 0.25 : 1)
                .frame({ height: 200, alignment: '.leading' })
                .frame({ maxWidth: '.infinity' })
                .padding('.horizontal', 30), (0, swiftjs_1.Button)({
                role: '.none',
                action() {
                    Models_1.ViewContextMethods.addItem(self.viewContext, self.dueDate, self.toDoText, self.category);
                    (0, swiftjs_1.withAnimation)(() => self.newItemOpen?.(false));
                },
                label: (0, swiftjs_1.HStack)((0, swiftjs_1.Text)("New task "), (0, swiftjs_1.Image)({ systemName: "chevron.up" })).frame({ maxWidth: '.infinity' })
            })
                .buttonStyle((0, swiftjs_1.BorderedButtonStyle)({ shape: '.roundedRectangle' }))
                .tint('.indigo')
                .controlProminence('.increased')
                .controlSize('.large')
                .shadow({ color: black.opacity(0.1), radius: 20, x: 5, y: 10 })
                .shadow({ color: black.opacity(0.1), radius: 1, x: 1, y: 1 })
                .shadow({ color: white.opacity(1), radius: 5, x: -1, y: -1 })
                .padding()
                .padding('.top', 100)
                .background(swiftjs_1.Color.white)
                .frame({ maxWidth: '.infinity', maxHeight: '.infinity' })
                .onTapGesture(swiftjs_1.UIApplication.shared.endEditing), (0, swiftjs_1.VStack)((0, swiftjs_1.HStack)((0, swiftjs_1.Spacer)(), (0, swiftjs_1.Button)({
                action() {
                    (0, swiftjs_1.withAnimation)(() => newItemOpen?.(false));
                }
            }, (0, swiftjs_1.Image)({ systemName: "xmark.circle.fill" })
                .resizable()
                .frame({ width: 60, height: 60 })
                .foregroundColor('.indigo')
                .shadow({ color: swiftjs_1.Color.indigo.opacity(0.3), radius: 10, x: 0, y: 10 })
                .padding()))
                .matchedGeometryEffect({ id: "button", in: this.namespace }), (0, swiftjs_1.Spacer)()));
            // textChanged(upper: number, text:string) {
            //     if (text.length > upper) {
            //         text = text.prefix(upper)
            //     }
            // }
            this.getCategoryColor = (categoryChosen) => {
                return Models_1.categories.find(v => v.category = categoryChosen)?.color;
            };
            this.namespace = namespace;
            this.newItemOpen = newItemOpen;
        }
    }
    __decorate([
        (0, swiftjs_1.Environment)('.managedObjectContext'),
        __metadata("design:type", Object)
    ], NewItemClass.prototype, "viewContext", void 0);
    __decorate([
        swiftjs_1.State,
        __metadata("design:type", Object)
    ], NewItemClass.prototype, "category", void 0);
    __decorate([
        swiftjs_1.State,
        __metadata("design:type", Object)
    ], NewItemClass.prototype, "dueDate", void 0);
    __decorate([
        swiftjs_1.State,
        __metadata("design:type", Object)
    ], NewItemClass.prototype, "toDoText", void 0);
    __decorate([
        swiftjs_1.Binding,
        __metadata("design:type", typeof (_a = typeof swiftjs_1.Bindable !== "undefined" && swiftjs_1.Bindable) === "function" ? _a : Object)
    ], NewItemClass.prototype, "newItemOpen", void 0);
    // struct NewItem_Previews: PreviewProvider {
    //     @Namespace static var namespace
    //     static var previews: some View {
    //         NewItem(namespace: namespace,
    //                 newItemOpen: .constant(false)
    //         )
    //     }
    // }
    exports.NewItem = (0, swiftjs_1.swifty)(NewItemClass);
});
