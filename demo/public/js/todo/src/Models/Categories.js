define(["require", "exports", "swiftjs"], function (require, exports, swiftjs_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.categories = exports.ItemCategory = exports.Item = void 0;
    let _id = 0;
    const UUID = () => `id${_id++}`;
    class ItemCategoryClass {
        constructor(category, color, id = UUID()) {
            this.category = category;
            this.color = color;
            this.id = id;
        }
    }
    class ItemClass {
        constructor(context, id = UUID()) {
            this.context = context;
            this.id = id;
            this.isDone = (0, swiftjs_1.watchable)(false);
            context.add(this);
        }
    }
    exports.Item = (0, swiftjs_1.swifty)(ItemClass);
    exports.ItemCategory = (0, swiftjs_1.swifty)(ItemCategoryClass);
    exports.categories = [
        (0, exports.ItemCategory)("Business", swiftjs_1.Color.cyan),
        (0, exports.ItemCategory)("Personal", swiftjs_1.Color.indigo),
        (0, exports.ItemCategory)("Other", swiftjs_1.Color.mint)
    ];
});
