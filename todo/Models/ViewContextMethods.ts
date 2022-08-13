//
//  ViewContextMethods.swift
//  TodoAppSwiftUI3
//
//  Created by Roman Luzgin on 22.06.21.
//
import { withAnimation } from 'swiftjs';
import { ViewContext } from 'swiftjs/CoreData';
import {Item,ItemType,} from './Categories';



export class ViewContextMethods {

    static addItem(
        context: ViewContext<ItemType>,
        dueDate: Date,
        toDoText: string,
        category: string
    ) {
        withAnimation( ()=> {
            const newItem = Item(context)
            newItem.timestamp = Date()
            newItem.dueDate = dueDate
            newItem.toDoText = toDoText
            newItem.isDone = false
            newItem.category = category
            
            try {
                 context.save()
            } catch(error) {
                // Replace this implementation with code to handle the error appropriately.
                // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
                // let nsError = error as NSError
                // fatalError("Unresolved error \(nsError), \(nsError.userInfo)")
            }
       });
    }
    
    static isDone(item: ItemType, context: ViewContext<ItemType>) {
        withAnimation(()=>{
            item.isDone.toggle()
        try {
             context.save()
        } catch(error) {
            // Replace this implementation with code to handle the error appropriately.
            // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
  //          let nsError = error as NSError
//            fatalError("Unresolved error \(nsError), \(nsError.userInfo)")
        }
    });
    }
    
}
