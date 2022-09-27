import { Transpile, TranspileConfig } from "../src/transpile";
import { Project } from 'ts-morph';

const testTranspile = (conf:Partial<TranspileConfig> = {}) => new Transpile({
    ...conf,
    srcDir:'.',
    project: new Project({
        compilerOptions: {
            "allowJs": true,
            "outDir": "./lib",
            "rootDir": ".",
            "experimentalDecorators": true,
            "skipLibCheck": true,
            "lib":["ES2022", "ES2021.String", "DOM"],
            "baseUrl": "./src/",        
        },
        useInMemoryFileSystem:true
})})
const logTranspile = async (content:string)=>console.log(await runTranspile(content));
const runTranspile = async (content:string, conf: Partial<TranspileConfig> = {}) => (await testTranspile(conf).transpile('test.ts', content)).getText();

describe('transpile', function () {
    it('should parse a regex', async function () {
        const t = testTranspile();
        const r = await t.parse(`struct Foo : View { var type = /hello/ }`)
        console.log(r.rootNode.toString());
    })
    it('should transpile properties', async function () {
        const r = await runTranspile(`
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
       
        `)

        console.log(r);

    });
    it('should do get/set', async () => {
        const resp = await runTranspile(`
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
        `)
        console.log(resp);
    })

    it('should do get/set', async () => {
        const resp = await runTranspile(`
        struct Point {
            var x = 0.0, y = 0.0
        }
        let p = Point(x:1, y:2)
      
        `)
        console.log(resp);
    })
    it('should init when it can', async () => {
        console.log(await runTranspile(`
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
        `))
    });
    it('should parse generic template', async () => {
        console.log(await runTranspile(`struct Stack<Element> {
            var items: [Element] = []
            mutating func push(_ item: Element) {
                items.append(item)
            }
            mutating func pop() -> Element {
                return items.removeLast()
            }
        }
        `))
    });
    it('should parse computed props', async ()=>{
        console.log(await runTranspile(`struct Cuboid {
            var width = 0.0, height = 0.0, depth = 0.0
            var volume: Double {
                return width * height * depth
            }
        }
        let fourByFiveByTwo = Cuboid(width: 4.0, height: 5.0, depth: 2.0)`))
    });
    it.only('should support willget', async()=>{
        return logTranspile(`class StepCounter {
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
        let stepCounter = StepCounter()`);
    })
});