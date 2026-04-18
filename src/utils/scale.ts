import { Dimensions } from "react-native";

// Lấy object window từ Dimensions.get("window")
// rồi destructuring để lấy ra width (chiều rộng màn hình)
const { width } = Dimensions.get("window");

// Khai báo chiều rộng chuẩn (design reference)
// 375px là chiều rộng màn hình iPhone 11 — thường dùng làm mốc thiết kế UI
const BASE_WIDTH = 375; // iPhone 11

// Hàm scale dùng để scale kích thước theo tỉ lệ màn hình
// size: kích thước gốc theo bản thiết kế
// (width / BASE_WIDTH): tỉ lệ giữa màn hình thực tế và màn hình thiết kế
// * size: nhân để ra kích thước phù hợp với thiết bị hiện tại
export const scale = (size: number) => (width / BASE_WIDTH) * size;
