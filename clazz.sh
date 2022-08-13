#!/usr/bin/env bash

    if [ -z $1 ]; then
         echo 'template requires a name'
        exit 1
    fi
CLAZZ=$1
cat << EOF > ./src/${CLAZZ}.ts
import { Viewable } from "./View";
import { swifty } from "./utilit";

export interface ${CLAZZ}Config {

}

class ${CLAZZ}Class extends Viewable<${CLAZZ}Config> {

}
export const ${CLAZZ} = swifty(${CLAZZ}Class);    
    
EOF

echo "export * from './$CLAZZ';" >> ./src/index.ts
