//
//  CategoryCards.swift
//  TodoAppSwiftUI3
//
//  Created by Roman Luzgin on 21.06.21.
//
define(["require", "exports", "swiftjs"], function (require, exports, swiftjs_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CategoryCards = void 0;
    class CategoryCardsClass extends swiftjs_1.Viewable {
        constructor(config, ...views) {
            super(...views);
            this.maxProgress = 180.0;
            this.body = (bound, self = this) => (0, swiftjs_1.VStack)({ alignment: '.leading' }, (0, swiftjs_1.Text)("\(numberOfTasks) tasks")
                .font('.callout')
                .foregroundColor('.secondary'), (0, swiftjs_1.Text)(this.category || '')
                .font(swiftjs_1.Font.title.bold()), (0, swiftjs_1.ZStack)({ alignment: '.leading' }, (0, swiftjs_1.RoundedRectangle)({ cornerRadius: 20, style: '.continuous' })
                .frame({ maxWidth: self.maxProgress })
                .frame({ height: 5 })
                .foregroundColor(swiftjs_1.Color.gray.opacity(0.5)), (0, swiftjs_1.RoundedRectangle)({ cornerRadius: 20, style: '.continuous' })
                .frame({ maxWidth: self.maxProgress })
                .frame({ width: self.numberOfTasks > 0 ? self.progress : 0, height: 5 })
                .foregroundColor(self.config.color?.opacity(0.9))))
                .padding(10)
                .frame({ width: 200, height: 120, alignment: '.leading' })
                .background((0, swiftjs_1.ZStack)({ alignment: '.leading' }, (0, swiftjs_1.LinearGradient)({
                colors: [self.config.color?.opacity(0.95), self.config.color?.opacity(0.3)],
                startPoint: '.topLeading', endPoint: '.bottomTrailing'
            })
                .frame({ maxWidth: '.infinity', maxHeight: '.infinity' })
                .padding(20), (0, swiftjs_1.VStack)(
            // empty VStack for the blur
            )
                .frame({ maxWidth: '.infinity', maxHeight: '.infinity' })
                .background('.thinMaterial')))
                .clipShape((0, swiftjs_1.RoundedRectangle)({ cornerRadius: 20, style: '.continuous' }))
                .shadow({ color: swiftjs_1.Color.black.opacity(0.1), radius: 20, x: 5, y: 10 })
                .shadow({ color: swiftjs_1.Color.black.opacity(0.1), radius: 1, x: 1, y: 1 })
                .shadow({ color: swiftjs_1.Color.white.opacity(1), radius: 5, x: -1, y: -1 });
            this.category = config.category;
            this.color(config.color);
            this.numberOfTasks = config.numberOfTasks || 0;
            this.tasksDone = config.tasksDone || 0;
        }
        get progress() {
            if (this.tasksDone == 0) {
                return 0;
            }
            return this.maxProgress * this.tasksDone / this.numberOfTasks;
        }
    }
    // CategoryCards_Previews: PreviewProvider {
    //     static previews = View(
    //         CategoryCards({category: "Business",
    //                       color: Color.cyan,
    //                       numberOfTasks: 40,
    //                       tasksDone: 20})
    //     )
    // }
    exports.CategoryCards = (0, swiftjs_1.swifty)(CategoryCardsClass);
});
