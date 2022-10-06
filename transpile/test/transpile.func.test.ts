import { tt } from "./testUtil";


describe('transpile/func', function(){
    it('no params', tt`func sayHelloWorld() -> String {
        return "hello, world"
    }`);
    
    it('should parse func', tt`
    func greet(person: String) -> String {
        let greeting = "Hello, " + person + "!"
        return greeting
    }
    greet(person:"Sam")
    `);

    it('has multiple params', tt`func greet(person: String, alreadyGreeted: Bool) -> String {
        if alreadyGreeted {
            return "Hello again"
        } else {
            return "Hello " + person;
        }
    }
    greet(person: "Tim", alreadyGreeted: true)
    `)
    it('can return tuple', tt`
    func minMax(array: [Int]) -> (min: Int, max: Int) {
        var currentMin = array[0]
        var currentMax = array[0]
        for value in array[1..<array.count] {
            if value < currentMin {
                currentMin = value
            } else if value > currentMax {
                currentMax = value
            }
        }
        return (currentMin, currentMax)
    }
    `)
});