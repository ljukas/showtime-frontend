import React, { createContext } from "react";

type VideoConfigContextType = {
  muted: boolean;
  setMuted: (muted: boolean) => void;
  useNativeControls: boolean;
};

export const VideoConfigContext = createContext<VideoConfigContextType | null>({
  muted: true,
  useNativeControls: false,
  setMuted: (_muted: boolean) => {},
});

export const useVideoConfig = () => {
  return React.useContext(VideoConfigContext);
};
