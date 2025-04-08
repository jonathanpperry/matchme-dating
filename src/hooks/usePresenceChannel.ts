import { useCallback, useEffect, useMemo, useRef } from "react";
import usePresenceStore from "./usePresenceStore";
import { Channel, Members } from "pusher-js";
import { pusherClient } from "@/lib/pusher";
import { shallow } from "zustand/shallow"; // Import shallow if available in your zustand version

export const usePresenceChannel = () => {
  // Get individual selectors
  const set = usePresenceStore((state) => state.set);
  const add = usePresenceStore((state) => state.add);
  const remove = usePresenceStore((state) => state.remove);

  // Memoize the object to prevent re-renders
  const storeActions = useMemo(() => ({
    set,
    add,
    remove
  }), [set, add, remove]);

  const channelRef = useRef<Channel | null>(null);

  const handleSetMembers = useCallback(
    (memberIds: string[]) => {
      set(memberIds);
    },
    [set]
  );

  const handleAddMember = useCallback(
    (memberId: string) => {
      add(memberId);
    },
    [add]
  );

  const handleRemoveMember = useCallback(
    (memberId: string) => {
      remove(memberId);
    },
    [remove]
  );

  useEffect(() => {
    if (!channelRef.current) {
      channelRef.current = pusherClient.subscribe("presence-match-me");

      channelRef.current.bind(
        "pusher:subscription_succeeded",
        (members: Members) => {
          handleSetMembers(Object.keys(members.members));
        }
      );

      channelRef.current.bind(
        "pusher:member_added",
        (member: Record<string, any>) => {
          handleAddMember(member.id);
        }
      );

      channelRef.current.bind(
        "pusher:member_removed",
        (member: Record<string, any>) => {
          handleRemoveMember(member.id);
        }
      );
    }

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current.unbind(
          "pusher:subscription_succeeded",
          handleSetMembers
        );
        channelRef.current.unbind("pusher:member_added", handleAddMember);
        channelRef.current.unbind("pusher:member_removed", handleRemoveMember);
      }
    };
  }, [handleAddMember, handleRemoveMember, handleSetMembers]);
};
