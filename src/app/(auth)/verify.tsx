import { View, Text } from "react-native";
import { useState, useContext } from "react";
import { useLocalSearchParams, router } from "expo-router";

import Screen from "../../components/Screen";
import { UIContext } from "../../context/UIContext";
import { api } from "../../services/api";
import AuthCard from "../../components/auth/AuthCard";
import { VerifyOtpResponse } from "../../types/auth";
import useAuth from "../../hooks/useAuth";
import Input from "../../components/ui/Input";
import PrimaryButton from "../../components/ui/PrimaryButton";

export default function Verify() {
  const { showMessage } = useContext(UIContext);
  const { login } = useAuth()!;

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
        <View className="rounded-2xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border p-6">
          <Text className="text-text dark:text-dark-text text-xl font-semibold text-center">
            Verify OTP
          </Text>

          <Text className="text-subText dark:text-dark-subtext text-center mt-2 mb-6">
            Enter the OTP sent to{" "}
            <Text className="font-semibold text-text dark:text-dark-text">
              {email}
            </Text>
          </Text>

          <Input
            placeholder="6-digit code"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
          />

          <PrimaryButton title="Verify" onPress={onVerify} loading={loading} />

          <View className="mt-6 items-center">
            <Text className="text-subText dark:text-dark-subtext mb-1">
              OTP expired?
            </Text>
            <Text
              onPress={() => router.replace("/(auth)/login")}
              className="text-primary dark:text-dark-primary font-semibold"
            >
              Login again
            </Text>
          </View>
        </View>
      </AuthCard>
    </Screen>
  );
}
