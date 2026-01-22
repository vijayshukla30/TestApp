import React from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ToolChip from "../ui/ToolChip";

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
    <View>
      <Pressable
        onPress={onToggle}
        className="
          flex-row items-center justify-between 
          py-3 
          active:opacity-75
        "
      >
        <Text className="text-text dark:text-dark-text text-sm font-semibold">
          {title} ({tools.length})
        </Text>
        <MaterialIcons
          name={open ? "expand-less" : "expand-more"}
          size={24}
          className="text-subText dark:text-dark-subText"
        />
      </Pressable>
    </View>
  );

  return (
    <>
      <SectionHeader />

      {open && (
        <View className="flex-row flex-wrap gap-2.5 pb-4">
          {tools.map((tool) => (
            <ToolChip
              key={tool.name}
              label={tool.name}
              available={isAvailableSection}
            />
          ))}
        </View>
      )}
      {!open && <View className="h-px bg-border dark:bg-dark-border/50 my-1" />}
    </>
  );
};

export default ToolDetails;
