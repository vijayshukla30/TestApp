import { Pressable, Image, Text, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AppCard from "../ui/AppCard";
import { getPlatformImage } from "../../utils/platform";
import useTheme from "../../hooks/useTheme";
import { Agent } from "../../types/agent";

type Props = {
  agent: Agent;
  onOpenDetail: () => void;
  onUseNow: () => void;
  onCall?: () => void;
};

export default function HomeAgentCard({
  agent,
  onOpenDetail,
  onUseNow,
  onCall,
}: Props) {
  const { theme } = useTheme();

  return (
    <AppCard
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          shadowColor: theme.primary,
        },
      ]}
    >
      {agent.phoneId && (
        <Pressable
          style={[styles.cornerIcon, styles.leftIcon]}
          onPress={onCall}
          android_ripple={{ color: "#ffffff20", radius: 18 }}
        >
          <MaterialIcons name="call" size={18} color={theme.primary} />
        </Pressable>
      )}

      {/* Settings icon – TOP RIGHT */}
      <Pressable
        style={[styles.cornerIcon, styles.rightIcon]}
        onPress={onOpenDetail}
        android_ripple={{ color: "#ffffff20", radius: 18 }}
      >
        <MaterialIcons name="settings" size={18} color={theme.subText} />
      </Pressable>

      {/* Platform Icon */}
      <View style={styles.iconWrap}>
        <Image
          source={getPlatformImage(agent.platform?.type)}
          style={styles.icon}
          resizeMode="contain"
        />
      </View>

      {/* Agent name */}
      <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
        {agent.agentName}
      </Text>

      {/* CTA */}
      <Pressable
        style={({ pressed }) => [
          styles.useBtn,
          {
            backgroundColor: theme.primary,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
        onPress={onUseNow}
      >
        <MaterialIcons name="play-arrow" size={18} color="#000" />
        <Text style={styles.useText}>Use Now</Text>
      </Pressable>
    </AppCard>
  );
}
const styles = StyleSheet.create({
  card: {
    paddingVertical: 30,
    paddingHorizontal: 18,
    borderRadius: 20,
    alignItems: "center",

    // Depth
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 10,
  },

  cornerIcon: {
    position: "absolute",
    top: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff08",
    opacity: 0.85,
  },

  leftIcon: {
    left: 12,
  },

  rightIcon: {
    right: 12,
  },

  iconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#ffffff10",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  icon: {
    width: 40,
    height: 40,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },

  useBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,

    // Button depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },

  useText: {
    fontWeight: "700",
    fontSize: 14,
    color: "#000",
  },
});
