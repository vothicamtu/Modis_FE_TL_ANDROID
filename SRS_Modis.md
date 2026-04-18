# Software Requirements Specification (SRS)
## Ứng dụng Modis — Mạng xã hội chia sẻ ảnh

**Phiên bản:** 1.0  
**Ngày:** 02/04/2026  
**Nền tảng:** React Native (Android & iOS)

---

## 1. Giới thiệu

### 1.1 Mục đích
Tài liệu này mô tả các yêu cầu phần mềm cho ứng dụng di động **Modis** — một mạng xã hội chia sẻ ảnh theo thời gian thực, cho phép người dùng chụp và gửi ảnh tức thì đến bạn bè, nhắn tin, và tương tác qua emoji reaction.

### 1.2 Phạm vi
Ứng dụng Modis bao gồm các module chính:
- Xác thực người dùng (Authentication)
- Chụp & gửi ảnh (Camera & Post)
- Bảng tin ảnh (Feed)
- Nhắn tin thời gian thực (Messaging)
- Quản lý bạn bè (Friends)
- Hồ sơ cá nhân (Profile)
- Thống kê người dùng (User Stats)

### 1.3 Định nghĩa & Từ viết tắt
| Thuật ngữ | Ý nghĩa |
|-----------|---------|
| SRS | Software Requirements Specification |
| JWT | JSON Web Token — token xác thực |
| STOMP | Simple Text Oriented Messaging Protocol |
| SockJS | Thư viện WebSocket fallback |
| Post | Bài đăng ảnh |
| Reaction | Biểu cảm emoji phản hồi bài đăng |
| Conversation | Cuộc hội thoại giữa 2 người dùng |

---

## 2. Mô tả tổng quan hệ thống

### 2.1 Kiến trúc tổng thể
```
[React Native App]
       |
       ├── REST API (Axios) ──────► [Backend Server]
       │                                   |
       └── WebSocket (STOMP/SockJS) ───────┘
```

- Frontend: React Native 0.81.4 + TypeScript
- Giao tiếp REST: Axios với JWT Bearer token
- Giao tiếp realtime: STOMP over SockJS
- Lưu trữ local: AsyncStorage (token, user info)
- Upload ảnh: Cloudinary (qua backend)

### 2.2 Điều hướng ứng dụng
Ứng dụng sử dụng màn hình chính dạng **lưới 3×2** điều hướng bằng vuốt tay:

```
[Profile]  [Camera/Take]  [Messages]
           [Post Feed  ]  [Messages]
```

- Vuốt ngang: chuyển giữa Profile ↔ Camera ↔ Messages
- Vuốt dọc (từ Camera): chuyển xuống Post Feed (React/Emoji)

---

## 3. Yêu cầu chức năng

### 3.1 Module Xác thực (Authentication)

#### 3.1.1 Đăng nhập
- **FR-AUTH-01:** Người dùng nhập `username` và `password` để đăng nhập.
- **FR-AUTH-02:** Hệ thống gọi `POST /auth/login`, nhận JWT token và lưu vào AsyncStorage.
- **FR-AUTH-03:** Nếu đăng nhập thành công, điều hướng đến `HomeScreen`.
- **FR-AUTH-04:** Nếu thất bại, hiển thị thông báo lỗi từ server hoặc mặc định "Tài khoản hoặc mật khẩu không chính xác".

#### 3.1.2 Đăng ký
- **FR-AUTH-05:** Người dùng nhập: `username`, `fullname`, `mail`, `password`, `confirmPassword`, `sdt`.
- **FR-AUTH-06:** Validate phía client:
  - Không được để trống bất kỳ trường nào.
  - `password` phải khớp `confirmPassword`.
  - `sdt` phải có độ dài từ 9 đến 11 ký tự.
- **FR-AUTH-07:** Hệ thống gọi `POST /auth/register`, nhận JWT và lưu vào AsyncStorage.
- **FR-AUTH-08:** Sau đăng ký thành công, điều hướng đến `HomeScreen`.

#### 3.1.3 Đăng xuất
- **FR-AUTH-09:** Người dùng nhấn "Đăng xuất" từ màn hình Profile.
- **FR-AUTH-10:** Hệ thống xóa token khỏi AsyncStorage, ngắt kết nối STOMP, điều hướng về `LoadingScreen`.

#### 3.1.4 Màn hình Loading
- **FR-AUTH-11:** Khi khởi động, `LoadingScreen` kiểm tra token trong AsyncStorage.
  - Nếu có token hợp lệ → điều hướng `HomeScreen`.
  - Nếu không → điều hướng `LoginScreen`.

