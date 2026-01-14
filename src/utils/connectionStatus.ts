export const getConnectionStatus = (
  consumer: any,
  platformName?: string,
  onDisconnect?: () => void
) => {
  if (!consumer) {
    return { label: "Not Connected", color: "red" };
  }

  if (consumer?.integrationIds) {
    return {
      label: "Connected",
      color: "green",
      onDisconnect,
    };
  }
  return { label: "Needs Setup", color: "orange" };
};

export const needSetup = (consumer: any, platformName?: string): boolean => {
  const p = platformName?.toLowerCase() || "";
  if (!consumer) return false;
  if (p.includes("asana")) {
    return !consumer?.integrationIds?.workspaceGid;
  }
  if (p.includes("trello")) {
    return !consumer?.integrationIds?.boardId;
  }
  if (p.includes("todoist")) {
    return !consumer?.integrationIds?.projectGid;
  }

  return false;
};
