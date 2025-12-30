export type Agent = {
  uuid: string;
  agentName: string;
  seoName?: string;
  isPublic: boolean;
  platform?: {
    name: string;
    type: string;
  } | null;
  phoneId?: {
    uuid?: string;
    phoneNumber?: string;
    countryCode?: string;
    accountId?: string;
  };
  accountId?: string;
};

export type AgentsApiResponse = {
  consumer: string;
  organizations: {
    organizationUuid: string;
    assistants: Agent[];
  }[];
};
