import { useCallback, useMemo, useRef, memo, useEffect, Suspense } from "react";
import { Dimensions } from "react-native";

import { Collection } from "app/components/feed/collection";
import { CommentButton } from "app/components/feed/comment-button";
import { Like } from "app/components/feed/like";
import { LikeContextProvider } from "app/context/like-context";
import { DataProvider, LayoutProvider } from "app/lib/recyclerlistview";
import { RecyclerListView } from "app/lib/recyclerlistview";
import type { NFT } from "app/types";

import { Avatar } from "design-system/avatar";
import { Divider } from "design-system/divider";
import { Media } from "design-system/media";
import { Text } from "design-system/text";
import { View } from "design-system/view";

import { useFeed } from "../../hooks/use-feed";

export const NFTCard = ({ nft }: { nft: NFT }) => {
  return (
    <LikeContextProvider nft={nft}>
      <View tw="bg-white dark:bg-black">
        <View tw="flex-row py-4">
          <Avatar
            url="https://cdn.tryshowtime.com/profile_placeholder2.jpg"
            size={32}
          />
          <View tw="justify-around ml-2">
            <Text tw="text-gray-600 dark:text-gray-400 text-xs font-semibold">
              Creator
            </Text>
            <Text tw="text-black dark:text-white text-xs font-semibold">
              @{nft.creator_username}
            </Text>
          </View>
        </View>
        <Media item={nft} tw="w-[500px] h-[500px]" />

        <View tw="py-4">
          <Text tw="text-black dark:text-white" variant="text-xl">
            {nft.token_name}
          </Text>

          <View tw="flex-row mt-4">
            <Like nft={nft} />
            <View tw="ml-4">
              <CommentButton nft={nft} />
            </View>
          </View>

          {/* <View tw="py-4">
            <View tw={`w-[30px] h-[30px] justify-between flex-row flex-wrap`}>
              <Avatar
                url="https://cdn.tryshowtime.com/profile_placeholder2.jpg"
                size={14}
              />
              <Avatar
                url="https://cdn.tryshowtime.com/profile_placeholder2.jpg"
                size={14}
              />
              <Avatar
                url="https://cdn.tryshowtime.com/profile_placeholder2.jpg"
                size={14}
              />
              <Avatar
                url="https://cdn.tryshowtime.com/profile_placeholder2.jpg"
                size={14}
              />
            </View>
          </View> */}
        </View>
        <Collection nft={nft} />
      </View>
      <Divider />
    </LikeContextProvider>
  );
};

export const Feed = () => {
  return <CuratedFeed />;
};

const CuratedFeed = () => {
  const { data, fetchMore } = useFeed("/curated");
  let dataProvider = useMemo(
    () =>
      new DataProvider((r1, r2) => {
        return r1.nft_id !== r2.nft_id;
      }).cloneWithRows(data),
    [data]
  );

  const _layoutProvider = useMemo(
    () =>
      new LayoutProvider(
        () => {
          return "item";
        },
        () => {}
      ),
    []
  );

  const _rowRenderer = useCallback((_type: any, item: any) => {
    return <NFTCard nft={item} />;
  }, []);

  const videoConfig = useMemo(
    () => ({
      isMuted: true,
      useNativeControls: false,
      previewOnly: false,
    }),
    []
  );

  return (
    <View tw="flex-row flex-1">
      <View tw="flex-2"></View>
      <View tw="flex-2">
        <Suspense fallback={() => "loading...."}>
          <RecyclerListView
            dataProvider={dataProvider}
            layoutProvider={_layoutProvider}
            style={{ flex: 1 }}
            forceNonDeterministicRendering
            rowRenderer={_rowRenderer}
            onEndReached={fetchMore}
          />
        </Suspense>
      </View>
    </View>
  );
};
