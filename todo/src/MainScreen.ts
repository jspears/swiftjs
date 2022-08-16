//
//  MainScreen.swift
//  TodoAppSwiftUI3
//
//  Created by Roman Luzgin on 22.06.21.
//

import {
  Haptics,
  Color,
  Viewable,
  Environment,
  FetchRequest,
  PlainButtonStyle,
  Namespace,
  State,
  Binding,
  AppStorage,
  Image,
  Text,
  ZStack,
  HStack,
  ScrollView,
  Spacer,
  VStack,
  ForEach,
  withAnimation,
  Font,
  NavigationView,
  LazyHStack,
  Button,
  LazyVStack,
  Bound,
  Calendar,
  RoundedRectangle,
  Toggle,
  toggle,
} from "@jswift/ui";
import {
  FetchedResults,
  NSSortDescriptor,
  ViewContext,
} from "@jswift/CoreData";
import {
  categories,
  ItemCategoryType,
  ItemType,
  ViewContextMethods,
} from "./Models";
import { NewItem } from "./NewItem";
import { Settings } from "./Settings";
import { CategoryCards } from "./ViewModels/CategoryCards";
const { white, black } = Color;

export class MainScreen extends Viewable {
  @Environment(".managedObjectContext") viewContext =
    new ViewContext<ItemType>();

  @Namespace private namespace?: string;

  @FetchRequest({
    sortDescriptors: [
      NSSortDescriptor({ keyPath: ".timestamp", ascending: false }),
    ],
    animation: ".default",
  })
  private items: FetchedResults<ItemType> = [];

  private get todaysItems(): ItemType[] {
    return (
      this.items?.filter(($0) =>
        Calendar.current.isDate($0.dueDate ?? new Date(), new Date(), ".day")
      ) ?? []
    );
  }

  @State newItemOpen = false;
  @State settingsOpen = false;

  @Binding menuOpen?: boolean;

  @AppStorage("userName") userName = "";

