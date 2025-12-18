import { View, Text, StyleSheet, Image } from "react-native";
import { useState, useContext } from "react";
import { Link } from "expo-router";
import { TextInput, Button } from "react-native-paper";

import Screen from "../../components/Screen";
import useTheme from "../../hooks/useTheme";
import { UIContext } from "../../context/UIContext";

export default function Login() {
  const { theme } = useTheme();
  const { showMessage } = useContext(UIContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const onLogin = () => {
    if (!email || !password) {
      showMessage("Please enter email and password");
      return;
    }
    showMessage("Login clicked (API later)");
  };

  return (
    <Screen center>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View
          style={[
            styles.logoWrapper,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <Image
            source={require("../../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      <Text style={[styles.title, { color: theme.text }]}>Log In</Text>
      <Text style={[styles.subtitle, { color: theme.subText }]}>
        Login to your account to continue
      </Text>

      {/* Inputs */}
      <TextInput
        label="Email or Username"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
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

      <Button
        mode="contained"
        onPress={onLogin}
        loading={loading}
        disabled={loading}
      >
        Login
      </Button>

      {/* Links */}
      <View style={styles.links}>
        <Link href="/(auth)/forgot-password">Forgot password?</Link>
      </View>

      <View style={styles.footer}>
        <Text style={{ color: theme.subText }}>Don’t have an account?</Text>
        <Link href="/(auth)/register" style={styles.link}>
          {" "}
          Register
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
  logo: {
    width: 90,
    height: 90,
  },
  input: {
    marginBottom: 12,
  },
  links: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  footer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "center",
  },
  link: {
    color: "#6366F1",
    fontWeight: "600",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    marginBottom: 24,
  },
});
