




export function* zip<

            LV = any,
            RV = any,
            L extends Iterable<LV> = Iterable<LV>, 
            R extends Iterable<RV> = Iterable<RV>
            
            >(left:L, right:R):Generator<[LV, RV]> {

    const lit = left[Symbol.iterator](), rit = right[Symbol.iterator]();
    while(true){
        const leit = lit.next();
        const reit = rit.next();
        if (reit.done || leit.done){
            break;
        }
        yield [leit.value, reit.value];

    }

    return null;
}