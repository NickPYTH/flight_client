#!/usr/bin/env bash

echo 'Copy files...'

scp -r \
    ../build/* \
    root@92.255.111.141:/var/www/html/

echo 'Bye'