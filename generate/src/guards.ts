import { has } from "./create";
import {  
    RoleEnum} from "./types";


export function hasRole(r:{}):r is {role:RoleEnum} {
   if ('role' in r){
    return Object.prototype.hasOwnProperty.call(r, 'role')
   }
   return false;
}