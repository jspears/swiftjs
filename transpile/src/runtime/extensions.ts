import { Constructor, overload } from "@tswift/util";



export function extensions(to: Constructor, from: Constructor) {
    const target = to.prototype, extend = from.prototype;

    Object.entries(Object.getOwnPropertyDescriptors(extend)).forEach(([name, property]) => {
        const existing = Object.getOwnPropertyDescriptor(target, name);
        if (existing) {
            Object.defineProperty(target, name,  {
                ...existing,
                value() {
                    
                }
            })
        }

    });
    
}