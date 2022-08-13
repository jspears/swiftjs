//
//  ContentView.swift
//  TodoAppSwiftUI3
//
//  Created by Roman Luzgin on 21.06.21.
//

//import 'SwiftUI';
//import CoreData
import {Capsule, Color, Environment, FetchRequest,IndexSet, Viewable, View, NavigationView, ForEach, List,InsetGroupedListStyle, HStack,VStack,Image, Section, Spacer, Toggle, Text, State, withAnimation} from 'swiftjs';
import {FetchedResults, NSSortDescriptor, ViewContext} from 'swiftjs/CoreData'
import {Item, ViewContextMethods, categories, ItemType} from './Models';

//https://raw.githubusercontent.com/roman-luzgin/TodoAppSwiftUI3/main/TodoAppSwiftUI3/ToDoList.swift


export class ToDoList extends Viewable {
     @Environment('.managedObjectContext') 
     private viewContext:ViewContext<ItemType> = new ViewContext();
    
     @FetchRequest({
         sortDescriptors: [NSSortDescriptor({keyPath: '.dueDate', ascending: false})],
         animation: '.default'})

    private items: FetchedResults<ItemType> = [];
    
    @State private searchQuery = "";
    @State private notDoneOnly = false;

   
    body = ()=>View(
        NavigationView (
            List (
                Section (
                    HStack (
                        Toggle({isOn: this.$`notDoneOnly`},
                            Text(this.notDoneOnly ? "Show all items" : "Show not done only")
                                .frame({maxWidth: '.infinity'})
                        )
                        .toggleStyle('.button')
                        .tint('.indigo')
                        .clipShape(Capsule())
                        .animation('.easeInOut', this.notDoneOnly)
                    )
                ),
                Section (
                    ForEach(this.searchResults, (item)=>
                        HStack (
                            Image({systemName: item.isDone ? "circle.fill" : "circle"})
                                .resizable()
                                .foregroundColor(this.getCategoryColor(item))
                                .frame({width: 30, height: 30})
                                .onTapGesture(()=>
                                    withAnimation(()=>{
                                        ViewContextMethods.isDone(item,  this.viewContext)
                                    })
                                )
                                .padding('.trailing', 10),
                            
                            VStack (
                                HStack (
                                    Text(`\(item.toDoText ?? "")`)
                                        .fixedSize({horizontal: false, vertical: true}),
                                    Spacer(),
                                )
                                .padding('.bottom', 5),
                                
                                HStack(
                                    Text(`Due: \(item.dueDate!, formatter: itemFormatter)`)
                                        .font('.caption')
                                        .foregroundColor('.secondary'),
                                    Spacer(),
                                    Text(item.category ?? "Unknown")
                                        .font('.caption')
                                        .foregroundColor('.secondary'),
                                   )
                ).padding('.leading', 5)
                                )
                        .frame({maxHeight: 130})
                        .listRowSeparator('.hidden') // no separators
                )
                    .onDelete(this.deleteItems)
                )
            )
            .listStyle(InsetGroupedListStyle())
            .refreshable(()=> {
                //await store.loadStats()
                console.log("refreshed")
            })
            .searchable("Search in history", this.searchQuery, '.automatic')
            .navigationTitle("All todo items")
            
    ));
    
    
    get searchResults(): ItemType[] {
        return [];
    }
    //     if searchQuery.isEmpty{
    //         // getting all items
    //         switch notDoneOnly {
    //         case true:
    //             return items.filter {
    //                 !$0.toDoText!.isEmpty && $0.isDone == false
    //             }
    //         default:
    //             return items.filter {
    //                 !$0.toDoText!.isEmpty
    //             }
    //         }
            
    //     } else {
    //         // getting only searched items
    //         switch notDoneOnly {
    //         case true:
    //             return items.filter {
    //                 $0.toDoText!.lowercased().contains(searchQuery.lowercased()) && $0.isDone == false
    //             }
    //         default:
    //             return items.filter {
    //                 $0.toDoText!.lowercased().contains(searchQuery.lowercased())
    //             }
    //         }
            
    //     }
    // }
    
    private getCategoryColor(toDoItem: ItemType) {
        return   categories.find(v=>toDoItem.id === v.id)?.color;

    }
    
    
    private deleteItems(offsets: IndexSet) {
        withAnimation(()=> {
            //offsets.map { items[$0] }.forEach(viewContext.delete)
            offsets.forEach($0=>this.viewContext.delete(this.items[$0]));
            try {
                this.viewContext.save()
            } catch(error) {
                // Replace this implementation with code to handle the error appropriately.
                // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
                // let nsError = error as NSError
                // fatalError("Unresolved error \(nsError), \(nsError.userInfo)")
            }
        })
    }
}
type Bindable = Exclude<(keyof ToDoList) & string, '$' | 'body'>;
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