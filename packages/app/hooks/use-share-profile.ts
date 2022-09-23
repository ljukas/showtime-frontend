import { useCallback } from "react";

import { useShare } from "app/hooks/use-share";
import { useRudder } from "app/lib/rudderstack";
import type { Profile } from "app/types";

export const useShareProfile = () => {
  const share = useShare();
  const { rudder } = useRudder();

  const shareProfile = useCallback(
    async (user?: Profile) => {
      const result = await share({
        url: `https://showtime.xyz/${
          user?.username ??
          user?.wallet_addresses_excluding_email_v2?.[0]?.address
        }`,
      });

      if (result.action === "sharedAction") {
        rudder?.track(
          "User Shared",
          result.activityType ? { type: result.activityType } : undefined
        );
      }
    },
    [share, rudder]
  );

  return shareProfile;
};
