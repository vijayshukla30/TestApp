import { View, Text, Image } from "react-native";
import { useState, useContext } from "react";
import { Link, router } from "expo-router";

import Screen from "../../components/Screen";
import { UIContext } from "../../context/UIContext";
import AuthSkeleton from "../../components/auth/AuthSkeleton";
import { api } from "../../services/api";
import AuthCard from "../../components/auth/AuthCard";
import Input from "../../components/ui/Input";
import ErrorText from "../../components/ui/ErrorText";
import PrimaryButton from "../../components/ui/PrimaryButton";

export default function Register() {
  const { showMessage } = useContext(UIContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};

    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Invalid email";

    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters";

    if (!phone.trim()) e.phone = "Phone number required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onRegister = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await api.register({
        name,
        email,
        phoneNumber: phone,
        password,
        roles: "CONSUMER",
      });

      if ("uuid" in res) {
        router.replace({
          pathname: "/(auth)/verify",
          params: { email: res.email },
        });
        return;
      }
      showMessage(res.message);
    } catch {
      showMessage("Registration failed");
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
        <View className="rounded-2xl bg-surface dark:bg-dark-surface border border-border dark:border-dark-border p-6">
          {/* Logo */}
          <View className="items-center mb-3">
            <Image
              source={require("../../../assets/logo.png")}
              className="w-14 h-14 mb-2"
              resizeMode="contain"
            />
            <Text className="text-text dark:text-dark-text text-lg font-semibold tracking-wide">
              gennie
            </Text>
          </View>

          {/* Title */}
          <Text className="text-text dark:text-dark-text text-xl font-semibold text-center mt-3">
            Create Account
          </Text>
          <Text className="text-subText dark:text-dark-subtext text-center mb-6">
            Sign up to get started
          </Text>

          <Input
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="sentences"
          />
          <ErrorText message={errors.name} />

          <Input
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <ErrorText message={errors.email} />

          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <ErrorText message={errors.password} />

          <Input
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <ErrorText message={errors.phone} />

          {/* Submit */}
          <PrimaryButton
            title="Create Account"
            onPress={onRegister}
            loading={loading}
          />

          <View className="mt-5 items-center">
            <Text className="text-subText dark:text-dark-subtext">
              Already have an account?
            </Text>
            <Link href="/(auth)/login">
              <Text className="text-primary dark:text-dark-primary font-semibold mt-1">
                Sign in
              </Text>
            </Link>
          </View>
        </View>
      </AuthCard>
    </Screen>
  );
}