---

### 3.2 Module Camera & Gửi ảnh (Take & Send Photo)

#### 3.2.1 Chụp ảnh
- **FR-CAM-01:** Màn hình `TakeScreen` hiển thị camera trực tiếp (live preview).
- **FR-CAM-02:** Hỗ trợ chuyển đổi giữa camera trước và sau.
- **FR-CAM-03:** Hỗ trợ bật/tắt đèn flash.
- **FR-CAM-04:** Nhấn nút chụp → lưu ảnh tạm thời và điều hướng đến `SendPhotoScreen` kèm `photoUri`.
- **FR-CAM-05:** Yêu cầu quyền truy cập camera khi lần đầu sử dụng.

#### 3.2.2 Gửi ảnh
- **FR-SEND-01:** `SendPhotoScreen` hiển thị preview ảnh vừa chụp.
- **FR-SEND-02:** Người dùng chọn danh sách người nhận (bạn bè).
- **FR-SEND-03:** Người dùng có thể thêm caption cho ảnh.
- **FR-SEND-04:** Hệ thống upload ảnh lên server qua `POST /api/posts/upload/image` (multipart/form-data).
- **FR-SEND-05:** Sau khi upload thành công, tạo post qua `POST /api/posts/create` với `senderId`, `receivers[]`, `caption`, `urlImage`.
- **FR-SEND-06:** Hiển thị trạng thái loading trong quá trình upload và gửi.

---

### 3.3 Module Bảng tin & Reaction (Post Feed)

#### 3.3.1 Xem bài đăng
- **FR-FEED-01:** Màn hình `React_emoji_comment` hiển thị danh sách ảnh từ bạn bè.
- **FR-FEED-02:** Hệ thống gọi `GET /api/posts/filter` với các tham số lọc (`userId`, `type`, `viewMode`, `page`, `size`).
- **FR-FEED-03:** Hỗ trợ phân trang (pagination) khi cuộn.
- **FR-FEED-04:** Mỗi bài đăng hiển thị: ảnh, caption, thời gian, tên người gửi, danh sách reaction.

#### 3.3.2 Reaction (Emoji)
- **FR-FEED-05:** Người dùng có thể react bài đăng bằng emoji.
- **FR-FEED-06:** Hệ thống gọi `PUT /api/posts/react` với `postId`, `senderId`, `reaction`.
- **FR-FEED-07:** Reaction được cập nhật realtime trên UI.

#### 3.3.3 Xóa bài đăng
- **FR-FEED-08:** Người dùng có thể xóa bài đăng của mình qua `DELETE /api/posts/delete/{postId}`.

#### 3.3.4 Xem tất cả ảnh
- **FR-FEED-09:** Màn hình `AllImagesScreen` hiển thị toàn bộ ảnh của người dùng dạng lưới (grid).

---

### 3.4 Module Nhắn tin (Messaging)

#### 3.4.1 Danh sách hội thoại
- **FR-MSG-01:** `MessageScreen` hiển thị danh sách các cuộc hội thoại gần nhất.
- **FR-MSG-02:** Hệ thống gọi `GET /api/messages` để lấy danh sách conversations.
- **FR-MSG-03:** Mỗi item hiển thị: avatar đối phương, tên, tin nhắn cuối, thời gian.

#### 3.4.2 Cuộc hội thoại
- **FR-MSG-04:** Nhấn vào conversation → mở `ConversationScreen` với `conversationId`, `receiverId`, `receiverName`, `receiverAvatar`.
- **FR-MSG-05:** Hệ thống gọi `GET /api/messages/{userId}` để tải lịch sử tin nhắn.
- **FR-MSG-06:** Tin nhắn mới được gửi qua STOMP WebSocket.
- **FR-MSG-07:** Tin nhắn đến được nhận realtime qua STOMP subscription.
- **FR-MSG-08:** Hỗ trợ gửi ảnh trong hội thoại.
- **FR-MSG-09:** Hiển thị trạng thái gửi tin nhắn (đang gửi / đã gửi).

#### 3.4.3 Kết nối WebSocket
- **FR-MSG-10:** Kết nối STOMP tự động khi người dùng đăng nhập thành công.
- **FR-MSG-11:** Token JWT được truyền qua query param khi kết nối: `ws?token=<JWT>`.
- **FR-MSG-12:** Tự động reconnect sau 5 giây nếu mất kết nối.
- **FR-MSG-13:** Subscription được xếp hàng đợi nếu chưa kết nối và xử lý sau khi kết nối thành công.
- **FR-MSG-14:** Ngắt kết nối và hủy tất cả subscriptions khi đăng xuất.

