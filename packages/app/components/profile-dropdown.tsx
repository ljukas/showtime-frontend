import { useWindowDimensions } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemTitle,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "@showtime-xyz/universal.dropdown-menu";
import { useIsDarkMode } from "@showtime-xyz/universal.hooks";
import {
  MoreHorizontal,
  Copy,
  Flag,
  Slash,
} from "@showtime-xyz/universal.icon";
import { useRouter } from "@showtime-xyz/universal.router";

import { MenuItemIcon } from "app/components/dropdown/menu-item-icon";
import { useBlock } from "app/hooks/use-block";
import { useReport } from "app/hooks/use-report";
import { useShareProfile } from "app/hooks/use-share-profile";
import type { Profile } from "app/types";

type Props = {
  user: Profile;
};

function ProfileDropdown({ user }: Props) {
  const { report } = useReport();
  const { getIsBlocked, toggleBlock } = useBlock();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isBlocked = getIsBlocked(user.profile_id);
  const isDark = useIsDarkMode();
  const shareProfile = useShareProfile();

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
        <Button
          variant="tertiary"
          iconOnly={true}
          size={width < 768 ? "small" : "regular"}
        >
          <MoreHorizontal color={isDark ? "#FFF" : "#000"} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent loop>
        <DropdownMenuItem
          onSelect={() => {
            shareProfile(user);
          }}
          key="share"
        >
          <MenuItemIcon Icon={Copy} />
          <DropdownMenuItemTitle>Share</DropdownMenuItemTitle>
        </DropdownMenuItem>

        <DropdownMenuItem
          key="block"
          className="danger"
          onSelect={() => {
            toggleBlock({
              isBlocked,
              creatorId: user?.profile_id,
              name: user?.name,
            });
          }}
        >
          <MenuItemIcon Icon={Slash} />
          <DropdownMenuItemTitle>
            {isBlocked ? "Unblock User" : "Block User"}
          </DropdownMenuItemTitle>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={async () => {
            await report({ userId: user.profile_id });
            router.pop();
          }}
          key="report"
        >
          <MenuItemIcon Icon={Flag} />
          <DropdownMenuItemTitle>Report</DropdownMenuItemTitle>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}

export { ProfileDropdown };
