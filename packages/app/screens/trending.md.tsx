import { Suspense, useCallback, useState } from "react";
import { useWindowDimensions } from "react-native";

import { InfiniteScrollList } from "app/components/infinite-scroll-list";
import { useTrendingCreators, useTrendingNFTS } from "app/hooks/api-hooks";
import { useRouter } from "app/navigation/use-router";
import { CARD_DARK_SHADOW } from "app/utilities";

import {
  CreatorPreview,
  SegmentedControl,
  Spinner,
  Tabs,
  Text,
  View,
} from "design-system";
import { Card } from "design-system/card";
import { useIsDarkMode } from "design-system/hooks";
import { breakpoints } from "design-system/theme";

export const Trending = () => {
  const [selected, setSelected] = useState(1);
  return (
    <View tw="w-full max-w-5xl py-8" testID="homeFeed">
      <View tw="flex-row items-center justify-between pb-8">
        <View>
          <Text variant="text-2xl" tw="text-black dark:text-white">
            Trending
          </Text>
        </View>
        <View tw="w-[400px] rounded-lg bg-white p-4 shadow-lg dark:bg-black">
          <SegmentedControl
            values={["CREATOR", "NFT"]}
            onChange={setSelected}
            selectedIndex={selected}
          />
        </View>
      </View>
      <TrendingTabs selectedTab={selected === 0 ? "creator" : "nft"} />
    </View>
  );
};

const TrendingTabs = ({ selectedTab }: { selectedTab: "nft" | "creator" }) => {
  const [selected, setSelected] = useState(2);
  const days = selected === 0 ? 1 : selected === 1 ? 7 : 30;
  return (
    <Tabs.Root onIndexChange={setSelected} initialIndex={selected} lazy>
      <Tabs.List
        scrollEnabled={false}
        style={{ backgroundColor: "transparent" }}
        contentContainerStyle={{ backgroundColor: "transparent" }}
      >
        <Tabs.Trigger>
          <Text tw="p-4 text-black dark:text-white">Today</Text>
        </Tabs.Trigger>

        <Tabs.Trigger>
          <Text tw="p-4 text-black dark:text-white">This week</Text>
        </Tabs.Trigger>

        <Tabs.Trigger>
          <Text tw="p-4 text-black dark:text-white">This month</Text>
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Pager>
        <View tw="flex-1" nativeID="12132323">
          <Suspense fallback={null}>
            <List days={days} selectedTab={selectedTab} />
          </Suspense>
        </View>
        <View tw="flex-1">
          <Suspense fallback={null}>
            <List days={days} selectedTab={selectedTab} />
          </Suspense>
        </View>
        <View tw="flex-1">
          <Suspense fallback={null}>
            <List days={days} selectedTab={selectedTab} />
          </Suspense>
        </View>
      </Tabs.Pager>
    </Tabs.Root>
  );
};

const List = ({
  days,
  selectedTab,
}: {
  days: number;
  selectedTab: "creator" | "nft";
}) => {
  if (selectedTab === "creator") {
    return <CreatorsList days={days} />;
  }

  return <NFTList days={days} />;
};

const CreatorsList = ({ days }: { days: any }) => {
  const { data, isLoading } = useTrendingCreators({
    days,
  });

  const router = useRouter();

  const [containerWidth, setContainerWidth] = useState(0);
  const isDark = useIsDarkMode();
  const keyExtractor = useCallback((item) => {
    return item.nft_id;
  }, []);

  const renderItem = useCallback(
    ({ item, index }: any) => {
      return (
        <View
          key={item.creator_id}
          tw="mb-8 rounded-lg bg-white dark:bg-black"
          //@ts-ignore
          style={{ boxShadow: isDark ? CARD_DARK_SHADOW : null }}
        >
          <CreatorPreview
            creator={item}
            onMediaPress={(initialScrollIndex: number) => {
              router.push(
                `/list?initialScrollIndex=${initialScrollIndex}&type=trendingCreator&days=${days}&creatorId=${item.profile_id}`
              );
            }}
            mediaSize={containerWidth / 3 - 2}
          />
        </View>
      );
    },
    [containerWidth]
  );

  return (
    <View
      tw="mt-4 flex-1"
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {isLoading ? (
        <View tw="mx-auto p-10">
          <Spinner />
        </View>
      ) : null}
      {/* {data.length > 0 && containerWidth
        ? data.map((item) => {
            return (
              <View
                key={item.creator_id}
                tw="mb-8 rounded-lg bg-white dark:bg-black"
                //@ts-ignore
                style={{ boxShadow: isDark ? CARD_DARK_SHADOW : null }}
              >
                <CreatorPreview
                  creator={item}
                  onMediaPress={(initialScrollIndex: number) => {
                    router.push(
                      `/list?initialScrollIndex=${initialScrollIndex}&type=trendingCreator&days=${days}&creatorId=${item.profile_id}`
                    );
                  }}
                  mediaSize={containerWidth / 3 - 2}
                />
              </View>
            );
          })
        : null} */}
      <InfiniteScrollList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

const NFTList = ({ days }: { days: any }) => {
  const router = useRouter();
  const { data, isLoading } = useTrendingNFTS({
    days,
  });

  const { width } = useWindowDimensions();

  const renderItem = useCallback(({ item, index }: any) => {
    return (
      <View tw="flex-1 p-2 py-4">
        <Card
          nft={item}
          onPress={() =>
            router.push(
              `/list?initialScrollIndex=${index}&days=${days}&type=trendingNFTs`
            )
          }
        />
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item) => {
    return item.nft_id;
  }, []);

  const numColumns = width >= breakpoints["lg"] ? 3 : 2;

  return (
    <InfiniteScrollList
      data={data}
      renderItem={renderItem}
      numColumns={numColumns}
      keyExtractor={keyExtractor}
    />
  );
};
