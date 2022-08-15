//
//  Settings.swift
//  TodoAppSwiftUI3
//
//  Created by Roman Luzgin on 12.07.21.
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
define(["require", "exports", "swiftjs"], function (require, exports, swiftjs_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Settings = exports.SettingsClass = void 0;
    class SettingsClass extends swiftjs_1.Viewable {
        constructor() {
            super(...arguments);
            this.userNameIsFocused = false;
            this.username = "";
            this.body = ({ $username, dismiss, $userNameIsFocused }) => (0, swiftjs_1.NavigationView)((0, swiftjs_1.Form)((0, swiftjs_1.TextField)({ label: "Username", text: $username })
                .focused($userNameIsFocused)
                .submitLabel('.done'))
                .navigationBarItems({ trailing: (0, swiftjs_1.Button)({ label: "Done", action: dismiss }).accentColor('.indigo') })
                .onSubmit(() => {
                this.userNameIsFocused = false;
                dismiss?.(); // we can use dismiss on submit if needed, especially if there is only one settings field
            }));
        }
    }
    __decorate([
        swiftjs_1.FocusState,
        __metadata("design:type", Boolean)
    ], SettingsClass.prototype, "userNameIsFocused", void 0);
    __decorate([
        (0, swiftjs_1.Environment)('.dismiss'),
        __metadata("design:type", Function)
    ], SettingsClass.prototype, "dismiss", void 0);
    __decorate([
        (0, swiftjs_1.AppStorage)("userName"),
        __metadata("design:type", Object)
    ], SettingsClass.prototype, "username", void 0);
    exports.SettingsClass = SettingsClass;
    exports.Settings = (0, swiftjs_1.swifty)(SettingsClass);
});
// struct Settings_Previews: PreviewProvider {
//     static var previews: some View {
//         Settings()
//     }
// }
