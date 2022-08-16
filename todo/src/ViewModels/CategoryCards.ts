//
//  CategoryCards.swift
//  TodoAppSwiftUI3
//
//  Created by Roman Luzgin on 21.06.21.
//

import {
  Viewable,
  Color,
  VStack,
  Text,
  Font,
  LinearGradient,
  ZStack,
  RoundedRectangle,
  swifty,
  View,
  Bound,
} from '@jswift/ui';
interface CategoryCardsConfig {
  category: string;
  color: Color;
  numberOfTasks: number;
  tasksDone: number;
}
class CategoryCardsClass
  extends Viewable<CategoryCardsConfig>
  implements Omit<CategoryCardsConfig, 'color'>
{
  category: string;
  numberOfTasks: number;
  tasksDone: number;
  maxProgress = 180.0;

  constructor(config: CategoryCardsConfig, ...views: View[]) {
    super(...views);
    this.category = config.category;
    this.color(config.color);
    this.numberOfTasks = config.numberOfTasks || 0;
    this.tasksDone = config.tasksDone || 0;
  }

  get progress() {
    if (this.tasksDone == 0) {
      return 0;
    }
    return (this.maxProgress * this.tasksDone) / this.numberOfTasks;
  }

  body = (bound: Bound<this>, self = this) =>
    VStack(
      { alignment: '.leading' },
      Text('(numberOfTasks) tasks')
        .font('.callout')
        .foregroundColor('.secondary'),
      Text(this.category || '').font(Font.title.bold()),

      ZStack(
        { alignment: '.leading' },
        RoundedRectangle({ cornerRadius: 20, style: '.continuous' })
          .frame({ maxWidth: self.maxProgress })
          .frame({ height: 5 })
          .foregroundColor(Color.gray.opacity(0.5)),

        RoundedRectangle({ cornerRadius: 20, style: '.continuous' })
          .frame({ maxWidth: self.maxProgress })
          .frame({
            width: self.numberOfTasks > 0 ? self.progress : 0,
            height: 5,
          })
          .foregroundColor(self.config?.color?.opacity(0.9))
      )
    )
      .padding(10)
      .frame({ width: 200, height: 120, alignment: '.leading' })
      .background(
        ZStack(
          { alignment: '.leading' },
          LinearGradient({
            colors: [
              self.config?.color?.opacity(0.95),
              self.config?.color?.opacity(0.3),
            ],
            startPoint: '.topLeading',
            endPoint: '.bottomTrailing',
          })
            .frame({ maxWidth: '.infinity', maxHeight: '.infinity' })
            .padding(20),

          VStack()
            // empty VStack for the blur
            .frame({ maxWidth: '.infinity', maxHeight: '.infinity' })
            .background('.thinMaterial')
        )
      )
      .clipShape(RoundedRectangle({ cornerRadius: 20, style: '.continuous' }))
      .shadow({ color: Color.black.opacity(0.1), radius: 20, x: 5, y: 10 })
      .shadow({ color: Color.black.opacity(0.1), radius: 1, x: 1, y: 1 })
      .shadow({ color: Color.white.opacity(1), radius: 5, x: -1, y: -1 });
}

// CategoryCards_Previews: PreviewProvider {
//     static previews = View(
//         CategoryCards({category: "Business",
//                       color: Color.cyan,
//                       numberOfTasks: 40,
//                       tasksDone: 20})
//     )
// }

export const CategoryCards = swifty(CategoryCardsClass);
