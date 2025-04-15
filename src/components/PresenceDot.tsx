import usePresenceStore from "@/hooks/usePresenceStore";
import { Member } from "@prisma/client";
import React, { useMemo } from "react";
import { GoDot, GoDotFill } from "react-icons/go";

type Props = {
  member: Member;
};

export default function PresenceDot({ member }: Props) {
  // Only select the exact data you need - no destructuring
  const membersId = usePresenceStore((state) => state.membersId);

  // Use useMemo to prevent recalculations on every render
  const isOnline = useMemo(() => {
    return membersId.includes(member.userId);
  }, [membersId, member.userId]);

  // Return null early if not online
  if (!isOnline) return null;

  return (
    <>
      <GoDot
        size={36}
        className="fill-white absolute -top-[2px] -right-[2px]"
      />
      <GoDotFill size={32} className="fill-green-500 animate-pulse" />
    </>
  );
}
