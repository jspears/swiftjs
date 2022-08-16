#!/usr/bin/env bash
set -e -o pipefail
DIR=${1}

if [[ -z "$DIR" ]]; then
  echo "echo name a directory to index"
  exit 1
fi

function export_star(){
  if [ $1 != "./index.ts" ]; then
    echo "export * from '${1/\.ts/}';"
  fi
}
cd $DIR 
{
for f in ./*/index.ts; do
  export_star $f
done
for f in ./*.ts; do
  export_star $f
done
} | sort -u 

