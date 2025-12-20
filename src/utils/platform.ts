export const PLATFORMS = {
  ASANA: "asana",
  SLACK: "slack",
  TRELLO: "trello",
  TODOIST: "todoist",
  CUSTOM_PLATFORM: "custom platform",
};

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

export const getPlatformCapabilities = (platformName: string | any) => {
  const platform = platformName?.toLowerCase() || "";

  switch (platform) {
    case PLATFORMS.ASANA:
      return [
        { name: "Search Projects", available: true },
        { name: "Search Tags", available: true },
        { name: "Search Tasks", available: true },
        { name: "Search Users", available: true },

        { name: "Add Project to Task", available: true },
        { name: "Add Tag to Task", available: true },
        { name: "Remove Tag from Task", available: true },
        { name: "Add Follower to Task", available: true },
        { name: "Remove Follower from Task", available: true },
        { name: "Remove Project from Task", available: true },

        { name: "Duplicate Task", available: true },
        { name: "Delete Task", available: true },
        { name: "Update Task", available: true },
        { name: "Add Parent Task", available: true },
        { name: "Create Sub Task", available: true },
        { name: "Create Task", available: true },

        { name: "Assign Multiple Users", available: false },
        { name: "Recurring Task", available: false },
        { name: "Set Due Date", available: true },
        { name: "Time Tracking", available: false },
        { name: "Approval Workflow", available: false },
        { name: "Custom Field Editing", available: false },
        { name: "Milestones", available: false },
        { name: "Portfolios", available: false },
        { name: "Teams Search", available: false },
        { name: "Workspace Search", available: false },
      ];

    case PLATFORMS.SLACK:
      return [
        { name: "List Channels", available: true },
        { name: "Post Message", available: true },
        { name: "Reply to Thread", available: true },
        { name: "Add Reaction", available: true },
        { name: "Remove Reaction", available: true },
        { name: "Channel History", available: true },
        { name: "Thread Replies", available: true },
        { name: "Get User Info", available: true },
        { name: "Get User Profile", available: true },
        { name: "Delete Message", available: true },
        { name: "Update Message", available: true },
        { name: "Get Unread Messages", available: true },

        { name: "Send DM", available: true },
        { name: "Schedule Message", available: false },
        { name: "Send Ephemeral Message", available: false },
        { name: "Create Channel", available: false },
        { name: "Archive Channel", available: false },
        { name: "Invite User to Channel", available: false },
        { name: "Kick User", available: false },
        { name: "Pin Message", available: false },
        { name: "Add Bookmark", available: false },
        { name: "Create Reminder", available: false },
      ];

    case PLATFORMS.TRELLO:
      return [
        { name: "List Cards", available: true },
        { name: "Move Card", available: true },
        { name: "Update Card", available: true },
        { name: "Get Card", available: true },
        { name: "List Boards", available: true },
        { name: "Get Lists", available: true },
        { name: "Get Board Details", available: true },
        { name: "Create List", available: true },
        { name: "Add Comment", available: true },
        { name: "List User Boards", available: true },
        { name: "Get Member", available: true },
        { name: "Search", available: true },
        { name: "Create Card", available: true },
        { name: "Get Board Cards", available: true },
        { name: "Get Card Actions", available: true },
        { name: "Get Card Checklists", available: true },
        { name: "Get Board Members", available: true },
        { name: "Get Board Labels", available: true },

        { name: "Archive Card", available: false },
        { name: "Set Due Date", available: true },
        { name: "Attach File to Card", available: false },
        { name: "Reorder Lists", available: false },
        { name: "Archive List", available: false },
        { name: "Automation Rules", available: false },
        { name: "Create Board", available: false },
        { name: "Duplicate Board", available: false },
      ];

    case PLATFORMS.TODOIST:
      return [
        { name: "Get Tasks", available: true },
        { name: "Get Task", available: true },
        { name: "Create Task", available: true },
        { name: "Update Task", available: true },
        { name: "Close Task", available: true },
        { name: "Reopen Task", available: false },

        { name: "Get Comments", available: true },
        { name: "Create Comment", available: true },
        { name: "Update Comment", available: true },

        { name: "Get Labels", available: true },
        { name: "Create Label", available: true },
        { name: "Update Label", available: true },

        { name: "Assign Task", available: true },
        { name: "Recurring Task", available: false },
        { name: "Share Project", available: false },
        { name: "Archive Project", available: false },
        { name: "Share Labels", available: false },
        { name: "Mention User", available: false },
        { name: "Attach File to Comment", available: false },
      ];

    default:
      return [];
  }
};
