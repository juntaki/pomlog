#!/bin/bash

cp src/*.html public/
cp src/*.css public/
webpack
gin --port 8080
