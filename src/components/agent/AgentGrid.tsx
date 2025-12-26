import {
  View,
  FlatList,
  Pressable,
  Image,
  StyleSheet,
  RefreshControl,
  Text,
} from "react-native";
import { router } from "expo-router";

import AppCard from "../ui/AppCard";
import { getPlatformImage } from "../../utils/platform";
import AgentCardSkeleton from "../skeltons/AgentCardSkeleton";
import useTheme from "../../hooks/useTheme";
import { Agent } from "../../types/agent";

type Props<T> = {
  data: T[];
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  getId: (item: T) => string;
  getAgent: (item: T) => Agent;
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
  getAgent,
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
      keyExtractor={(item) => getId(item)}
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
      renderItem={({ item }) => {
        const agent = getAgent(item);
        return (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/agents/[agentId]",
                params: {
                  agentId: agent.uuid,
                  agent: JSON.stringify(agent),
                },
              })
            }
            style={styles.cardContainer}
          >
            <AppCard style={styles.agentCard}>
              <Image
                source={getPlatformImage(agent.platform?.type)}
                style={styles.platformImage}
                resizeMode="contain"
              />
              <View>
                <Text
                  style={[styles.agentName, { color: theme.text }]}
                  numberOfLines={1}
                >
                  {agent.agentName}
                </Text>
              </View>
            </AppCard>
          </Pressable>
        );
      }}
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
  agentCard: {
    alignItems: "center",
    paddingVertical: 28,
  },
  platformImage: {
    width: 56,
    height: 56,
    marginBottom: 16,
  },
  agentName: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
