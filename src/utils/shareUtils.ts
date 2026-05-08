import Share from "react-native-share";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getShareText = async (): Promise<string> => {
  const username = await AsyncStorage.getItem("username");
  return `Tải app Modis tại đây:
https://drive.google.com/drive/folders/1LSJe9ARKBnv1dhGi45je4vaB0MpNQzdd?usp=sharing

Username của tôi: ${username || "modis_user"}

Cài xong mở app → tìm username này để kết bạn nha 💛`;
};

export const shareToApp = async (_preferredApp?: string) => {
  try {
    // Lấy nội dung chia sẻ
    const text = await getShareText();

    // Mở hộp thoại chia sẻ hệ thống
    await Share.open({
      message: text,           // Nội dung cần chia sẻ
      title: "Chia sẻ qua", // Tiêu đề hiển thị
    });
  } catch (err) {
    console.log("Share cancelled or failed:", err);
  }
};

export const shareToAllApps = async () => {
  try {
    // Lấy nội dung chia sẻ
    const text = await getShareText();

    // Mở share sheet mặc định
    await Share.open({ message: text });
  } catch (err) {
    // Bắt lỗi nếu user huỷ hoặc có lỗi xảy ra
    console.log("Share cancelled or failed:", err);
  }
};
