define(["require", "exports", "./View", "./utilit"], function (require, exports, View_1, utilit_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Toggle = void 0;
    class ToggleClass extends View_1.Viewable {
        toggle(v) {
            return this;
        }
    }
    exports.Toggle = (0, utilit_1.swifty)(ToggleClass);
});
