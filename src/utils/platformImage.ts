export function getPlatformImage(type?: string) {
  switch (type?.toLowerCase()) {
    case "asana":
      return require("../../assets/platforms/asana.png");

    case "slack":
      return require("../../assets/platforms/slack.png");

    case "trello":
      return require("../../assets/platforms/trello.png");

    default:
      // Composite / fallback image
      return require("../../assets/platforms/customPlatform.png");
  }
}
