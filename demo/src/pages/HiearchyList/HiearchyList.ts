import { Identifiable, swifty, UUID, main,Viewable, List, Text } from "@tswift/ui";
interface CustomStringConvertible {}
interface Hashable {}
const FileItem = swifty(
  class FileItem implements Hashable, Identifiable, CustomStringConvertible {
    public id = UUID();
    constructor(
      public name: string,
      public children: FileItem[] | null = null,
      public description: string = children == null
        ? `📄 ${name}`
        : children.length
        ? `📂 ${name}`
        : `📁 ${name}`
    ) {}
  }
);

@main
export class HiearchyList extends Viewable {
  fileHierarchyData = [
    FileItem("users", [
      FileItem("user1234", [
        FileItem("Photos", [
          FileItem("photo001.jpg"),
          FileItem("photo002.jpg"),
        ]),
        FileItem("Movies", [FileItem("movie001.mp4")]),
        FileItem("Documents", []),
      ]),
      FileItem("newuser", [FileItem("Documents", [])]),
    ]),
    FileItem("private", null),
  ];
  body = List<ReturnType<typeof FileItem>>({
    data: this.fileHierarchyData,
    children: ".children",
    content: (item: any) => Text(item.description),
  } as any);
}
