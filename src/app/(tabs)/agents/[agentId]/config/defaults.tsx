import { Pressable, ScrollView, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import useAppDispatch from "../../../../../hooks/useAppDispatch";
import { upsertConsumer } from "../../../../../features/consumer/consumerSlice";
import useAuth from "../../../../../hooks/useAuth";
import Screen from "../../../../../components/Screen";

const DefaultStep = () => {
  const { agentId, workspaceId, itemId } = useLocalSearchParams<any>();
  const dispatch = useAppDispatch();
  const { token } = useAuth();

  const agent = useAppSelector((s) =>
    s.agents.list.find((a) => a.uuid === agentId),
  );

  const [defaultSettings, setDefaultSettings] = useState<any>({});

  const save = async () => {
    await dispatch(
      upsertConsumer({
        agentId,
        seoName: agent.seoName,
        token,
        data: {
          integrationIds: {
            id1: workspaceId || "",
            id2: itemId,
          },
          defaultSettings,
        },
      }),
    ).unwrap();

    router.replace(`/agents/${agentId}`);
  };

  return (
    <Screen>
      <Text className="text-xl font-semibold mb-4">
        Default Settings (Optional)
      </Text>

      <ScrollView className="mb-6">
        <Text className="text-subText">You can change these later</Text>
        {/* keep this minimal for now */}
      </ScrollView>

      <Pressable onPress={save} className="bg-primary rounded-xl p-4">
        <Text className="text-white text-center font-semibold">
          Finish Setup
        </Text>
      </Pressable>
    </Screen>
  );
};

export default DefaultStep;