  body = (
    { $newItemOpen, newItemOpen, $menuOpen, $settingsOpen }: Bound<this>,
    { userName, ...self } = this
  ) =>
    ZStack(
      !newItemOpen
        ? NavigationView(
            ZStack(
              ScrollView(
                VStack(
                  HStack(
                    Text("Categories")
                      .font(Font.body.smallCaps())
                      .foregroundColor(".secondary"),
                    Spacer()
                  ).padding(".horizontal"),

                  ScrollView({
                    alignment: ".horizontal",
                    showsIndicators: false,
                    content: () =>
                      LazyHStack(
                        { spacing: 20 },
                        ForEach(categories, (category) =>
                          CategoryCards({
                            category: category.category,
                            color: category.color,
                            numberOfTasks: this.getTotalTasksNumber(category),
                            tasksDone: this.getDoneTasksNumber(category),
                          })
                        )
                      ).padding(".bottom", 30),
                  })
                    .padding(".leading", 20)
                    .padding(".trailing", 30)
                ).frame({ height: 190 })
              ).padding(".top", 30),

              // MARK: Actual list of todo items
              VStack(
                HStack(
                  Text("Today's tasks")
                    .font(Font.body.smallCaps())
                    .foregroundColor(".secondary"),
                  Spacer()
                ).padding(".horizontal"),

                this.todaysItems.length
                  ? LazyVStack(
                      { spacing: 10 },
                      ForEach(this.todaysItems, (toDoItem) =>
                        // MARK: Today's tasks list view
                        VStack(
                          { alignment: ".leading" },
                          HStack(
                            Image({
                              systemName: toDoItem.isDone()
                                ? "circle.fill"
                                : "circle",
                            })
                              .resizable()
                              .foregroundColor(this.getCategoryColor(toDoItem))
                              .frame({ width: 30, height: 30 })
                              .onTapGesture(() =>
                                withAnimation(() =>
                                  ViewContextMethods.isDone(
                                    toDoItem,
                                    this.viewContext
                                  )
                                )
                              )
                              .padding(".leading", 20)
                              .padding(".trailing", 10),

                            Text(toDoItem.toDoText ?? ""),
                            Spacer()
                          )
                        )
                          .frame({ maxWidth: ".infinity" })
                          .frame({ height: 100 })
                          .background(
                            ZStack({
                              color: self
                                .getCategoryColor(toDoItem)
                                ?.opacity(0.7),
                            })
                              .frame({
                                maxWidth: ".infinity",
                                maxHeight: ".infinity",
                              })
                              .padding(".horizontal", 30)
                              .padding(".vertical", 20),
                            VStack()
                            // empty VStack for the blur
                              .frame({
                                maxWidth: ".infinity",
                                maxHeight: ".infinity",
                              })
                              .background(".thinMaterial", {
                                in: RoundedRectangle({ cornerRadius: 20 }),
                              })
                          )
                      )
                        .shadow({
                          color: black.opacity(0.1),
                          radius: 20,
                          x: 5,
                          y: 10,
                        })
                        .shadow({
                          color: black.opacity(0.1),
                          radius: 1,
                          x: 1,
                          y: 1,
                        })
                        .shadow({
                          color: white.opacity(1),
                          radius: 5,
                          x: -1,
                          y: -1,
                        })
                        .padding(".horizontal")
                    ).padding(".bottom", 60)
                  : VStack(
                      Text("No tasks for today").foregroundColor(".secondary")
                    ).frame({ height: 200 })
              )
            ),

            // MARK: Bottom button to add new item
            VStack(
              Spacer(),
              HStack(
                Spacer(),
                Button(
                  {
                    action() {
                      withAnimation(toggle($newItemOpen));
                    },
                  },
                  Image({ systemName: "plus.circle.fill" })
                    .resizable()
                    .frame({ width: 70, height: 70 })
                    .foregroundColor(".indigo")
                    .shadow({
                      color: Color.indigo.opacity(0.3),
                      radius: 10,
                      x: 0,
                      y: 10,
                    })
                    .padding()
                )
              ).matchedGeometryEffect({ id: "button", in: this.namespace })
            )
          )
            .navigationTitle(
              !userName ? "Hi there!" : `What's up, ${userName}!`
            )

            // MARK: Navigation bar buttons to open different menus
            .navigationBarItems({
              leading: Button(
                {
                  action() {
                    withAnimation(() => $menuOpen(!self.menuOpen));
                    Haptics.giveSmallHaptic();
                  },
                },
                Image({
                  systemName: "rectangle.portrait.leftthird.inset.filled",
                }).foregroundColor(Color.indigo)
              ).buttonStyle(PlainButtonStyle()),

              trailing: Button(
                {
                  action() {
                    withAnimation(() => $settingsOpen(!self.settingsOpen));
                    Haptics.giveSmallHaptic();
                  },
                },
                Image({ systemName: "gear.circle.fill" })
                  .resizable()
                  .frame({ width: 40, height: 40 })
                  .foregroundColor(Color.indigo)
              )
                .buttonStyle(PlainButtonStyle())
                .sheet({
                  isPresented: $settingsOpen,
                  onDismiss() {
                    self.settingsOpen = false;
                  },
                  content: Settings(),
                }),
            })
        : // MARK: New item view
          NewItem({
            namespace: this.namespace || "",
            newItemOpen: $newItemOpen,
          })
    );

  // MARK: functions
  // func getCategoryColor(toDoItem: Item) -> Color {
  //     var category: [ItemCategory] {
  //         categories.filter {
  //             $0.category == toDoItem.category
  //         }
  //     }

  //     return category[0].color
  // }
  getCategoryColor = (toDoItem: ItemType) => {
    return categories.find(($0) => $0.category == toDoItem.category)?.color;
  };
  // func getTotalTasksNumber(category: ItemCategory) -> Int {
  //     var categoryTasks: [Item] {
  //         items.filter {
  //             $0.category == category.category
  //         }
  //     }

  //     return categoryTasks.count
  // }
  getTotalTasksNumber(category: ItemCategoryType) {
    return this.items.filter(($0) => $0.category === category.category).length;
  }

  getDoneTasksNumber(category: ItemCategoryType): number {
    // var categoryTasksDone: [Item] {
    //     items.filter {
    //         $0.category == category.category && $0.isDone == true
    //     }
    // }

    // return categoryTasksDone.count
    return this.items.filter(
      ($0) => $0.category === category.category && $0.isDone() == true
    ).length;
  }
}

// struct MainScreen_Previews: PreviewProvider {
//     static  previews = View(
//         MainScreen(menuOpen: .constant(false))
//     )
// }
