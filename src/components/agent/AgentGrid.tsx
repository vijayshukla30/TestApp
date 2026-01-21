import { View, FlatList, RefreshControl } from "react-native";
import AgentCardSkeleton from "../skeltons/AgentCardSkeleton";
import { colors } from "../../theme/colors";

type Props<T> = {
  data: T[];
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  getId: (item: T) => string;
  renderItem: (item: T) => any;
};

const NUM_COLUMNS = 2;
const ROW_GAP = 16;

export default function AgentGrid<T>({
  data,
  loading,
  refreshing,
  onRefresh,
  getId,
  renderItem,
}: Props<T>) {
  const ItemSeparator = () => <View style={{ height: ROW_GAP }} />;

  if (loading) {
    return (
      <FlatList
        data={[1, 2, 3, 4]}
        keyExtractor={(i) => `skeleton-${i}`}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        columnWrapperStyle={{ gap: 16 }}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={() => (
          <View className="flex-1">
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
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
      columnWrapperStyle={{ gap: 16 }}
      ItemSeparatorComponent={ItemSeparator}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        ) : undefined
      }
      renderItem={({ item }) => (
        <View className="flex-1">{renderItem(item)}</View>
      )}
    />
  );
}