---

### 3.5 Module Bạn bè (Friends)

#### 3.5.1 Danh sách bạn bè
- **FR-FRIEND-01:** `FriendsScreen` hiển thị danh sách bạn bè hiện tại qua `GET /api/friends/list?userId=`.
- **FR-FRIEND-02:** Hiển thị avatar, tên, và tùy chọn tương tác cho mỗi bạn bè.

#### 3.5.2 Tìm kiếm người dùng
- **FR-FRIEND-03:** Người dùng có thể tìm kiếm người dùng khác theo tên/username.
- **FR-FRIEND-04:** Kết quả tìm kiếm hiển thị trong `SearchResultList`.

#### 3.5.3 Lời mời kết bạn
- **FR-FRIEND-05:** Gửi lời mời: `POST /api/friends/request?senderId=&receiverId=`.
- **FR-FRIEND-06:** Xem lời mời nhận được: `GET /api/friends/requests/received?userId=`.
- **FR-FRIEND-07:** Xem lời mời đã gửi: `GET /api/friends/requests/sent?userId=`.
- **FR-FRIEND-08:** Chấp nhận lời mời: `PUT /api/friends/request/{id}/accept`.
- **FR-FRIEND-09:** Từ chối lời mời: `PUT /api/friends/request/{id}/reject`.
- **FR-FRIEND-10:** Hủy lời mời / xóa bạn: `DELETE /api/friends/request/{id}`.

#### 3.5.4 Mời bạn bè dùng app
- **FR-FRIEND-11:** Người dùng có thể chia sẻ link mời qua các ứng dụng khác (Facebook, Instagram, Messenger...).

---

### 3.6 Module Hồ sơ cá nhân (Profile)

#### 3.6.1 Xem hồ sơ
- **FR-PROFILE-01:** Hiển thị thông tin: avatar, username, email, số điện thoại.
- **FR-PROFILE-02:** Tải thông tin từ server khi màn hình được mở.

#### 3.6.2 Chỉnh sửa thông tin
- **FR-PROFILE-03:** Người dùng có thể chỉnh sửa `username`, `sdt`, `mail` qua modal inline.
- **FR-PROFILE-04:** Thay đổi được lưu qua API profile update.

#### 3.6.3 Đổi ảnh đại diện
- **FR-PROFILE-05:** Người dùng chọn ảnh từ thư viện thiết bị.
- **FR-PROFILE-06:** Ảnh được upload lên server và URL mới được cập nhật vào profile.

#### 3.6.4 Đổi mật khẩu
- **FR-PROFILE-07:** Người dùng nhập mật khẩu cũ, mật khẩu mới, xác nhận mật khẩu mới.
- **FR-PROFILE-08:** Validate: không để trống, mật khẩu mới phải khớp xác nhận.
- **FR-PROFILE-09:** Gọi API đổi mật khẩu và hiển thị kết quả.

#### 3.6.5 Xóa tài khoản
- **FR-PROFILE-10:** Tùy chọn xóa tài khoản có trong "Vùng nguy hiểm" (chưa triển khai đầy đủ).

---

### 3.7 Module Thống kê (User Stats)

- **FR-STATS-01:** `UserStatsScreen` hiển thị các chỉ số hoạt động của người dùng.
- **FR-STATS-02:** Hiển thị: số bài đăng, số bạn bè, lượt reaction nhận được.
- **FR-STATS-03:** Biểu đồ thời gian online (`OnlineChart`).
- **FR-STATS-04:** Hỗ trợ làm mới dữ liệu (`RefreshAction`).

---

## 4. Yêu cầu phi chức năng

### 4.1 Hiệu năng
- **NFR-PERF-01:** Thời gian phản hồi API không vượt quá 3 giây trong điều kiện mạng bình thường.
- **NFR-PERF-02:** Tin nhắn realtime phải được hiển thị trong vòng 500ms sau khi gửi.
- **NFR-PERF-03:** Ảnh phải được hiển thị với lazy loading để tránh giật lag khi cuộn.

### 4.2 Bảo mật
- **NFR-SEC-01:** Tất cả API calls (trừ login/register) phải kèm JWT Bearer token trong header.
- **NFR-SEC-02:** Token được lưu trong AsyncStorage, không được lưu trong plain text có thể truy cập từ bên ngoài.
- **NFR-SEC-03:** Kết nối WebSocket phải xác thực bằng token qua query param.
- **NFR-SEC-04:** Mật khẩu không được hiển thị dưới dạng plain text trên UI.

