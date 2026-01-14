import { Modal, Pressable, View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import useTheme from "../../hooks/useTheme";

export function AttachmentSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.sheetOverlay} onPress={onClose}>
        <View style={[styles.sheet, { backgroundColor: theme.surface }]}>
          <AttachmentItem icon="photo" label="Gallery" color="#A5B4FC" />
          <AttachmentItem icon="camera-alt" label="Camera" color="#86EFAC" />
          <AttachmentItem icon="attach-file" label="File" color="#FDE68A" />
        </View>
      </Pressable>
    </Modal>
  );
}

function AttachmentItem({ icon, label, color }: any) {
  const { theme } = useTheme();
  return (
    <Pressable style={styles.attachmentItem}>
      <View style={[styles.attachmentIcon, { backgroundColor: color }]}>
        <MaterialIcons name={icon} size={26} color="#000" />
      </View>
      <Text
        style={{
          color: theme.text,
          fontSize: 13,
          marginTop: 6,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sheetOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  attachmentItem: {
    alignItems: "center",
    width: 90,
  },

  attachmentIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",

    // Depth
    elevation: 8,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
});
