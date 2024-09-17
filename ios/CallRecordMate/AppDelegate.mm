#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

#import <RNCallKeep.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{

  // Initialize CallKeep
  [RNCallKeep setup:@{
      @"appName": @"CallRecordMate",
      @"maximumCallGroups": @1, // Optional: Set your maximum call groups
      @"maximumCallsPerCallGroup": @1 // Optional: Set your maximum calls per group
  }];

  self.moduleName = @"CallRecordMate";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
