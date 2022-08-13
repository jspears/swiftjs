import { UseAnimation } from "./Animation";

export function State (target:Object, propertyKey:PropertyKey)  {
       console.log("first(): called");
  }

  export function Environment (property:string){

     return function(target:Object, propertyKey:PropertyKey){
          console.log("Environment(): called");

     }
  }
    // @FetchRequest(
    //     sortDescriptors: [NSSortDescriptor(keyPath: \Item.dueDate, ascending: false)],
    //     animation: .default)
interface Sort {
     keyPath?:string;
     ascending?: boolean;
}

export function FetchRequest(req:{sortDescriptors:Sort[], animation?:UseAnimation}){
     return function(target:Object, propertyKey:PropertyKey){
          console.log("Environment(): called");
     }

}    

export function Binding(target:Object, property:PropertyKey){

}


export function AppStorage(key:string){
     return function(target:Object, property:PropertyKey){
          
     }
}