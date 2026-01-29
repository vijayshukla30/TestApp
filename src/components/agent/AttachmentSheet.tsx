import { Modal, Pressable, View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { getIconColor } from "../../theme/colors";
type Props = {
  visible: boolean;
  onClose: () => void;
};
export function AttachmentSheet({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable className="flex-1 justify-end bg-black/40" onPress={onClose}>
        <View className="flex-row justify-around px-4 py-6 rounded-t-3xl bg-surface">
          <AttachmentItem icon="photo" label="Gallery" bgColor="#A5B4FC" />
          <AttachmentItem icon="camera-alt" label="Camera" bgColor="#86EFAC" />
          <AttachmentItem icon="attach-file" label="File" bgColor="#FDE68A" />
        </View>
      </Pressable>
    </Modal>
  );
}

type ItemProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  bgColor: string;
};

function AttachmentItem({ icon, label, bgColor }: ItemProps) {
  const iconColor = getIconColor(bgColor);
  return (
    <Pressable className="items-center w-[90px]">
      <View
        className="w-20 h-20 rounded-full items-center justify-center shadow-lg"
        style={{
          backgroundColor: bgColor,
          shadowColor: bgColor,
          shadowOpacity: 0.45,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 8 },
          elevation: 5,
        }}
      >
        <MaterialIcons name={icon} size={26} color={iconColor} />
      </View>
      <Text className="text-text text-xs mt-2">{label}</Text>
    </Pressable>
  );
}
