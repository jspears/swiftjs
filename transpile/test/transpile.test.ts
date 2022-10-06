import {runTranspile, testTranspile} from './testUtil'

describe('transpile', function () {
    it('should transpile infered property', testTranspile(
        `
        struct TestInferredProp {
            private let stuff = 0;
        }
        `
    ));
    it('should transpile properties', testTranspile(`
        import SwiftUI
        //Animation Demo
        struct AnimationDemo: View {
            static var foo = "foo-1";    
            @State private var angle: Double = 0;
            @State private var color: Color = .blue;
            @State private var isBold: Bool = false;
            //a comment here
            private let stuff = 0;
            private var name = "somestring";
            let pi:Double = 3.1456
            let str:String;
            let i:Int = 1;
        }
       
        `));
    it('should do get/set', testTranspile(`
        struct Point {
            var x = 0.0, y = 0.0
        }
        struct Size {
            var width = 0.0, height = 0.0
        }
        struct Rect {
            var origin = Point()
            var size = Size()
            var center: Point {
                get {
                    let centerX = origin.x + (size.width / 2)
                    let centerY = origin.y + (size.height / 2)
                    return Point(x: centerX, y: centerY)
                }
                set(newCenter) {
                    origin.x = newCenter.x - (size.width / 2)
                    origin.y = newCenter.y - (size.height / 2)
                }
            }
        }
        `));

    it('should do handle multiple assignments',testTranspile(`
        struct Point {
            var x = 0.0, y = 0.0
        }
        let p = Point(x:1, y:2)
      
        `));

    it('should init when it can', testTranspile(`
        struct Celsius {
            var temperatureInCelsius: Double
            init(fromFahrenheit fahrenheit: Double) {
                temperatureInCelsius = (fahrenheit - 32.0) / 1.8
            }
            init(fromKelvin kelvin: Double) {
                temperatureInCelsius = kelvin - 273.15
            }
            init(celsius: Double?) {
                temperatureInCelsius = celsius;
            }
        }
        let boilingPointOfWater = Celsius(fromFahrenheit: 212.0)
        `));
    it('should parse generic template', testTranspile(`struct Stack<Element> {
            var items: [Element] = []
            mutating func push(_ item: Element) {
                items.append(item)
            }
            mutating func pop() -> Element {
                return items.removeLast()
            }
        }
        `)
    );
    it('should parse computed props', testTranspile(`struct Cuboid {
            var width = 0.0, height = 0.0, depth = 0.0
            var volume: Double {
                return width * height * depth
            }
        }
        let fourByFiveByTwo = Cuboid(width: 4.0, height: 5.0, depth: 2.0)`)
    );
    it('should support willget', testTranspile(`class StepCounter {
            var totalSteps: Int = 0 {
                willSet(newTotalSteps) {
                    print("About to set totalSteps to \(newTotalSteps)")
                }
                didSet {
                    if totalSteps > oldValue  {
                        print("Added \(totalSteps - oldValue) steps")
                    }
                }
            }
        }
        let stepCounter = StepCounter()`));

    it('should parse optional props', testTranspile(`struct Cuboid {
            var volume: Double? = 0.0;
        }
        `));

    it('should parse closure', testTranspile(`
    let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]
    func backward(_ s1: String, _ s2: String) -> Bool {
        return s1 > s2
    }
    var reversedNames = names.sorted(by: backward)
    
    `));
    it('should transform simple enum', testTranspile(`
    enum CompassPoint {
        case north
        case south
        case east
        case west
    }
    `));
    it('should transform valued enum',testTranspile(`
    enum Suit: Character {
        case spades = "♠", hearts = "♡", diamonds = "♢", clubs = "♣"
    }
    
    `));
    it('shoud auto increment enum', testTranspile(`
        enum Month : Int  { 
            case January = 1, 
            February, March, April, May, June, 
            July, August, September, October, November, December
            
        } 
    `));

    it('nested enum class', testTranspile(`
    struct BlackjackCard {

        // nested Suit enumeration
        enum Suit: Character {
            case spades = "♠", hearts = "♡", diamonds = "♢", clubs = "♣"
        }
    
        // nested Rank enumeration
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
    
        // BlackjackCard properties and methods
        let rank: Rank, suit: Suit
        var description: String {
            var output = "suit is \(suit.rawValue),"
            output += " value is \(rank.values.first)"
            if let second = rank.values.second {
                output += " or \(second)"
            }
            return output
        }
    }
    `));
    
    it('parse weird if let', testTranspile(`
    var output = "suit"
    if let second = rank.values.second {
        output += " or \(second)"
    }
 
    `));

    it('should parse number', testTranspile(`
    let decimalInteger = 17
    let binaryInteger = 0b10001       // 17 in binary notation
    let octalInteger = 0o21           // 17 in octal notation
    let hexadecimalInteger = 0x11 
    
    `));
    it('should parse tuple',testTranspile(
`
    let http200Status = (statusCode: 200, description: "OK")
    let http404Error = (404, "Not Found");
    let (statusCode, statusMessage) = http404Error;

` 
    ));
    it('should parse do/try/throw', testTranspile(`
    func canThrowAnError() throws {
    }
    do {
        try canThrowAnError()
        // no error was thrown
    } catch {
        // an error was thrown
    }
    `))

    // it('should handle throw mutltiple catch', ()=>runTranspile(`
    // func makeASandwich() throws {
    //     // ...
    // }
    // func eatASandwich() {}
    // func buyGroceries(ingredients:String){}

    // do {
    //     try makeASandwich()
    //     eatASandwich()
    // } catch SandwichError.outOfCleanDishes {
    //    // washDishes()
    // } catch SandwichError.missingIngredients(let ingredients) {
    //     buyGroceries(ingredients)
    // }
    
    // `))
    it('should handle guard and stuff', testTranspile(
        `class VendingMachine {
            var inventory = [
                "Candy Bar": Item(price: 12, count: 7),
                "Chips": Item(price: 10, count: 4),
                "Pretzels": Item(price: 7, count: 11)
            ]
            var coinsDeposited = 0
        
            func vend(itemNamed name: String) throws {
                guard let item = inventory[name] else {
                    throw VendingMachineError.invalidSelection
                }
        
                guard item.count > 0 else {
                    throw VendingMachineError.outOfStock
                }
        
                guard item.price <= coinsDeposited else {
                    throw VendingMachineError.insufficientFunds(coinsNeeded: item.price - coinsDeposited)
                }
        
                coinsDeposited -= item.price
        
                var newItem = item
                newItem.count -= 1
                inventory[name] = newItem
        
                print("Dispensing \(name)")
            }
        }`
    ));

    it('should range loop', testTranspile(`
    for index in 1...5 {
        print("\(index) times 5 is \(index * 5)")
    }
    `));
    it('should check type in ', testTranspile(`
var movieCount = 0
var songCount = 0

for item in library {
    if item is Movie {
        movieCount += 1
    } else if item is Song {
        songCount += 1
    }
}

print("Media library contains \(movieCount) movies and \(songCount) songs")
`))
it('should conditionally cast ', testTranspile(`

for item in library {
    if let movie = item as? Movie {
        print("Movie: \(movie.name), dir. \(movie.director)")
    } else if let song = item as? Song {
        print("Song: \(song.name), by \(song.artist)")
    }
}
`));
// it.only('should handle keyPath expressions', ()=>runTranspile(`
// struct SomeStructure {
//     var someValue: Int
// }

// let s = SomeStructure(someValue: 12)
// let pathToProperty = \\SomeStructure.someValue

// let value = s[keyPath: pathToProperty]

// `));
});