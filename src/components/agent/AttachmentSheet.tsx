import { Modal, Pressable, View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
type Props = {
  visible: boolean;
  onClose: () => void;
};
export function AttachmentSheet({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable
        className="flex-1 justify-end bg-black/40 dark:bg-black/60"
        onPress={onClose}
      >
        <View
          className="
        flex-row justify-around 
        px-5 py-6 
        rounded-t-3xl 
        bg-surface dark:bg-dark-surface
        border-t border-border dark:border-dark-border
        shadow-2xl dark:shadow-black/40
      "
        >
          <AttachmentItem
            icon="photo"
            label="Gallery"
            bgColor="#A5B4FC"
            iconColor="#1E1B4B" // dark indigo (good contrast on light purple)
          />
          <AttachmentItem
            icon="camera-alt"
            label="Camera"
            bgColor="#86EFAC"
            iconColor="#064E3B" // dark emerald
          />
          <AttachmentItem
            icon="attach-file"
            label="File"
            bgColor="#FDE68A"
            iconColor="#78350F" // dark amber
          />
        </View>
      </Pressable>
    </Modal>
  );
}

type ItemProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  bgColor: string;
  iconColor: string;
};

function AttachmentItem({ icon, label, bgColor, iconColor }: ItemProps) {
  return (
    <Pressable className="items-center w-[90px] active:opacity-75">
      <View
        className={`
      w-20 h-20 rounded-full 
      items-center justify-center 
      shadow-lg dark:shadow-xl
      bg-[${bgColor}] dark:bg-[${bgColor}]  // keep dynamic bgColor if needed
      border border-border/20 dark:border-dark-border/30
    `}
        style={{
          shadowColor: bgColor,
          shadowOpacity: 0.45,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 8 },
          elevation: 5,
        }}
      >
        <MaterialIcons name={icon} size={26} color={iconColor} />
      </View>
      <Text className="text-text dark:text-dark-text text-xs mt-2 font-medium">
        {label}
      </Text>
    </Pressable>
  );
}
