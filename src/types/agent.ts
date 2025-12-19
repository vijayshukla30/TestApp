export type Agent = {
  uuid: string;
  agentName: string;
  seoName?: string;
  isPublic: boolean;
  platform?: {
    name: string;
    type: string; // asana | slack | etc
  } | null;
};

export type AgentsApiResponse = {
  consumer: string;
  organizations: {
    organizationUuid: string;
    assistants: Agent[];
  }[];
};
