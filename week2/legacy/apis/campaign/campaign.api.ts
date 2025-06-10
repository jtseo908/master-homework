import axiosInstance from "../../../_instance";
import { CreateAutoCampaignTagSchema } from "./auto-campaign-schemas";
import {
  CreateAutoCampaignTagDto,
  InactiveAutoCampaignDto,
} from "./auto-campaign.dto";

export const campaignApi = {
  createCampaignTag: async (reqDto: CreateAutoCampaignTagDto) => {
    CreateAutoCampaignTagSchema.parse(reqDto);
    return await axiosInstance
      .post("/auto-campaign/campaign-tag", reqDto)
      .then((res) => res.data);
  },

  updateCampaignActiveStatus: async (
    activeStatus: "activate" | "inactive",
    reqDto: InactiveAutoCampaignDto
  ) => {
    return await axiosInstance
      .post(`/auto-campaign/${activeStatus}`, reqDto)
      .then((res) => res.data);
  },
};
