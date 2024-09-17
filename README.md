

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup]

For React Native - Environment Setup in Mac follow this (https://zahiralam.com/blog/react-native-build-ios-android-mac/) .

For React Native - Environment Setup in Ubuntu follow this (https://zahiralam.com/blog/how-to-install-android-studio-on-ubuntu-24-04-a-step-by-step-guide/)

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Install Required Dependencies

We'll need some additional packages for handling calls and making network requests:

```bash
# React Native dependencies
npm install react-native-callkeep axios

# iOS-specific setup for react-native-callkeep
cd ios
pod install
cd ..
```

## Step 4: Configure react-native-callkeep for iOS

To handle incoming and outgoing calls on iOS, we use react-native-callkeep. This requires some configuration:

1. Navigate to the ios/CallRecordMate/Info.plist file and add the following permissions:

```bash
<key>NSMicrophoneUsageDescription</key>
<string>Your call recording app needs access to the microphone</string>
<key>UIBackgroundModes</key>
<array>
    <string>voip</string>
</array>
```
2. Register CallKeep in your AppDelegate:
Open ios/CallRecordMate/AppDelegate.h
Add the following imports at the top:

```bash
#import <RNCallKeep.h> // Add this line at top
```

3. You'll need to initialize CallKeep within application:didFinishLaunchingWithOptions:. Insert the RNCallKeep setup inside this method.
Open ios/CallRecordMate/AppDelegate.mm 

```bash
#import <RNCallKeep.h> // Add this line at top here also
```

```bash
// Initialize CallKeep
  [RNCallKeep setup:@{
      @"appName": @"CallRecordMate",
      @"maximumCallGroups": @1, // Optional: Set your maximum call groups
      @"maximumCallsPerCallGroup": @1 // Optional: Set your maximum calls per group
  }];
```