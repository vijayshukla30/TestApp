import * as Linking from "expo-linking";

export async function openAuthLink(url: string) {
  const supported = await Linking.canOpenURL(url);
  if (!supported) {
    throw new Error("Cannot open auth URL");
  }
  await Linking.openURL(url);
}
