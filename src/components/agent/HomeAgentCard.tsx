import { Pressable, Image, Text, View } from "react-native";
import * as Linking from "expo-linking";
import * as Haptics from "expo-haptics";

import { getPlatformImage } from "../../utils/platform";
import { Agent } from "../../types/agent";
import Card from "../ui/Card";
import { extractUSLocalNumber, formatPhoneNumberUS } from "../../utils/format";
import ThemedIcon from "../ui/ThemedIcon";

type Props = {
  agent: Agent;
  onOpenDetail: () => void;
  onUseNow: () => void;
};

export default function HomeAgentCard({
  agent,
  onOpenDetail,
  onUseNow,
}: Props) {
  const dialNumber = async () => {
    if (!agent.phoneId?.phoneNumber) return;

    const rawPhone = agent.phoneId?.phoneNumber;
    const countryCode = agent.phoneId?.countryCode ?? "";

    const localDigits = extractUSLocalNumber(rawPhone);
    const formattedLocal = formatPhoneNumberUS(localDigits);

    const displayPhone =
      formattedLocal && countryCode
        ? `${countryCode} ${formattedLocal}`
        : rawPhone;

    // remove spaces, brackets, dashes
    const phone = displayPhone.replace(/[^\d+]/g, "");
    const url = `tel:${phone}`;

    const canOpen = await Linking.canOpenURL(url);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  return (
    <Card className="p-6 items-center min-h-[200px] justify-between">
      {agent.phoneId && (
        <Pressable
          className="
            absolute top-3 left-3 
      w-7 h-7 rounded-full 
      bg-surface-secondary/30 dark:bg-dark-surface/40   // ← subtle but visible in both modes
      items-center justify-center 
      border border-border/20 dark:border-dark-border/30  // ← light border for definition
      active:opacity-80
          "
          onPress={dialNumber}
          android_ripple={{ color: "#ffffff20", radius: 18 }}
        >
          <ThemedIcon name="call" size={16} />
        </Pressable>
      )}

      {/* Settings icon – TOP RIGHT */}
      <Pressable
        className="
          absolute top-3 right-3 
    w-7 h-7 rounded-full 
    bg-surface-secondary/30 dark:bg-dark-surface/40   // same as above
    items-center justify-center 
    border border-border/20 dark:border-dark-border/30
    active:opacity-80
        "
        onPress={onOpenDetail}
        android_ripple={{ color: "#ffffff20", radius: 18 }}
      >
        <ThemedIcon name="settings" size={16} />
      </Pressable>

      {/* Platform Icon */}
      <View
        className="
          w-16 h-16 rounded-full 
          bg-white/10 dark:bg-white/8 
          items-center justify-center 
          mb-5
          border border-border/20 dark:border-dark-border/30
        "
      >
        <Image
          source={getPlatformImage(agent.platform?.type)}
          className="w-10 h-10"
          resizeMode="contain"
        />
      </View>

      {/* Agent name */}
      <Text
        className="
          text-text dark:text-dark-text 
          text-lg font-semibold 
          mb-5 text-center
        "
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {agent.agentName}
      </Text>

      {/* CTA */}
      <Pressable
        className="
          flex-row items-center gap-1.5 
          bg-primary dark:bg-dark-primary 
          px-5 py-2.5 rounded-xl 
          active:opacity-90 shadow-sm
        "
        onPress={onUseNow}
      >
        <ThemedIcon name="play-arrow" size={18} />
        <Text className="text-black dark:text-black font-semibold text-sm">
          Use Now
        </Text>
      </Pressable>
    </Card>
  );
}
