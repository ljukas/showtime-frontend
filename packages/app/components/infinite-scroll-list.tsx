import * as React from "react";

import { Virtuoso } from "react-virtuoso";

type Props = {
  renderItem: ({ item, index }: { item: any; index: any }) => React.ReactNode;
  keyExtractor: (item: any, index: number) => string;
  data: any[];
  onEndReached?: () => void;
  ItemSeparatorComponent?: () => any;
  ListHeaderComponent?: () => any;
  ListFooterComponent?: () => any;
};

export const InfiniteScrollList = (props: Props) => {
  const {
    renderItem,
    keyExtractor: _keyExtractor,
    data,
    onEndReached,
    ListHeaderComponent,
    ListFooterComponent,
    ItemSeparatorComponent,
  } = props;

  const itemContent = React.useCallback(
    (index: number) => {
      const element = renderItem({ item: data[index], index });
      return (
        <>
          {index === 0 ? ListHeaderComponent : null}

          {element}

          {index < data.length - 1 ? ItemSeparatorComponent : null}

          {index === data.length - 1 ? ListFooterComponent : null}
        </>
      );
    },
    [
      data,
      ListHeaderComponent,
      ListFooterComponent,
      ItemSeparatorComponent,
      renderItem,
    ]
  );

  return (
    <Virtuoso
      useWindowScroll
      totalCount={data.length}
      itemContent={itemContent}
      endReached={onEndReached}
    />
  );
};
