//
//  CategoryCards.swift
//  TodoAppSwiftUI3
//
//  Created by Roman Luzgin on 21.06.21.
//

import {Viewable, Color, VStack, Text, Font, ZStack,RoundedRectangle} from 'swiftjs';

export class CategoryCards extends Viewable {
    category?: string
    color?: typeof Color;
    numberOfTasks = 0;
    tasksDone = 0
    
    maxProgress = 180.0
    
    get progress(){
        if (this.tasksDone == 0){
            return 0;
        }
      return this.maxProgress*this.tasksDone/this.numberOfTasks;
    }
    
     body= VStack({alignment: '.leading'},
            Text("\(numberOfTasks) tasks")
                .font(Font.callout)
                .foregroundColor(Color.secondary),
            Text(this.category)
                .font(Font.title.bold()),
            
            ZStack({alignment: '.leading'},
                RoundedRectangle({cornerRadius: 20, style: '.continuous'})
                    .frame({maxWidth: this.maxProgress})
                    .frame({height: 5})
                    .foregroundColor(Color.gray.opacity(0.5)),
                
                RoundedRectangle({cornerRadius: 20, style: '.continuous'})
                    .frame({maxWidth: this.maxProgress})
                    .frame({width: this.numberOfTasks > 0 ? this.progress : 0, height: 5})
                    .foregroundColor(this.color.opacity(0.9))
            )
            
            
            
     )
        .padding(10)
        .frame({width: 200, height: 120, alignment: '.leading'})
        .background(
            ZStack (
            
            LinearGradient({colors: [this.color.opacity(0.95), this.color.opacity(0.3)],
                           startPoint: '.topLeading', endPoint: '.bottomTrailing'})
            
                .frame({maxWidth: '.infinity', maxHeight: '.infinity'})
                .padding(20),
            
            VStack (
                // empty VStack for the blur
            )
            .frame({maxWidth: '.infinity', maxHeight: '.infinity'})
            .background('.thinMaterial')
            ),
            {alignment: '.leading'}
        )
        .clipShape(RoundedRectangle({cornerRadius: 20, style: '.continuous'}))
        .shadow({color: Color.black.opacity(0.1), radius: 20, x: 5, y: 10})
        .shadow({color: Color.black.opacity(0.1), radius: 1, x: 1, y: 1})
        .shadow({color: Color.white.opacity(1), radius: 5, x: -1, y: -1})
    )
)

CategoryCards_Previews: PreviewProvider {
    static previews:  View(
        CategoryCards({category: "Business",
                      color: Color.cyan,
                      numberOfTasks: 40,
                      tasksDone: 20})
    )
}
