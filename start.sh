#!/bin/bash

source ./api.key
cp src/*.html public/
cp src/*.css public/
webpack
gin --port 8080
