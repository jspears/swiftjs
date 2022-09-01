//
//  NewItem.swift
//  TodoAppSwiftUI3
//
//  Created by Roman Luzgin on 28.06.21.
//

import { ViewContext } from "@tswift/coredata";
import {
  Button,
  Viewable,
  State,
  Color,
  Image,
  Namespace,
  Binding,
  Environment,
  Font,
  ForEach,
  ScrollView,
  RoundedRectangle,
  Picker,
  Text,
  DatePicker,
  Spacer,
  Bound,
  Bindable,
  swifty,
  VStack,
  HStack,
  ZStack,
  BorderedButtonStyle,
  withAnimation,
  UIApplication,
  TextEditor,
  MenuPickerStyle,
} from "@tswift/ui";
import { categories, ItemType, ViewContextMethods } from "./Models";

const { white, black } = Color;
export interface NewItemConfig {
  namespace: typeof Namespace["ID"];
  newItemOpen: Bindable<boolean>;
}
class NewItemClass extends Viewable<NewItemConfig> {
  @Environment(".managedObjectContext") private viewContext =
    new ViewContext<ItemType>();

  namespace: typeof Namespace["ID"];

  @State category = "Business";
  @State dueDate = new Date();
  @State toDoText = "";

  @Binding newItemOpen?: Bindable<boolean>;

  toDoTextLimit = 70;
  constructor({ namespace, newItemOpen }: NewItemConfig) {
    super();
    this.namespace = namespace;
    this.newItemOpen = newItemOpen;
  }

  body = (
    { $category, category, newItemOpen, $dueDate, $toDoText }: Bound<this>,
    self: typeof this = this
  ) =>
    ZStack(
      ScrollView(
        VStack(
          Picker({
            selection: $category,
            label: Text(category),
          })
            .font(Font.body.bold())
            .padding()
            .foregroundColor(".black")
            .frame({ maxWidth: ".infinity", alignment: ".leading" })
            //.frame(height: 50)
            .background(
              ZStack()
                .color(this.getCategoryColor(category)?.opacity(0.7))
                .frame({ maxWidth: ".infinity", maxHeight: ".infinity" })
                .padding(".horizontal", 10)
                .padding(".vertical", 2),
              VStack()
                // empty VStack for the blur
                .frame({ maxWidth: ".infinity", maxHeight: ".infinity" })
                .background(
                  ".thinMaterial",
                  RoundedRectangle({ cornerRadius: 5 })
                )
            )
        )
        // '.leading'
      )
        .shadow({ color: black.opacity(0.1), radius: 20, x: 5, y: 10 })
        .shadow({ color: black.opacity(0.1), radius: 1, x: 1, y: 1 })
        .shadow({ color: white.opacity(1), radius: 5, x: -1, y: -1 }),
      ForEach(categories, ($0) => Text($0.category).tag($0.category))
        .pickerStyle(MenuPickerStyle())
        .padding(),

      DatePicker(
        { selection: $dueDate, displayedComponents: "date" },
        Text("Due date")
      )
        .padding(".horizontal")
        .padding(".vertical", 10)
        .accentColor(Color.indigo)
        .padding(),

      ZStack(
        {
          alignment: ".leading",
        },
        ...(self.toDoText?.length
          ? [
              VStack(
                { alignment: ".leading" },
                Text("Enter your todo item")
                  .font(Font.body)
                  .foregroundColor(Color.gray),
                Spacer()
              ),
            ]
          : [])
      )
        .padding(".vertical", 12)
        .padding(".horizontal", 4)
        .zIndex(0),

      TextEditor({ text: $toDoText })
        .frame({ height: 200, alignment: ".leading" })
        .frame({ maxWidth: ".infinity" })
        .lineSpacing(5)
        //     .onReceive(Just(toDoText)) {
        //         toDoText in
        //         textChanged(upper: toDoTextLimit, text: & self.toDoText)
        // }
        .zIndex(1)
        .opacity(self.toDoText.length ? 0.25 : 1)

        .frame({ height: 200, alignment: ".leading" })
        .frame({ maxWidth: ".infinity" })
        .padding(".horizontal", 30),

      Button({
        role: ".none",
        action() {
          ViewContextMethods.addItem(
            self.viewContext,
            self.dueDate,
            self.toDoText,
            self.category
          );
          withAnimation(() => self.newItemOpen?.(false));
        },
        label: HStack(
          Text("New task "),
          Image({ systemName: "chevron.up" })
        ).frame({ maxWidth: ".infinity" }),
      })
        .buttonStyle(BorderedButtonStyle({ shape: ".roundedRectangle" }))
        .tint(".indigo")
        .controlProminence(".increased")
        .controlSize(".large")
        .shadow({ color: black.opacity(0.1), radius: 20, x: 5, y: 10 })
        .shadow({ color: black.opacity(0.1), radius: 1, x: 1, y: 1 })
        .shadow({ color: white.opacity(1), radius: 5, x: -1, y: -1 })
        .padding()

        .padding(".top", 100)
        .background(Color.white)
        .frame({ maxWidth: ".infinity", maxHeight: ".infinity" })
        .onTapGesture(UIApplication.shared.endEditing),
      VStack(
        HStack(
          Spacer(),
          Button(
            {
              action() {
                withAnimation(() => newItemOpen?.(false));
              },
            },
            Image({ systemName: "xmark.circle.fill" })
              .resizable()
              .frame({ width: 60, height: 60 })
              .foregroundColor(".indigo")
              .shadow({
                color: Color.indigo.opacity(0.3),
                radius: 10,
                x: 0,
                y: 10,
              })
              .padding()
          )
        ).matchedGeometryEffect({ id: "button", in: this.namespace }),

        Spacer()
      )
    );

  // textChanged(upper: number, text:string) {
  //     if (text.length > upper) {
  //         text = text.prefix(upper)
  //     }
  // }

  getCategoryColor = (categoryChosen: string) => {
    return categories.find((v) => (v.category = categoryChosen))?.color;
  };
}

// struct NewItem_Previews: PreviewProvider {

//     @Namespace static var namespace

//     static var previews: some View {
//         NewItem(namespace: namespace,
//                 newItemOpen: .constant(false)
//         )
//     }
// }
export const NewItem = swifty(NewItemClass);
