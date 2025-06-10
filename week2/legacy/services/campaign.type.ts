export type UpdateCampaignStatusParamType = {
  id: string;
  name?: string;
  messageChannelType: "text_message" | "alimtalk" | "friendtalk";
  activeStatus: "active" | "inactive";
  redirectUrl?: string;
  onFinally?: (success?: boolean) => void;
};
