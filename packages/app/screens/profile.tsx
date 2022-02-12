import { useEffect } from "react";

import { withColorScheme } from "app/components/memo-with-theme";
import { Profile } from "app/components/profile";
import { mixpanel } from "app/lib/mixpanel";
import { createParam } from "app/navigation/use-param";

import { SharedElementProvider } from "../components/shared-element";

type Query = {
  walletAddress: string;
};

const { useParam } = createParam<Query>();

const ProfileScreen = withColorScheme(() => {
  useEffect(() => {
    mixpanel.track("Profile view");
  }, []);

  const [walletAddress, setWalletAddress] = useParam("walletAddress");

  return (
    <>
      <SharedElementProvider>
        <Profile walletAddress={walletAddress as string} />
      </SharedElementProvider>
    </>
  );
});

export { ProfileScreen };
