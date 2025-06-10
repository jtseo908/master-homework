import { mutate } from "swr";
import { campaignApi } from "../apis/campaign/campaign.api";
import { UpdateCampaignStatusParamType } from "./campaign.type";
import { AxiosError } from "axios";

// 자동화 캠페인 활성화/비활성화 상태 변경
export const updateCampaignActiveStatus = async (
  campaignInfo: UpdateCampaignStatusParamType
) => {
  const { id, activeStatus, onFinally } = campaignInfo;
  const reqDto = { autoCampaignId: id };
  const newStatus = activeStatus === "active" ? "inactive" : "activate";
  const toastMessage =
    activeStatus === "active"
      ? "캠페인을 비활성화했습니다. "
      : "캠페인을 활성화했습니다.";
  let success = false;

  try {
    await campaignApi.updateCampaignActiveStatus(newStatus, reqDto);
    success = true;
    await mutate("/auto-campaign/all");
    // ToastCustom(toastMessage);
  } catch (err) {
    let errMessage =
      "이용에 불편을 드려 죄송합니다.\n잠시 후, 다시 시도해주세요.";
    if (err instanceof AxiosError) {
      const { error, message } = err.response?.data;
      // errMessage = ERROR_MESSAGES[error] || message;
    }
    alert(errMessage);
  } finally {
    onFinally?.(success);
  }
};
