#!/usr/bin/env bash

DIR=${1:-src}
cd $DIR 
{
for f in ./*/index.ts; do
  echo "export * from '${f/\.ts/}';"
done
for f in ./*.ts; do
  echo "export * from '${f/.ts/}';"
done
} > ./index.ts

