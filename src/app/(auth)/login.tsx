import { View, Text, Image } from "react-native";
import { useState, useContext } from "react";
import { Link, router } from "expo-router";

import Screen from "../../components/Screen";
import { UIContext } from "../../context/UIContext";
import AuthCard from "../../components/auth/AuthCard";
import AuthSkeleton from "../../components/auth/AuthSkeleton";

import { api } from "../../services/api";
import useAuth from "../../hooks/useAuth";
import { isAuthSuccess } from "../../utils/authGaurds";
import Input from "../../components/ui/Input";
import PrimaryButton from "../../components/ui/PrimaryButton";

export default function Login() {
  const { login } = useAuth();
  const { showMessage } = useContext(UIContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!email || !password) {
      showMessage("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      // API later
      const res = await api.login(email, password);
      if (isAuthSuccess(res)) {
        await login(res.token, {
          uuid: res.uuid,
          email: res.email,
          name: res.name,
          role: res.role,
          phoneNumber: res.phoneNumber,
        });

        router.replace("/(tabs)/home");
        return;
      }

      if (res.message === "Invalid credentials") {
        showMessage("Invalid email or password");
        return;
      }

      if (res.message === "Account not verified. OTP resent to email.") {
        showMessage("OTP sent to your email");

        router.replace({
          pathname: "/(auth)/verify",
          params: { email: res.email || email },
        });
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Screen>
        <AuthSkeleton />
      </Screen>
    );
  }

  return (
    <Screen center>
      <AuthCard>
        <View className="rounded-2xl bg-surface border border-border p-6">
          <View className="items-center mb-4">
            <Image
              source={require("../../../assets/logo.png")}
              className="w-14 h-14 mb-2"
              resizeMode="contain"
            />
            <Text className="text-text text-lg font-semibold tracking-wide">
              gennie
            </Text>
          </View>

          <Text className="text-text text-xl font-semibold text-center mt-3">
            Sign In
          </Text>
          <Text className="text-subText text-center mb-6">
            Get access to your account
          </Text>

          <Input
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View className="items-end mb-5">
            <Link href="/(auth)/forgot-password">
              <Text className="text-primary font-semibold">
                Forgot Password?
              </Text>
            </Link>
          </View>

          <PrimaryButton title="Sign In" onPress={onLogin} loading={loading} />

          <View className="mt-5 items-center">
            <Text className="text-subText">Don’t have an account?</Text>
            <Link href="/(auth)/register">
              <Text className="text-primary font-semibold mt-1">
                Create an account
              </Text>
            </Link>
          </View>
        </View>
      </AuthCard>
    </Screen>
  );
}
