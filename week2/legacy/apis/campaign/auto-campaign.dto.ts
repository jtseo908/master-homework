import { z } from "zod";
import { CreateAutoCampaignTagSchema } from "./auto-campaign-schemas";
import { InactiveAutoCampaignSchema } from "./auto-campaign-schemas";

export type InactiveAutoCampaignDto = z.infer<
  typeof InactiveAutoCampaignSchema
>;

export type CreateAutoCampaignTagDto = z.infer<
  typeof CreateAutoCampaignTagSchema
>;
