# HelloElectron

A basic hello world electron app.  This project is used to show the current issue with fpm failing during the packaging process when the jre is included in the build. The failure will only happen when including the jre, and using the prepackaged binary included with electron-builder, as using my own system installed version of fpm will also work.  The goal is to produce an rpm file for production.

## H2 various build options

These build options will highlight the issue:

To get started, run `npm install`.

To run locally, run `npm start`.

(This will fail!) To build x64 rpm for linux, run `npm run build:linux`.

(This will work!) To build x64 rpm for linux, run `npm run build:linux:nojre`.

(This will work!) To build x64 rpm for linux, run `npm run build:linux:systemfpm`. This works by forcing it to use my system installed version of fpm via ruby on mac os.

## H2 error message for npm run build:linux

Example error message when the build fails: ```Exit code: 1. Command failed: /Users/testuser/Library/Caches/electron-builder/fpm@2.1.4/fpm@2.1.4-fpm-1.17.0-ruby-3.4.3-darwin-arm64/fpm -s dir --force -t rpm -d gtk3 -d libnotify -d nss -d libXScrnSaver -d (libXtst or libXtst6) -d xdg-utils -d at-spi2-core -d (libuuid or libuuid1) --rpm-os linux --rpm-compression xzmt --architecture amd64 --after-install /p 4bfc24fd662dd95fedaf81f673fddb76aff0697f73f8695c627576fa5de731ef (sha256 hash) --after-remove /p b7af78bd848ce480a4d2c7e4e14cfc0509835de6285be86042cb8ecdd6de94e7 (sha256 hash) --description the most basic electron app possible --version 1.0.0 --p 41327348b614bc848b4274ad56e0f7dd747f93168508fc74d0b2382b9c3acc92 (sha256 hash) /Users/testuser/helloworld/clean/HelloElectron/dist/HelloWorld-1.0.0-x64.rpm --name helloworld --maintainer Test User <test@github.com> --url https://github.com --vendor Test User <test@github.com> --license ISC /Users/testuser/helloworld/clean/HelloElectron/dist/linux-unpacked/=/opt/HelloWorld /Users/testuser/helloworld/clean/HelloElectron/node_modules/app-builder-lib/templates/icons/electron-linux/16x16.png=/usr/share/icons/hicolor/16x16/apps/helloworld.png /Users/testuser/helloworld/clean/HelloElectron/node_modules/app-builder-lib/templates/icons/electron-linux/32x32.png=/usr/share/icons/hicolor/32x32/apps/helloworld.png /Users/testuser/helloworld/clean/HelloElectron/node_modules/app-builder-lib/templates/icons/electron-linux/48x48.png=/usr/share/icons/hicolor/48x48/apps/helloworld.png /Users/testuser/helloworld/clean/HelloElectron/node_modules/app-builder-lib/templates/icons/electron-linux/64x64.png=/usr/share/icons/hicolor/64x64/apps/helloworld.png /Users/testuser/helloworld/clean/HelloElectron/node_modules/app-builder-lib/templates/icons/electron-linux/128x128.png=/usr/share/icons/hicolor/128x128/apps/helloworld.png /Users/testuser/helloworld/clean/HelloElectron/node_modules/app-builder-lib/templates/icons/electron-linux/256x256.png=/usr/share/icons/hicolor/256x256/apps/helloworld.png /p 017e9192a3f6fb1a3be8b77df1b868f51bc20262538fc8690b0921a253918e9d (sha256 hash)```