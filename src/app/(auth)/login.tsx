import { View, Text, StyleSheet, Image } from "react-native";
import { useState, useContext } from "react";
import { Link, router } from "expo-router";
import { TextInput, Button, Surface } from "react-native-paper";

import Screen from "../../components/Screen";
import useTheme from "../../hooks/useTheme";
import { UIContext } from "../../context/UIContext";
import AuthCard from "../../components/auth/AuthCard";
import AuthSkeleton from "../../components/auth/AuthSkeleton";
import { api } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import AppCard from "../../components/ui/AppCard";

export default function Login() {
  const { theme } = useTheme();
  const { showMessage } = useContext(UIContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext)!;

  const onLogin = async () => {
    if (!email || !password) {
      showMessage("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      // API later
      const res = await api.login(email, password);
      if (res?.message === "Invalid credentials") {
        showMessage("Invalid email or password");
        return;
      }
      // ⚠️ Account not verified
      if (res?.message === "Account not verified. OTP resent to email.") {
        showMessage("OTP sent to your email");

        router.replace({
          pathname: "/(auth)/verify",
          params: { email: res.email || email },
        });
        return;
      }

      if (res?.token) {
        const user = {
          uuid: res.uuid,
          email: res.email,
          name: res.name,
          role: res.role,
          phoneNumber: res.phoneNumber,
        };

        await login(res.token, user);
        router.replace("/(tabs)/home");
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
          <Text style={[styles.title, { color: theme.text }]}>Sign In</Text>
          <Text style={[styles.subtitle, { color: theme.subText }]}>
            Get access to your account
          </Text>

          {/* Inputs */}
          <TextInput
            label="Email address"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
          />

          <View style={styles.forgot}>
            <Link
              href="/(auth)/forgot-password"
              style={[styles.link, { color: theme.primary }]}
            >
              Forgot Password?
            </Link>
          </View>

          {/* Button */}
          <Button
            mode="contained"
            onPress={onLogin}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Sign In
          </Button>

          <View style={styles.footer}>
            <Text style={{ color: theme.subText }}>Don’t have an account?</Text>
            <Link
              href="/(auth)/register"
              style={[styles.link, { color: theme.primary }]}
            >
              {" "}
              Create an account
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
    marginBottom: 16,
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
    marginBottom: 24,
  },
  input: {
    marginBottom: 14,
  },
  forgot: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  button: {
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
