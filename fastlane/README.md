fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

### native

```sh
[bundle exec] fastlane native
```

Builds native apps and stores them in the `./build` folder

Parameters:

- env - environment to use. This will switch local environment and replace .env file with one from ./env dir. **Defaults to what is in current .env file**

- build_number - build number

Output:

The result of the command is a `./build/android` folder in the project root containing build artifacts:

- .apk or .aab

- source maps

----


## Android

### android native

```sh
[bundle exec] fastlane android native
```

Builds .apk or .aab and stores it in the `./build` folder

Important: the .apk/.aab is not installable on a real device unless signed with non-debug .keystore

See https://developer.android.com/studio/publish/app-signing#generate-key



Parameters:

- build_number - build number

Output:

The result of the command is a `./build/android` folder in the project root containing build artifacts:

- .apk or .aab, .bundle and sourcemaps (.bundle.map)

### android version

```sh
[bundle exec] fastlane android version
```



----


## iOS

### ios native

```sh
[bundle exec] fastlane ios native
```

Builds .ipa and stores it in the `./build` folder



Parameters:

- build_number - build number

Output:

The result of the command is a `./build/ios` folder in the project root containing build artifacts:

- .ipa, .jsbundle and sourcemaps (.jsbnudle.map)

### ios version

```sh
[bundle exec] fastlane ios version
```



----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
