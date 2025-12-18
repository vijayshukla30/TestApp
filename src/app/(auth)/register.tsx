import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useState, useContext } from "react";
import { Link } from "expo-router";
import { TextInput, Button, Menu, HelperText } from "react-native-paper";

import Screen from "../../components/Screen";
import useTheme from "../../hooks/useTheme";
import { UIContext } from "../../context/UIContext";

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

    if (!email.trim()) {
      e.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      e.email = "Invalid email address";
    }

    if (!password) {
      e.password = "Password is required";
    } else if (password.length < 6) {
      e.password = "Password must be at least 6 characters";
    }

    if (!phone.trim()) {
      e.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      e.phone = "Enter a valid 10-digit number";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onRegister = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      // 🔜 API call later
      await new Promise((res) => setTimeout(res, 1200));

      showMessage("Registration successful");
    } catch (err) {
      showMessage("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
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

        <Text style={[styles.title, { color: theme.text }]}>
          Create Account
        </Text>
        <Text style={[styles.subtitle, { color: theme.subText }]}>
          Sign up to get started
        </Text>

        {/* Name */}
        <TextInput
          label="Full Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          error={!!errors.name}
        />
        <HelperText type="error" visible={!!errors.name}>
          {errors.name}
        </HelperText>

        {/* Email */}
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          autoCapitalize="none"
          keyboardType="email-address"
          error={!!errors.email}
        />
        <HelperText type="error" visible={!!errors.email}>
          {errors.email}
        </HelperText>

        {/* Password */}
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          error={!!errors.password}
        />
        <HelperText type="error" visible={!!errors.password}>
          {errors.password}
        </HelperText>

        {/* Phone */}
        <TextInput
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          mode="outlined"
          error={!!errors.phone}
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
          style={{ marginTop: 12 }}
        >
          Register
        </Button>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={{ color: theme.subText }}>Already have an account?</Text>
          <Link href="/(auth)/login" style={styles.link}>
            {" "}
            Login
          </Link>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    marginBottom: 24,
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
});
