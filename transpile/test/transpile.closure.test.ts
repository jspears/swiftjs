import { tt } from './testUtil';

describe('transpile/closure', function() {

    it('should handle closure', tt`
    let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]
    var reversedNames = names.sorted(by: { (s1: String, s2: String) -> Bool in
        return s1 > s2
    })
    `);
    it('Inferring Type From Context', tt`
    let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]
    let reversedNames = names.sorted(by: { s1, s2 in return s1 > s2 } )

    `);
    it('Implicit Returns from Single-Expression Closures', tt`

    let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]
    let reversedNames = names.sorted(by: { s1, s2 in s1 > s2 } )

    `);
    it('Shorthand Argument Names', tt`
    let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]  
    let reversedNames = names.sorted(by: { $0 > $1 } )

    `)
    it('Operator Methods', tt`
    let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]  
    let reversedNames = names.sorted(by: > )

    `);
    it('Trailing Closures', tt`
    
    func someFunctionThatTakesAClosure(closure: () -> Void) {
        // function body goes here
    }
    someFunctionThatTakesAClosure() {
        // trailing closure's body goes here
        print("print me")
    }

    `)
    it('Trailing Closures 2', tt`
    let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]  
    let reversedNames = names.sorted() { $0 > $1 }

    `)
    it('Trailing Closure named', tt`
    
    func loadPicture(from server: String, completion: (String) -> Void, onFailure: () -> Void) {
        print("do stuff \(server)");
    }

    loadPicture(from: "someServer") { picture in
        print ("onSucces \(picture)")
    } onFailure: {
        print("Couldn't download the next picture.")
    }
    
    
    `)

})