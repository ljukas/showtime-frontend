import { NativeModules } from "react-native";

import * as FileSystem from "expo-file-system";

const fileURI =
  "file:///Users/nishanbende/Library/Developer/CoreSimulator/Devices/85B9F718-D732-4CF8-88EB-35BD5D73C87A/data/Containers/Data/Application/A6081817-402F-4BD0-BC7D-434FF4E2F83F/Library/Caches/ImagePicker/F3CCBB41-969E-4318-8C5B-C722EC8B12BA.jpg";

const main = () => {
  NativeModules.IPFSCID.getCID(FileSystem.documentDirectory + "small.jpg");
};

main();

function App() {
  return null;
}

export default App;
