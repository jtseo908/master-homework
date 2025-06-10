import { z } from "zod";

export const CreateAutoCampaignTagSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "태그 이름은 최대 100자까지 입력 가능합니다."),
});

export const InactiveAutoCampaignSchema = z.object({
  autoCampaignId: z.string(),
});
