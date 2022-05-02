import React, { useCallback, useMemo } from "react";

import { VirtuosoGrid } from "react-virtuoso";

export function InfiniteScrollList(props: any) {
  const {
    renderItem,
    keyExtractor: _keyExtractor,
    data,
    onEndReached,
    ListHeaderComponent,
    ListFooterComponent,
    ItemSeparatorComponent,
    numColumns,
  } = props;

  const itemContent = React.useCallback(
    (index: number) => {
      if (data[index]) {
        const element = renderItem({ item: data[index], index });
        return (
          <>
            {index === 0 ? ListHeaderComponent : null}
            {element}
            {index < data.length - 1 ? ItemSeparatorComponent : null}
            {index === data.length - 1 ? ListFooterComponent : null}
          </>
        );
      }

      return null;
    },
    [
      data,
      ListHeaderComponent,
      ListFooterComponent,
      ItemSeparatorComponent,
      renderItem,
    ]
  );

  const ListContainer = useCallback(
    React.forwardRef((props: any, ref: any) => {
      return (
        <div
          {...props}
          style={{ ...props.style, display: "flex", flexWrap: "wrap" }}
          ref={ref}
        />
      );
    }),
    [numColumns]
  );

  const ItemContainer = useCallback(
    React.forwardRef((props: any, ref: any) => {
      const width = numColumns ? `${100 / numColumns}%` : "100%";
      return <div {...props} style={{ ...props.style, width }} ref={ref} />;
    }),
    [numColumns]
  );

  const gridProps = useMemo(
    () => ({
      Item: ItemContainer,
      List: ListContainer,
    }),
    [ItemContainer, ListContainer]
  );

  return (
    <>
      <VirtuosoGrid
        useWindowScroll
        totalCount={data.length}
        //@ts-ignore
        components={gridProps}
        endReached={onEndReached}
        itemContent={itemContent}
      />
    </>
  );
}
