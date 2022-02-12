import { useState, useCallback } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  Image,
  View,
} from "react-native";

// import Image from "react-native-fast-image";
import {
  SharedElement,
  SharedElementTransition,
  nodeFromRef,
} from "react-native-shared-element";

let startAncestor;
let startNode;
const position = new Animated.Value(0);
const width = Dimensions.get("window").width;

export default function App() {
  const [node1, setNode1] = useState(null);
  const [node1Ancestor, setNode1Ancestor] = useState(null);
  const [node2, setNode2] = useState(null);
  const [node2Ancestor, setNode2Ancestor] = useState(null);
  const [inProgress, setInProgress] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);

  const startAnimation = () => {
    if (inProgress) return;
    setInProgress(true);
    setDetailVisible(true);
    Animated.timing(position, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setInProgress(false);
    });
  };

  const setNode1Ref = useCallback((ref) => {
    setNode1Ancestor(nodeFromRef(ref));
  }, []);

  const setNode2Ref = useCallback((ref) => {
    setNode2Ancestor(nodeFromRef(ref));
  }, []);

  return (
    <>
      <Pressable onPress={startAnimation}>
        <Animated.View
          style={{
            transform: [
              {
                translateX: position.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -width],
                }),
              },
            ],
          }}
        >
          <View ref={setNode1Ref}>
            <SharedElement onNode={(node) => setNode1(node)}>
              <Image
                style={{ width: 100, height: 100 }}
                source={{
                  uri: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1774&q=80",
                }}
              />
            </SharedElement>
          </View>
        </Animated.View>
      </Pressable>

      {detailVisible ? (
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,

            transform: [
              {
                translateX: position.interpolate({
                  inputRange: [0, 1],
                  outputRange: [width, 0],
                }),
              },
            ],
          }}
        >
          <Pressable
            onPress={() => {
              if (inProgress) return;
              setInProgress(true);
              Animated.timing(position, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
              }).start(() => {
                setInProgress(false);
                setDetailVisible(false);
              });
            }}
          >
            <View ref={setNode2Ref}>
              <SharedElement onNode={(node) => setNode2(node)}>
                <Image
                  style={{ width: 500, height: 500 }}
                  source={{
                    uri: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1774&q=80",
                  }}
                />
              </SharedElement>
            </View>
          </Pressable>
          <View>
            <Text>Hello there</Text>
          </View>
        </Animated.View>
      ) : null}

      {inProgress ? (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <SharedElementTransition
            start={{
              node: node1,
              ancestor: node1Ancestor,
            }}
            end={{
              node: node2,
              ancestor: node2Ancestor,
            }}
            position={position}
            animation="move"
            resize="auto"
            align="auto"
          />
        </View>
      ) : null}
    </>
  );
}

let endAncestor;
let endNode;
function DetailScreen() {}

function AnimationScreen() {}

// enableScreens(true);
// // enableFreeze(true)

// // Sentry.init({
// // 	dsn: 'https://a0b390d1d15543a8a85ab594eb4b0c50@o614247.ingest.sentry.io/5860034',
// // 	enableInExpoDevelopment: true,
// // 	debug: process.env.STAGE === 'development',
// // })

// LogBox.ignoreLogs([
//   "Constants.deviceYearClass",
//   "No native splash screen",
//   "The provided value 'ms-stream' is not a valid 'responseType'.",
//   "The provided value 'moz-chunked-arraybuffer' is not a valid 'responseType'.",
//   "Constants.platform.ios.model has been deprecated in favor of expo-device's Device.modelName property.",
//   "ExponentGLView",
// ]);

// function mmkvProvider() {
//   const storage = new MMKV();
//   const appCache = storage.getString("app-cache");
//   const map = new Map(appCache ? JSON.parse(appCache) : []);

//   AppState.addEventListener("change", () => {
//     const appCache = JSON.stringify(Array.from(map.entries()));
//     storage.set("app-cache", appCache);
//   });

//   return map;
// }

// function SWRProvider({ children }: { children: React.ReactNode }): JSX.Element {
//   const navigation = useNavigation();

//   return (
//     <SWRConfig
//       value={{
//         provider: mmkvProvider,
//         isVisible: () => {
//           return AppState.currentState === "active";
//         },
//         isOnline: () => {
//           return true;
//           // return NetInfo.fetch().then((state) => state.isConnected)
//         },
//         // TODO: tab focus too
//         initFocus(callback) {
//           let appState = AppState.currentState;

//           const onAppStateChange = (nextAppState) => {
//             /* If it's resuming from background or inactive mode to active one */
//             if (
//               appState.match(/inactive|background/) &&
//               nextAppState === "active"
//             ) {
//               callback();
//             }
//             appState = nextAppState;
//           };

//           // Subscribe to the app state change events
//           const listener = AppState.addEventListener(
//             "change",
//             onAppStateChange
//           );

//           // Subscribe to the navigation events
//           const unsubscribe = navigation.addListener("focus", callback);

//           return () => {
//             if (listener) {
//               listener.remove();
//             }
//             unsubscribe();
//           };
//         },
//         initReconnect(callback) {
//           let netInfoState = {
//             isConnected: undefined,
//             isInternetReachable: undefined,
//           };

//           NetInfo.fetch().then((state) => {
//             netInfoState = state;
//           });

