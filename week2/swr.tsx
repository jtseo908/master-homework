"use client";

import { PropsWithChildren } from "react";
import { SWRConfig } from "swr";
import axiosInstance from "./_instance";

const SwrProvider = ({ children }: PropsWithChildren) => {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          axiosInstance.get(url).then((res) => res.data),
      }}
    >
      {children}
    </SWRConfig>
  );
};
export default SwrProvider;
