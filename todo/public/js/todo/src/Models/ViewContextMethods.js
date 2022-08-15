define(["require", "exports", "swiftjs", "./Categories"], function (require, exports, swiftjs_1, Categories_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ViewContextMethods = void 0;
    class ViewContextMethods {
        static addItem(context, dueDate, toDoText, category) {
            (0, swiftjs_1.withAnimation)(() => {
                const newItem = (0, Categories_1.Item)(context);
                newItem.timestamp = new Date();
                newItem.dueDate = dueDate;
                newItem.toDoText = toDoText;
                newItem.category = category;
                try {
                    context.save();
                }
                catch (error) {
                    // Replace this implementation with code to handle the error appropriately.
                    // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
                    // let nsError = error as NSError
                    // fatalError("Unresolved error \(nsError), \(nsError.userInfo)")
                }
            });
        }
        static isDone(item, context) {
            (0, swiftjs_1.withAnimation)(() => {
                item.isDone(!item.isDone());
                try {
                    context.save();
                }
                catch (error) {
                    // Replace this implementation with code to handle the error appropriately.
                    // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
                    //          let nsError = error as NSError
                    //            fatalError("Unresolved error \(nsError), \(nsError.userInfo)")
                }
            });
        }
    }
    exports.ViewContextMethods = ViewContextMethods;
});