//           // Subscribe to the network change events
//           const unsubscribe = NetInfo.addEventListener((nextNetInfoState) => {
//             if (
//               netInfoState.isInternetReachable === false &&
//               nextNetInfoState.isConnected === true &&
//               nextNetInfoState.isInternetReachable === true
//             ) {
//               callback();
//             }
//             netInfoState = nextNetInfoState;
//           });

//           return () => {
//             unsubscribe();
//           };
//         },
//       }}
//     >
//       {children}
//     </SWRConfig>
//   );
// }

// function AppContextProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }): JSX.Element {
//   const [notification, setNotification] = useState(null);
//   useDeviceContext(tw, { withDeviceColorScheme: false });
//   // Default to device color scheme
//   const deviceColorScheme = useDeviceColorScheme();
//   // User can override color scheme
//   const userColorScheme = useUserColorScheme();
//   // Use the user color scheme if it's set
//   const [colorScheme, toggleColorScheme, setColorScheme] = useAppColorScheme(
//     tw,
//     userColorScheme ?? deviceColorScheme
//   );

//   // setting it before useEffect or else we'll see a flash of white paint before
//   useState(() => setColorScheme(colorScheme));
//   const isDark = colorScheme === "dark";

//   useEffect(() => {
//     if (isDark) {
//       if (Platform.OS === "android") {
//         NavigationBar.setBackgroundColorAsync("#000");
//         NavigationBar.setButtonStyleAsync("light");
//       }

//       tw.setColorScheme("dark");
//       SystemUI.setBackgroundColorAsync("black");
//       setStatusBarStyle("light");
//     } else {
//       if (Platform.OS === "android") {
//         NavigationBar.setBackgroundColorAsync("#FFF");
//         NavigationBar.setButtonStyleAsync("dark");
//       }

//       tw.setColorScheme("light");
//       SystemUI.setBackgroundColorAsync("white");
//       setStatusBarStyle("dark");
//     }
//   }, [isDark]);

//   useEffect(() => {
//     let shouldShowNotification = true;
//     if (notification) {
//       // TODO:
//       // const content = notification?.request?.content?.data?.body?.path;
//       // const currentScreen = '';
//       // const destinationScreen = '';
//       // Don't show if already on the same screen as the destination screen
//       // shouldShowNotification = currentScreen !== destinationScreen;
//     }

//     // priority: AndroidNotificationPriority.HIGH,
//     Notifications.setNotificationHandler({
//       handleNotification: async () => ({
//         shouldShowAlert: shouldShowNotification,
//         shouldPlaySound: shouldShowNotification,
//         shouldSetBadge: false, // shouldShowNotification
//       }),
//     });
//   }, [notification]);

//   // Handle push notifications
//   useEffect(() => {
//     // Handle notifications that are received while the app is open.
//     const notificationListener = Notifications.addNotificationReceivedListener(
//       (notification) => {
//         setNotification(notification);
//       }
//     );

//     return () =>
//       Notifications.removeNotificationSubscription(notificationListener);
//   }, []);

//   // Listeners registered by this method will be called whenever a user interacts with a notification (eg. taps on it).
//   useEffect(() => {
//     const responseListener =
//       Notifications.addNotificationResponseReceivedListener((response) => {
//         const content =
//           Platform.OS === "ios"
//             ? response?.notification?.request?.content?.data?.body?.path
//             : response?.notification?.request?.content?.data?.path;

//         console.log(content);

//         // Notifications.dismissNotificationAsync(
//         //   response?.notification?.request?.identifier
//         // );
//         // Notifications.setBadgeCountAsync(0);
//       });

//     return () => Notifications.removeNotificationSubscription(responseListener);
//   }, []);

//   const injectedGlobalContext = {
//     colorScheme,
//     setColorScheme: (newColorScheme: "light" | "dark") => {
//       setColorScheme(newColorScheme);
//       setUserColorScheme(newColorScheme);
//     },
//     // TODO: notification?
//   };

//   return (
//     <AppContext.Provider value={injectedGlobalContext}>
//       {children}
//     </AppContext.Provider>
//   );
// }

// function App() {
//   useEffect(() => {
//     Sentry.init({
//       dsn: "https://a0b390d1d15543a8a85ab594eb4b0c50@o614247.ingest.sentry.io/5860034",
//       environment: process.env.STAGE,
//     });

//     if (process.env.STAGE !== "development") {
//       LogRocket.init("oulg1q/showtime", {
//         redactionTags: ["data-private"],
//       });
//     }
//   }, []);

//   const scheme = `io.showtime${
//     process.env.STAGE === "development"
//       ? ".development"
//       : process.env.STAGE === "staging"
//       ? ".staging"
//       : ""
//   }`;

//   console.log("App", scheme);

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <DripsyProvider theme={theme}>
//         <SafeAreaProvider style={{ backgroundColor: "black" }}>
//           <ToastProvider>
//             <NavigationProvider>
//               <SWRProvider>
//                 <WalletConnectProvider>
//                   <Web3Provider>
//                     <AppContextProvider>
//                       <AuthProvider>
//                         <UserProvider>
//                           <BottomSheetModalProvider>
//                             <StatusBar style="auto" />
//                             <RootStackNavigator />
//                           </BottomSheetModalProvider>
//                         </UserProvider>
//                       </AuthProvider>
//                     </AppContextProvider>
//                   </Web3Provider>
//                 </WalletConnectProvider>
//               </SWRProvider>
//             </NavigationProvider>
//           </ToastProvider>
//         </SafeAreaProvider>
//       </DripsyProvider>
//     </GestureHandlerRootView>
//   );
// }

// export default App;
