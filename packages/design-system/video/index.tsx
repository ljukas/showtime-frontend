import { ComponentProps, useCallback, useRef } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { Video as ExpoVideo } from "expo-av";
import FastImage from "react-native-fast-image";

import { useVideoConfig } from "app/context/video-config-context";
import { useViewabilityMount } from "app/hooks/use-viewability-mount";

import { tw as tailwind } from "design-system/tailwind";
import type { TW } from "design-system/tailwind/types";
import { View } from "design-system/view";

import { Muted, Unmuted } from "../icon";

type VideoProps = {
  tw?: TW;
} & ComponentProps<typeof ExpoVideo>;

function Video({ tw, style, ...props }: VideoProps) {
  const videoRef = useRef<ExpoVideo>(null);
  const videoConfig = useVideoConfig();

  const { id } = useViewabilityMount({ videoRef, source: props.source });

  const toggleMuted = useCallback(() => {
    if (videoConfig?.muted) {
      videoConfig?.setMuted(false);
    } else {
      videoConfig?.setMuted(true);
    }
  }, [videoConfig?.muted, videoConfig?.setMuted]);

  return (
    <>
      <View style={[style, tailwind.style(tw)]}>
        <FastImage
          //@ts-ignore
          source={props.posterSource}
          style={StyleSheet.absoluteFill}
        />

        <ExpoVideo
          ref={videoRef}
          style={StyleSheet.absoluteFill}
          useNativeControls={videoConfig?.useNativeControls}
          resizeMode="cover"
          posterSource={props.posterSource}
        />

        {__DEV__ ? (
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              color: "white",
              position: "absolute",
            }}
          >
            Video {id}
          </Text>
        ) : null}

        <Pressable
          onPress={toggleMuted}
          style={tailwind.style(
            "h-6 w-6 bg-gray-800 rounded-full items-center justify-center absolute bottom-2 right-2"
          )}
        >
          {videoConfig?.muted ? (
            <Muted color="white" />
          ) : (
            <Unmuted color="white" />
          )}
        </Pressable>
      </View>
    </>
  );
}

export { Video };
