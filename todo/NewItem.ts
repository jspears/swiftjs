//
//  NewItem.swift
//  TodoAppSwiftUI3
//
//  Created by Roman Luzgin on 28.06.21.
//

import { ViewContext } from "swiftjs/CoreData"
import { Viewable, State, Color, Namespace, Binding, Environment, Font,ForEach,ScrollView, RoundedRectangle, VStack, Picker, Text, DatePicker, Spacer, Button, View} from "swiftjs"
import { categories } from "./Models";

const {white, black} = Color;
export interface NewItemConfig {

}
export class NewItem extends Viewable<NewItemConfig> {
    @Environment('.managedObjectContext') private viewContext = new ViewContext();
    
    namespace?: typeof Namespace['ID']
    
    @State private  category = "Business"
    @State private  dueDate = new Date()
    @State private  toDoText = ""
    
    @Binding  newItemOpen?: boolean;
    
    toDoTextLimit = 70
    
     body= View (
        
        ZStack (
            
            ScrollView (
                VStack (
                    Picker({selection: this.$category,
                           label:Text(this.category)})
                            .font(Font.body.bold())
                            .padding()
                            .foregroundColor('.black')
                            .frame({maxWidth: '.infinity', alignment: '.leading'})
                           //.frame(height: 50)
                            .background(
                                ZStack ({color:this.getCategoryColor( this.category)?.opacity(0.7)})
                            .frame({maxWidth: '.infinity', maxHeight: '.infinity'})
                            .padding('.horizontal', 10)
                            .padding('.vertical', 2),
                        VStack (
                            // empty VStack for the blur
                        )
                        .frame({maxWidth: '.infinity', maxHeight: '.infinity'})
                        .background('.thinMaterial',  RoundedRectangle({cornerRadius: 5}))
                )),
                                {alignment: '.leading'}
                            )
                            .shadow({color: black.opacity(0.1), radius: 20, x: 5, y: 10})
                            .shadow({color: black.opacity(0.1), radius: 1, x: 1, y: 1})
                            .shadow({color: white.opacity(1), radius: 5, x: -1, y: -1})
                    ,
                        ForEach(this.categories, $0=>(
                            Text($0.category)
                                .tag($0.category)
                            
                        )
        )
                    .pickerStyle(MenuPickerStyle())
                    .padding()

                    DatePicker({selection: this.$`dueDate`, displayedComponents: this.date},
                        Text("Due date")
                        
                    )
                    .padding(.horizontal)
                    .padding(.vertical, 10)
                    .accentColor(Color.indigo)
                    .padding()
                    
                    ZStack(alignment: .leading) {
                        if toDoText.isEmpty {
                            VStack(alignment: .leading) {
                                Text("Enter your todo item")
                                    .font(Font.body)
                                    .foregroundColor(Color.gray)
                                Spacer()
                            }
                            .padding(.vertical, 12)
                            .padding(.horizontal, 4)
                            .zIndex(0)
                        }
                        TextEditor(text: $toDoText)
                        
                            .frame(height: 200, alignment: .leading)
                            .frame(maxWidth: .infinity)
                            .lineSpacing(5)
                            .onReceive(Just(toDoText)) { toDoText in
                                textChanged(upper: toDoTextLimit, text: &self.toDoText)
                            }
                            .zIndex(1)
                            .opacity(toDoText.isEmpty ? 0.25 : 1)
                        
                    }
                    .frame(height: 200, alignment: .leading)
                    .frame(maxWidth: .infinity)
                    .padding(.horizontal, 30)
                    
                    
                    Button(role: .none, action: {
                        ViewContextMethods.addItem(context: viewContext, dueDate: dueDate, toDoText: toDoText, category: category)
                        withAnimation {
                            newItemOpen = false
                        }
                    }, label: 
                        HStack (
                            Text("New task "),
                            Image(systemName: "chevron.up")
                        )
                        .frame({maxWidth: '.infinity'})
                    )
                        .buttonStyle(BorderedButtonStyle(shape: .roundedRectangle))
                        .tint('.indigo')
                        .controlProminence('.increased')
                        .controlSize('.large')
                        .shadow({color: black.opacity(0.1), radius: 20, x: 5, y: 10})
                        .shadow({color: black.opacity(0.1), radius: 1, x: 1, y: 1})
                        .shadow({color: white.opacity(1), radius: 5, x: -1, y: -1})
                        .padding()
                    
        )
                .padding(
                    '.top', 100)
                .background(Color.white)
                                .frame({maxWidth: '.infinity', maxHeight: '.infinity'})
                                .onTapGesture(    UIApplication.shared.endEditing)
     )
            
            
            VStack(
                HStack(
                    Spacer(),
                    Button({action(){
                        withAnimation(()=>
                            newItemOpen = false
                        )
                    )),
                      Image({systemName: "xmark.circle.fill"})
                            .resizable()
                            .frame({width: 60, height: 60})
                            .foregroundColor('.indigo')
                            .shadow({color: .indigo.opacity(0.3), radius: 10, x: 0, y: 10})
                            .padding()
            )
               )
                .matchedGeometryEffect({id: "button", in: this.namespace}),
                
                Spacer()
            )
        )
        
        
    )
    
    // textChanged(upper: number, text:string) {
    //     if (text.length > upper) {
    //         text = text.prefix(upper)
    //     }
    // }
    
    private  getCategoryColor(categoryChosen: string):Color=> {
        return        categories.find(v=>v.category = categoryChosen)?.color;
    }
    
}

// struct NewItem_Previews: PreviewProvider {
    
//     @Namespace static var namespace
    
//     static var previews: some View {
//         NewItem(namespace: namespace,
//                 newItemOpen: .constant(false)
//         )
//     }
// }
