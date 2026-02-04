import { api } from "./api";
type FetchPlatformConfigArgs = {
  platformId: string | undefined;
  accessToken: string;
  workspaceGid?: string;
};

export const fetchPlatformConfigurations = async ({
  platformId,
  accessToken,
  workspaceGid,
}: FetchPlatformConfigArgs) => {
  return api.requestRaw("/platforms/configurations", {
    method: "POST",
    body: {
      platformId,
      accessToken,
      workspaceGid,
    },
  });
};
