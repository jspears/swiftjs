#!/usr/bin/env zsh


NAME=$1
if [ -z "$NAME" ]; then
    echo "name is required"
fi

mkdir src/pages/${NAME}
cat <<eos > ./src/pages/${NAME}/${NAME}.ts
import {Viewable} from "@tswift/ui";

export class ${NAME} extends Viewable {

    body = ()=>{

    }
}
eos

cat <<eos > ./src/pages/${NAME}/index.ts
export { ${NAME} as App } from "./${NAME}";
eos

cat <<eos > ./src/pages/${NAME}/${NAME}.swift
import SwiftUI

struct ${NAME} : View {

}
eos

