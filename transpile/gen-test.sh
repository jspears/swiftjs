#!/usr/bin/env bash

SWIFT_FILES=${1:-../../swift/test/Inputs}
if [ ! -d $SWIFT_FILES ]; then
   echo "gen-test ../directory/of/swift/files/"
   exit 1;
fi
cat <<EOF
import { readFileSync } from "fs";
import { testTranspile } from './testUtil';
//Auto-genererated by "gen-test.sh $SWIFT_FILES" to make it easier to see which tests are run.
describe('$SWIFT_FILES', function(){
EOF

#readdirSync(base).filter(v => v.endsWith('.swift')).forEach(test => it(test.replace(/\.swift$/, ''), testTranspile(readFileSync(`${base}/${test}`, 'utf-8'))))
for f in $SWIFT_FILES/*.swift; do
 NAME=`basename "$f" ".swift"`
 echo "  it(\"${NAME:-empty}\", testTranspile(readFileSync(\`\${__dirname}/../${f}\`, 'utf-8')));"
done

echo "})"