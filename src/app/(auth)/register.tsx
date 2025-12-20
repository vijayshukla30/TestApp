import { View, Text, StyleSheet, Image } from "react-native";
import { useState, useContext } from "react";
import { Link, router } from "expo-router";
import { TextInput, Button, Surface, HelperText } from "react-native-paper";

import Screen from "../../components/Screen";
import useTheme from "../../hooks/useTheme";
import { UIContext } from "../../context/UIContext";
import AuthSkeleton from "../../components/auth/AuthSkeleton";
import { api } from "../../services/api";
import AuthCard from "../../components/auth/AuthCard";
import AppCard from "../../components/ui/AppCard";

export default function Register() {
  const { theme } = useTheme();
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

      if (res?.uuid) {
        showMessage(res.message);

        router.push({
          pathname: "/(auth)/verify",
          params: { email },
        });
      }
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
        <AppCard variant="auth">
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.brand}>gennie</Text>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: theme.text }]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, { color: theme.subText }]}>
            Sign up to get started
          </Text>

          <TextInput
            label="Full Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            autoCapitalize="words"
            textContentType="name"
            activeOutlineColor={theme.primary}
            outlineColor={theme.border}
            error={!!errors.name}
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.name}>
            {errors.name}
          </HelperText>

          <TextInput
            label="Email address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            mode="outlined"
            activeOutlineColor={theme.primary}
            outlineColor={theme.border}
            error={!!errors.email}
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.email}>
            {errors.email}
          </HelperText>

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            mode="outlined"
            activeOutlineColor={theme.primary}
            outlineColor={theme.border}
            error={!!errors.password}
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.password}>
            {errors.password}
          </HelperText>

          <TextInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoComplete="tel"
            textContentType="telephoneNumber"
            mode="outlined"
            activeOutlineColor={theme.primary}
            outlineColor={theme.border}
            error={!!errors.phone}
            style={styles.input}
          />
          <HelperText type="error" visible={!!errors.phone}>
            {errors.phone}
          </HelperText>

          {/* Submit */}
          <Button
            mode="contained"
            onPress={onRegister}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Create Account
          </Button>

          <View style={styles.footer}>
            <Text style={{ color: theme.subText }}>
              Already have an account?
            </Text>
            <Link
              href="/(auth)/login"
              style={[styles.link, { color: theme.primary }]}
            >
              {" "}
              Sign in
            </Link>
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  logo: {
    width: 56,
    height: 56,
    marginBottom: 6,
  },
  brand: {
    color: "#E5E7EB",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 12,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  link: {
    fontWeight: "600",
  },
});
