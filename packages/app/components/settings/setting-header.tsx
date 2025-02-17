import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

export const SettingHeaderSection = ({ title = "" }) => {
  return (
    <View tw="dark:shadow-dark shadow-light items-center bg-white dark:bg-black md:mb-8">
      <View tw="w-full max-w-screen-2xl flex-row justify-between bg-white py-4 px-4 dark:bg-black">
        <Text tw="font-space-bold text-2xl font-extrabold text-gray-900 dark:text-white">
          {title}
        </Text>
      </View>
    </View>
  );
};
