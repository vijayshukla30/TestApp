import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  FlatList,
  Pressable,
  Image,
} from "react-native";
import { useFocusEffect, router } from "expo-router";

import Screen from "../../components/Screen";
import useTheme from "../../hooks/useTheme";
import AppCard from "../../components/ui/AppCard";
import useAuth from "../../hooks/useAuth";
import useAppDispatch from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { fetchUserActivity } from "../../features/activity/activitySlice";
import { Agent } from "../../types/agent";
import { getPlatformImage } from "../../utils/platform";
import AgentCardSkeleton from "../../components/skeltons/AgentCardSkeleton";

// FIXED: More precise responsive constants for iPhone
const HORIZONTAL_PADDING = 20; // Increased for safe areas
const GAP = 16; // Slightly larger horizontal gap
const ROW_GAP = 16; // NEW: Vertical spacing between rows
const NUM_COLUMNS = 2;

export default function Home() {
  const { theme } = useTheme();
  const { user, token } = useAuth()!;
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.activity);

  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!token) return;

      dispatch(fetchUserActivity({ token }));
    }, [token])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchUserActivity({ token })).unwrap();
    setRefreshing(false);
  };

  const installed = list.filter((x) => x.isInstalled);
  console.log("installed :>> ", JSON.stringify(installed));

  const ItemSeparator = () => <View style={{ height: ROW_GAP }} />;

  const renderAgentItem = ({ item }: { item: { assistantId: any } }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/agents/[agentId]",
          params: {
            agentId: item.assistantId.uuid,
            agent: JSON.stringify(item),
          },
        })
      }
      style={styles.cardContainer}
    >
      <AppCard variant="default" style={styles.agentCard}>
        <Image
          source={getPlatformImage(item.assistantId.platform?.type)}
          style={styles.platformImage}
          resizeMode="contain"
        />
        <Text
          style={[styles.agentName, { color: theme.text }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={12}
        >
          {item.assistantId.agentName}
        </Text>
      </AppCard>
    </Pressable>
  );

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: theme.subText }]}>
          Welcome back 👋
        </Text>
        <Text style={[styles.name, { color: theme.text }]}>{user?.name}</Text>
      </View>
      <AppCard>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Connect your tools
        </Text>

        <Text style={[styles.cardSubtitle, { color: theme.subText }]}>
          Integrate your workflow tools to automate tasks and stay in sync.
        </Text>
      </AppCard>
      {loading && (
        <FlatList
          data={[1, 2, 3, 4]}
          keyExtractor={(item) => `skeleton-${item}`}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={ItemSeparator}
          renderItem={() => (
            <View style={styles.cardContainer}>
              <AgentCardSkeleton />
            </View>
          )}
        />
      )}
      {!loading && (
        <FlatList
          data={installed}
          keyExtractor={(item) => item.assistantId.uuid}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={ItemSeparator} // ← FIXES vertical spacing
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || loading}
              onRefresh={onRefresh}
              tintColor={theme.primary}
              colors={[theme.primary]}
            />
          }
          renderItem={renderAgentItem}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 8,
    marginBottom: 24,
  },

  greeting: {
    fontSize: 14,
  },

  name: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 4,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  cardSubtitle: {
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },

  columnWrapper: {
    gap: GAP,
    justifyContent: "space-between", // Perfect even distribution
  },

  listContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: 40,
  },

  cardContainer: {
    flexBasis: "48%", // ← PERFECT FIX: 48% + gap = perfect fit
  },
  agentCard: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 28, // Slightly more vertical padding
  },
  platformImage: {
    width: 56, // Slightly larger
    height: 56,
    marginBottom: 16,
  },
  agentName: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    paddingHorizontal: 8, // Give breathing room on sides
  },
});
