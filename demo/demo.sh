#!/usr/bin/env zsh


NAME=$1
if [ -z "$NAME" ]; then
    echo "name is required"
fi
DIR=${0:a:h}
mkdir $DIR/src/pages/${NAME}
cat <<eos > $DIR/src/pages/${NAME}/${NAME}.ts
import {Viewable, Bound} from "@tswift/ui";

export class ${NAME} extends Viewable {

    body = (self:Bound<this>)=>{
        return undefined;
    }
}
eos

cat <<eos > $DIR/src/pages/${NAME}/index.ts
import { ${NAME} as App } from "./${NAME}";
import swift  from "./${NAME}.swift?raw";
import source from "./${NAME}.ts?raw";
//Please include an image
//import image from "./${NAME}.png";
export {
    App,
    swift,
    source,
    //image,
}
eos

cat <<eos > $DIR/src/pages/${NAME}/${NAME}.swift
import SwiftUI

struct ${NAME} : View {
    var body: some View {

    }
}
eos

