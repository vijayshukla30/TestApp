import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useState } from "react";
import { Link } from "expo-router";
import { useContext } from "react";

import Screen from "../../components/Screen";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { ThemeContext } from "../../context/ThemeContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { theme } = useContext(ThemeContext);

  return (
    <Screen center>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={[styles.logoWrapper, { backgroundColor: theme.surface }]}>
          <Image
            source={require("../../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Input
          placeholder="Email or Username"
          value={email}
          onChangeText={setEmail}
        />

        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button title="Login" onPress={() => {}} />

        <Pressable style={styles.forgot}>
          <Link style={styles.link} href="/(auth)/forgot-password">
            Forgot password?
          </Link>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don’t have an account?</Text>
          <Link href="/(auth)/register" style={styles.link}>
            {" "}
            Register
          </Link>
        </View>
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
    backgroundColor: "#4f46e5", // or light gray
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 90,
    height: 90,
  },
  form: {
    width: "100%",
  },
  forgot: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#444",
  },
  link: {
    color: "#4f46e5",
    fontWeight: "600",
  },
});
