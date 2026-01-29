import React from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ToolChip from "../ui/ToolChip";
import { colors } from "../../theme/colors";

type Tool = {
  name: string;
  available: boolean;
};

type Props = {
  title: string;
  tools: Tool[];
  isAvailableSection: boolean;
  open: boolean;
  onToggle: () => void;
};

const ToolDetails = ({
  title,
  tools,
  isAvailableSection,
  open,
  onToggle,
}: Props) => {
  const SectionHeader = () => (
    <Pressable
      onPress={onToggle}
      className="flex-row items-center justify-between py-2"
    >
      <Text className="text-text text-sm font-semibold">
        {title} ({tools.length})
      </Text>
      <MaterialIcons
        name={open ? "expand-less" : "expand-more"}
        size={24}
        color={colors.subText}
      />
    </Pressable>
  );

  return (
    <>
      <SectionHeader />

      {open && (
        <View className="flex-row flex-wrap gap-2.5 mb-4">
          {tools.map((tool) => (
            <ToolChip
              key={tool.name}
              label={tool.name}
              available={isAvailableSection}
            />
          ))}
        </View>
      )}
    </>
  );
};

export default ToolDetails;
