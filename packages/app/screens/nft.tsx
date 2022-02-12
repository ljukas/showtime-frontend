import { useContext, useRef } from "react";
import { Platform } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  SharedElement,
  SharedElementTransition,
  nodeFromRef,
} from "react-native-shared-element";
import useSWR from "swr";
import useUnmountSignal from "use-unmount-signal";

import { NFTDropdown } from "app/components/nft-dropdown";
import { axios } from "app/lib/axios";
import { createParam } from "app/navigation/use-param";
import { useRouter } from "app/navigation/use-router";
// import { Comments } from "design-system/comments";
import type { NFT } from "app/types";
import { NFT_DETAIL_API } from "app/utilities";

import { View, Pressable, ScrollView } from "design-system";
import { Collection } from "design-system/card/rows/collection";
import { Description } from "design-system/card/rows/description";
import { Owner } from "design-system/card/rows/owner";
import { Title } from "design-system/card/rows/title";
import { Social } from "design-system/card/social";
import { Close } from "design-system/icon";
import { LikedBy } from "design-system/liked-by";
import { Media } from "design-system/media";
import { PinchToZoom } from "design-system/pinch-to-zoom";
import { tw } from "design-system/tailwind";

import { SharedElementContext } from "../components/shared-element";

type Query = {
  id: string;
};

const { useParam } = createParam<Query>();

function NftScreen() {
  const { top: topSafeArea } = useSafeAreaInsets();
  const { setNode2, setNode2AncestorRef } = useContext(SharedElementContext);
  const router = useRouter();
  const unmountSignal = useUnmountSignal();
  const [nftId, setNftId] = useParam("id");
  const node = useRef<any>(null);
  const { data, error } = useSWR<{ data: NFT }>(
    `${NFT_DETAIL_API}/${nftId}`,
    (url) => axios({ url, method: "GET", unmountSignal })
  );
  const nft = data?.data;

  if (error) {
    console.error(error);
  }

  return (
    <View
      tw={[
        "flex-1 bg-white dark:bg-black",
        Platform.OS === "web" || Platform.OS === "android"
          ? `pt-[${topSafeArea}px]`
          : "",
      ]}
    >
      <View tw="px-4 h-16 flex-row items-center justify-between">
        <Pressable onPress={router.pop}>
          <Close
            color={
              tw.style("bg-black dark:bg-white")?.backgroundColor as string
            }
            width={24}
            height={24}
          />
        </Pressable>
        <NFTDropdown nft={nft} />
      </View>

      <ScrollView keyboardShouldPersistTaps="handled">
        <Collection nft={nft} />

        <PinchToZoom>
          <View ref={setNode2AncestorRef}>
            <SharedElement onNode={(n) => setNode2(n)}>
              <Media item={nft} numColumns={1} />
            </SharedElement>
          </View>
        </PinchToZoom>

        <Social nft={nft} />

        <LikedBy nft={nft} />

        <Title nft={nft} />

        <Description nft={nft} />

        <Owner nft={nft} price={true} />
      </ScrollView>

      {/* <Suspense fallback={<Spinner />}>
        <Comments nft={nft} />
      </Suspense> */}
    </View>
  );
}

export { NftScreen };
