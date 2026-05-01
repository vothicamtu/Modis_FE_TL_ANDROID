import React, { useEffect, useState } from "react";
import { Text } from "react-native";

import styles from "../../styles/FriendsScreen.styles";
import friendsController from "../../controller/friends.controller";
import { Friend } from "../../types/friend/Friend";
import { on } from "../../utils/eventBus";
import { useColors } from "../../hook/useColors";

export default function FriendsHeader() {
  const C = useColors();
  // State lưu số lượng bạn bè
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    loadFriendCount(); // gọi API ngay khi render lần đầu

    // Lắng nghe sự kiện friendsUpdated reload lại số lượng bạn bè
    const off = on("friendsUpdated", loadFriendCount);

    // Cleanup khi component bị unmount
    return off;
  }, []);

  const loadFriendCount = async () => {
    try {
      const friends: Friend[] = await friendsController.getFriends();
      setCount(friends.length);
    } catch (error) {
      console.log("Lỗi load friend count:", error);
      setCount(0);
    }
  };

  return (
    <>
      <Text style={[styles.title, { color: C.textPrimary }]}>Bạn bè của bạn</Text>
      <Text style={[styles.subTitle, { color: C.textSecondary }]}>{count} người bạn</Text>
    </>
  );
}
