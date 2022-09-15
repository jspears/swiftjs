import { Viewable, Image, Bound, VStack, Font, main } from "@tswift/ui";

@main
export class ImageDemo extends Viewable {
  body = VStack(
    Image("rectangle.and.pencil.and.ellipsis")
      .imageScale(".small")
      .font(Font.system(60)),
    Image("rectangle.and.pencil.and.ellipsis")
      .imageScale(".medium")
      .font(Font.system(60)),
    Image("rectangle.and.pencil.and.ellipsis")
      .imageScale(".large")
      .font(Font.system(60))
  );
}
