import { tt } from "./testUtil";

describe('switch', function () {
    it('should process switch', tt`
let someCharacter: Character = "z"
switch someCharacter {
case "a","b":
    print("The first letter of the alphabet")
case "z":
    print("The last letter of the alphabet")
default:
    print("Some other character")
}`);

    it('should process self switch', tt`
enum Rank: Int {
    case two = 2, three, four, five, six, seven, eight, nine, ten
    case jack, queen, king, ace
    struct Values {
        let first: Int, second: Int?
    }
    var values: Values {
        switch self {
        case .ace:
            return Values(first: 1, second: 11)
        case .jack, .queen, .king:
            return Values(first: 10, second: nil)
        default:
            return Values(first: self.rawValue, second: nil)
        }
    }
}
`)

});