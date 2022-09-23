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
        const p = new Point(x:1, y:2)
      
        `)
        console.log(resp);
    })
    it.only('should init when it can', async () => {
        console.log(await runTranspile(`
        struct Celsius {
            var temperatureInCelsius: Double
            init(fromFahrenheit fahrenheit: Double) {
                temperatureInCelsius = (fahrenheit - 32.0) / 1.8
            }
            init(fromKelvin kelvin: Double) {
                temperatureInCelsius = kelvin - 273.15
            }
        }
        let boilingPointOfWater = Celsius(fromFahrenheit: 212.0)
        `))
    });
});