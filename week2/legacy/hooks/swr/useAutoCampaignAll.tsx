import useSWR from "swr";
import { AutoCampaignResDto } from "../../../refactoring/apis/campaign/auto-campaign.dto";

const useAutoCampaignAll = () => {
  const {
    data = [],
    isLoading,
    mutate,
  } = useSWR<AutoCampaignResDto[]>("/auto-campaign/all");

  return {
    autoCampaignList: data || [],
    isAutoCampaignLoading: isLoading,
    mutateAutoCampaign: mutate,
  };
};

export default useAutoCampaignAll;
