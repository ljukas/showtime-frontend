import React, { Suspense, useCallback, useMemo, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";

import { ErrorBoundary } from "app/components/error-boundary";
import { InfiniteScrollList } from "app/components/infinite-scroll-list";
import { VideoConfigContext } from "app/context/video-config-context";
import { useFeed } from "app/hooks/use-feed";
import { useFollowSuggestions } from "app/hooks/use-follow-suggestions";
import { useUser } from "app/hooks/use-user";
import { useColorScheme } from "app/lib/color-scheme";
import type { NFT } from "app/types";

import {
  CreatorPreview,
  SegmentedControl,
  Skeleton,
  Spinner,
  Tabs,
  Text,
} from "design-system";
import { Card } from "design-system/card";
import { Hidden } from "design-system/hidden";
import { useIsDarkMode } from "design-system/hooks";
import { CARD_DARK_SHADOW } from "design-system/theme";
import { View } from "design-system/view";

const CARD_HEIGHT = 890;
const CARD_WIDTH = 620;
const LEFT_SLIDE_WIDTH = 320;
const LEFT_SLIDE_MARGIN = 80;

export const Feed = () => {
  return (
    <View tw="w-full max-w-5xl py-8" testID="homeFeed">
      <ErrorBoundary>
        <Suspense fallback={<View />}>
          <FeedList />
        </Suspense>
      </ErrorBoundary>
    </View>
  );
};

const LoadingIndicator = () => {
  return (
    <View tw="mt-8 items-center">
      <Spinner />
    </View>
  );
};

export const FeedList = () => {
  const { isAuthenticated } = useUser();
  const [selected, setSelected] = useState(1);

  return (
    <View tw="flex-row">
      <Hidden until="xl">
        <View
          style={{
            width: LEFT_SLIDE_WIDTH,
            // for right shadow
            marginRight: LEFT_SLIDE_MARGIN - 16,
          }}
        >
          <SuggestedUsers />
        </View>
      </Hidden>

      <View tw="flex-1">
        {isAuthenticated ? (
          <>
            <View tw="w-[375px] self-end rounded-lg bg-white p-4 shadow-lg dark:bg-black">
              <SegmentedControl
                values={["FOLLOWING", "FOR YOU"]}
                onChange={setSelected}
                selectedIndex={selected}
              />
            </View>
            <Tabs.Root
              onIndexChange={setSelected}
              value={selected.toString()}
              initialIndex={1}
            >
              <Tabs.Pager>
                <ErrorBoundary>
                  <Suspense fallback={<LoadingIndicator />}>
                    <FollowingFeed />
                  </Suspense>
                </ErrorBoundary>
                <ErrorBoundary>
                  <Suspense fallback={<LoadingIndicator />}>
                    <AlgorithmicFeed />
                  </Suspense>
                </ErrorBoundary>
              </Tabs.Pager>
            </Tabs.Root>
          </>
        ) : (
          <ErrorBoundary>
            <Suspense fallback={<LoadingIndicator />}>
              <CuratedFeed />
            </Suspense>
          </ErrorBoundary>
        )}
      </View>
    </View>
  );
};

const FollowingFeed = () => {
  const queryState = useFeed("/following");

  return <NFTScrollList {...queryState} data={queryState.data} />;
};

const AlgorithmicFeed = () => {
  const queryState = useFeed("");

  return <NFTScrollList {...queryState} data={queryState.data} />;
};

const CuratedFeed = () => {
  const queryState = useFeed("/curated");

  return <NFTScrollList {...queryState} data={queryState.data} />;
};

const NFTScrollList = ({
  data,
  fetchMore,
}: {
  data: NFT[];
  fetchMore: any;
}) => {
  const videoConfig = useMemo(
    () => ({
      isMuted: true,
      useNativeControls: false,
      previewOnly: false,
    }),
    []
  );

  const renderItem = useCallback(({ item }) => {
    return (
      <View tw="flex-row justify-end">
        <Card
          nft={item}
          tw={`w-[${CARD_WIDTH}px] h-[${CARD_HEIGHT - 32}px] my-4`}
        />
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item) => {
    return item.nft_id;
  }, []);

  return (
    <VideoConfigContext.Provider value={videoConfig}>
      <InfiniteScrollList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={fetchMore}
      />
    </VideoConfigContext.Provider>
  );
};

// TODO: move to separate file
const SuggestedUsers = () => {
  const { data, loading } = useFollowSuggestions();
  const colorMode = useColorScheme();
  const isDark = useIsDarkMode();

  return (
    <>
      <Text variant="text-2xl" tw="p-4 text-black dark:text-white">
        Home
      </Text>
      <View
        tw="mt-8 rounded-2xl bg-white dark:bg-black"
        // @ts-ignore
        style={{
          position: Platform.OS === "web" ? "sticky" : null,
          top: 100,
          boxShadow: isDark ? CARD_DARK_SHADOW : undefined,
        }}
      >
        <Text tw="p-4 dark:text-white" variant="text-lg">
          Suggested
        </Text>
        {loading ? (
          <View tw="m-4">
            <Skeleton colorMode={colorMode} width={100} height={20} />
            <View tw="h-4" />
            <Skeleton colorMode={colorMode} width={90} height={15} />
          </View>
        ) : null}
        {data?.map((user, index) => {
          return (
            <CreatorPreview
              creator={user}
              onMediaPress={() => {}}
              mediaSize={90}
              key={`CreatorPreview-${index}`}
            />
          );
        })}
      </View>
    </>
  );
};