### 4.3 Khả dụng (Availability)
- **NFR-AVAIL-01:** Ứng dụng phải hoạt động trên Android API 24+ và iOS 13+.
- **NFR-AVAIL-02:** WebSocket phải tự động reconnect khi mất kết nối.
- **NFR-AVAIL-03:** Ứng dụng phải xử lý gracefully khi không có kết nối mạng.

### 4.4 Khả năng bảo trì
- **NFR-MAINT-01:** Code được tổ chức theo kiến trúc phân lớp: `screens` → `controllers` → `services` → `api`.
- **NFR-MAINT-02:** Tất cả types/interfaces được định nghĩa trong thư mục `src/types`.
- **NFR-MAINT-03:** Styles được tách riêng vào thư mục `src/styles`.

### 4.5 Trải nghiệm người dùng
- **NFR-UX-01:** Điều hướng chính bằng vuốt tay (gesture-based navigation) mượt mà với animation 400ms.
- **NFR-UX-02:** Hiển thị loading indicator trong tất cả các thao tác bất đồng bộ.
- **NFR-UX-03:** Thông báo lỗi phải rõ ràng và thân thiện với người dùng.

---

## 5. Yêu cầu giao diện

### 5.1 Giao diện người dùng
- Thiết kế tối giản, tập trung vào ảnh.
- Hỗ trợ cả chế độ sáng (light mode).
- Sử dụng gradient màu pastel (`#ede8ff`, `#e8f4ff`, `#e8fff8`) cho màn hình Profile.
- Camera screen sử dụng nền tối với status bar trong suốt.

### 5.2 Giao diện API (REST)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/auth/login` | Đăng nhập |
| POST | `/auth/register` | Đăng ký |
| GET | `/api/messages` | Danh sách conversations |
| GET | `/api/messages/{userId}` | Lịch sử tin nhắn |
| GET | `/api/posts/filter` | Lọc bài đăng |
| POST | `/api/posts/create` | Tạo bài đăng |
| PUT | `/api/posts/react` | React bài đăng |
| DELETE | `/api/posts/delete/{postId}` | Xóa bài đăng |
| POST | `/api/posts/upload/image` | Upload ảnh |
| GET | `/api/friends/list` | Danh sách bạn bè |
| GET | `/api/friends/requests/received` | Lời mời nhận được |
| GET | `/api/friends/requests/sent` | Lời mời đã gửi |
| POST | `/api/friends/request` | Gửi lời mời kết bạn |
| PUT | `/api/friends/request/{id}/accept` | Chấp nhận lời mời |
| PUT | `/api/friends/request/{id}/reject` | Từ chối lời mời |
| DELETE | `/api/friends/request/{id}` | Hủy lời mời / xóa bạn |

### 5.3 Giao diện WebSocket (STOMP)
- Endpoint kết nối: `{baseURL}/ws?token={JWT}`
- Gửi tin nhắn: destination `/app/chat.send`
- Nhận tin nhắn: subscription `/user/queue/messages` hoặc tương đương

---

## 6. Ràng buộc hệ thống

- **CON-01:** Ứng dụng yêu cầu Node.js >= 20 để build.
- **CON-02:** Sử dụng React Native 0.81.4 với React 19.1.0.
- **CON-03:** Phụ thuộc vào backend server cung cấp REST API và WebSocket endpoint.
- **CON-04:** Upload ảnh phụ thuộc vào dịch vụ Cloudinary (qua backend).
- **CON-05:** Cần quyền camera và thư viện ảnh trên thiết bị.

---

## 7. Các tính năng chưa hoàn thiện / TODO

| ID | Tính năng | Trạng thái |
|----|-----------|------------|
| TODO-01 | Xóa tài khoản | UI có, chưa kết nối API |
| TODO-02 | Lịch sử ảnh (History) trong TakeScreen | UI placeholder, chưa triển khai |
| TODO-03 | Thông báo (Notification) | `notificationHandler.ts` có, chưa tích hợp UI |
| TODO-04 | Mock auth (`mockAuth.ts`) | Cần xóa trước khi production |
| TODO-05 | Hard-coded token trong comments | Cần dọn dẹp code |

---

*Tài liệu này được tạo dựa trên phân tích mã nguồn thực tế của dự án Modis.*
