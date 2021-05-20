#!/bin/sh
wasm-pack build --target web
cp -r pkg/ public/pkg
