import {tt, testTranspile} from './testUtil'

describe('transpile', function () {
    it('should transpile infered property', tt
        `
        struct TestInferredProp {
            private let stuff = 0;
        }
        `
    );
    it('should parse closure', tt`
    let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]
    func backward(_ s1: String, _ s2: String) -> Bool {
        return s1 > s2
    }
    var reversedNames = names.sorted(by: backward)
    
    `);
    it('should transform simple enum', tt`
    enum CompassPoint {
        case north
        case south
        case east
        case west
    }
    `);
it('should transform valued enum', tt`
    enum Suit: Character {
        case spades = "♠", hearts = "♡", diamonds = "♢", clubs = "♣"
    }
    
    `);
    it('shoud auto increment enum', tt`
        enum Month : Int  { 
            case January = 1, 
            February, March, April, May, June, 
            July, August, September, October, November, December
            
        } 
    `);

    it('nested enum class', tt`
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
    `);
    
    it('parse weird if let', tt`
    var output = "suit"
    if let second = rank.values.second {
        output += " or \(second)"
    }
 
    `);

    it('should parse number', tt`
    let decimalInteger = 17
    let binaryInteger = 0b10001       // 17 in binary notation
    let octalInteger = 0o21           // 17 in octal notation
    let hexadecimalInteger = 0x11 
    
    `);
    it('should parse tuple',tt
`
    let http200Status = (statusCode: 200, description: "OK")
    let http404Error = (404, "Not Found");
    let (statusCode, statusMessage) = http404Error;

`);
it('should parse do/try/throw', tt`
    func canThrowAnError() throws {
    }
    do {
        try canThrowAnError()
        // no error was thrown
    } catch {
        // an error was thrown
    }
    `);

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
    it('should handle guard and stuff', tt
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
        }`);

    it('should range loop', tt`
    for index in 1...5 {
        print("\(index) times 5 is \(index * 5)")
    }
    `);
    it('should check type in ', tt`
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
`);
it('should conditionally cast ', tt`

for item in library {
    if let movie = item as? Movie {
        print("Movie: \(movie.name), dir. \(movie.director)")
    } else if let song = item as? Song {
        print("Song: \(song.name), by \(song.artist)")
    }
}
`);
// it.only('should handle keyPath expressions', ()=>runTranspile(`
// struct SomeStructure {
//     var someValue: Int
// }

// let s = SomeStructure(someValue: 12)
// let pathToProperty = \\SomeStructure.someValue

// let value = s[keyPath: pathToProperty]

// `);
});