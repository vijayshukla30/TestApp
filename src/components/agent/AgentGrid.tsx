import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
import useTheme from "../../hooks/useTheme";
import AgentCardSkeleton from "../skeltons/AgentCardSkeleton";

type Props<T> = {
  data: T[];
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  getId: (item: T) => string;
  renderItem: (item: T) => any;
};

const NUM_COLUMNS = 2;
const GAP = 16;
const ROW_GAP = 16;

export default function AgentGrid<T>({
  data,
  loading,
  refreshing,
  onRefresh,
  getId,
  renderItem,
}: Props<T>) {
  const { theme } = useTheme();
  const ItemSeparator = () => <View style={{ height: ROW_GAP }} />;

  if (loading) {
    return (
      <FlatList
        data={[1, 2, 3, 4]}
        keyExtractor={(i) => `skeleton-${i}`}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={styles.columnWrapper}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={() => (
          <View style={styles.cardContainer}>
            <AgentCardSkeleton />
          </View>
        )}
      />
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={getId}
      numColumns={NUM_COLUMNS}
      columnWrapperStyle={styles.columnWrapper}
      ItemSeparatorComponent={ItemSeparator}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        ) : undefined
      }
      renderItem={({ item }) => (
        <View style={styles.cardContainer}>{renderItem(item)}</View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  columnWrapper: {
    gap: GAP,
    justifyContent: "space-between",
  },
  cardContainer: {
    flexBasis: "48%",
  },
});
