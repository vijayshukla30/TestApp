import React, { useState, useEffect } from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import { useConsumerDetails } from "../../../../../hooks/useConsumerDetails";
import Screen from "../../../../../components/Screen";
import LoadingCard from "../../../../../components/ui/LoadingCard";
import { fetchPlatformConfigurations } from "../../../../../services/platform";
import {
  ASANA_BASE_URL,
  PLATFORMS,
  TODOIST_BASE_URL,
  TRELLO_BASE_URL,
} from "../../../../../utils/platform";
import { decodeAuthState } from "../../../../../utils/auth";

const Workspace = () => {
  const { agentId } = useLocalSearchParams<{
    agentId: string;
  }>();

  const agent = useAppSelector((s) =>
    s.agents.list.find((a) => a.uuid === agentId),
  );

  const { consumer, loading } = useConsumerDetails(agent ?? null);
  console.log("consumer :>> ", consumer);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);

  const platform = agent?.platform?.type?.toLowerCase();
  console.log("platform :>> ", platform);
  const clientId = agent?.platform?.clientId;
  console.log("clientId :>> ", clientId);

  console.log("platform raw:", agent?.platform?.type);
  console.log("expected:", PLATFORMS.ASANA);

  useEffect(() => {
    if (!platform) {
      console.log("Platform missing");
      setFetching(false);
      return;
    }

    if (!consumer || !consumer.accessToken) {
      console.log("Waiting for consumer accessToken");
      return;
    }

    const run = async () => {
      try {
        console.log("Running");

        if (platform === PLATFORMS.ASANA.toLowerCase()) {
          console.log("Load Asana");
          const res = await fetch(`${ASANA_BASE_URL}/workspaces`, {
            headers: {
              Authorization: `Bearer ${consumer.accessToken}`,
              Accept: "application/json",
            },
          });
          const json = await res.json();
          setWorkspaces(json.data || []);
        }

        if (platform === PLATFORMS.TRELLO.toLowerCase() && clientId) {
          console.log("Load Trello");
          const res = await fetch(
            `${TRELLO_BASE_URL}/members/me/organizations?fields=displayName,id&key=${clientId}&token=${consumer.accessToken}`,
          );
          const json = await res.json();
          setWorkspaces(Array.isArray(json) ? json : []);
        }

        if (platform === PLATFORMS.TODOIST.toLowerCase()) {
          console.log("Load Todoist");
          const res = await fetch(`${TODOIST_BASE_URL}/sync`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${consumer.accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ resource_types: ["workspaces"] }),
          });
          const json = await res.json();
          setWorkspaces(json.workspaces || []);
        }
      } catch (err) {
        console.error("Workspace fetch failed:", err);
        setWorkspaces([]);
      } finally {
        setFetching(false); // 🔴 THIS WAS NEVER HIT BEFORE
      }
    };

    run();
  }, [consumer?.accessToken, platform, clientId]);

  if (loading || fetching) {
    return (
      <Screen>
        <LoadingCard title="Loading workspaces" />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text className="text-xl text-text dark:text-dark-text font-semibold mb-4">
        Select Workspace
      </Text>

      <FlatList
        data={workspaces}
        keyExtractor={(w) => w.gid || w.id}
        renderItem={({ item }) => {
          const workspaceId = item.gid || item.id;
          const name = item.name || item.displayName;
          return (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: `/agents/${agentId}/config/item`,
                  params: { workspaceId },
                })
              }
              className="p-4 rounded-xl mb-3 bg-surface"
            >
              <Text className="text-text">{name}</Text>
            </Pressable>
          );
        }}
      />
    </Screen>
  );
};

export default Workspace;
