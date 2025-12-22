import { View, Text, StyleSheet } from "react-native";
import { useState, useContext } from "react";
import { TextInput, Button, Surface } from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";

import Screen from "../../components/Screen";
import useTheme from "../../hooks/useTheme";
import { UIContext } from "../../context/UIContext";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../services/api";
import AuthCard from "../../components/auth/AuthCard";
import { VerifyOtpResponse } from "../../types/auth";
import AppCard from "../../components/ui/AppCard";

export default function Verify() {
  const { theme } = useTheme();
  const { showMessage } = useContext(UIContext);
  const { login } = useContext(AuthContext)!;

  const { email } = useLocalSearchParams<{ email: string }>();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const onVerify = async () => {
    if (!otp) {
      showMessage("Enter OTP");
      return;
    }

    try {
      setLoading(true);

      const res: VerifyOtpResponse = await api.verifyOtp({
        email,
        otp,
      });

      const user = {
        uuid: res.uuid,
        email: res.email,
        name: res.name,
        role: res.role,
        phoneNumber: res.phoneNumber,
      };

      // ✅ Auto login
      await login(res.token, user);

      showMessage("Account verified");
      router.replace("/(tabs)/home");
    } catch (err: any) {
      showMessage("OTP expired or invalid. Please login again.");
      router.replace("/(auth)/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen center>
      <AuthCard>
        <AppCard variant="auth">
          <Text style={[styles.title, { color: theme.text }]}>Verify OTP</Text>

          <Text style={[styles.subtitle, { color: theme.subText }]}>
            Enter the OTP sent to {email}
          </Text>

          <TextInput
            label="6-digit code"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            returnKeyType="done"
            onSubmitEditing={onVerify}
            activeOutlineColor={theme.primary}
            outlineColor={theme.border}
            mode="outlined"
            style={{ marginBottom: 16 }}
          />

          <Button
            mode="contained"
            onPress={onVerify}
            loading={loading}
            disabled={loading}
          >
            Verify
          </Button>

          {/* 🔁 Re-login hint */}
          <View style={styles.footer}>
            <Text style={{ color: theme.subText }}>OTP expired?</Text>
            <Button mode="text" onPress={() => router.replace("/(auth)/login")}>
              Login again
            </Button>
          </View>
        </AppCard>
      </AuthCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 24,
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
});
