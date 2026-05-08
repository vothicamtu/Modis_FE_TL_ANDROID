This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

Nhớ đổi IP ở StompService.ts

# Cài đặt môi trường
- Cài Node.js
  
- Kiểm tra

```sh
node -v
npm -v
```
- Cài Yarn: (Không cần cài vì có npm rồi)
```sh
npm install --global yarn
```

- Cài Java Development Kit (JDK): Cần JDK 11 hoặc JDK 17
  
- Cài Android Studio -> mở SDK Manager và cài:
  + Android SDK Platform (Ví dụ: Android 13/ API 33).
  + Android SDK Build-Tools.
  + Android Emulator (nếu chạy giả lập)
    
- Thêm biến người dùng (User variables):
  + ANDROID_HOME = C:\Users\<YourUser>\AppData\Local\Android\Sdk
    
  + Thêm vào Path:
    ```sh
    %ANDROID_HOME%\platform-tools
    %ANDROID_HOME%\emulator
    %ANDROID_HOME%\cmdline-tools\latest\bin
    ```
# Chạy app
- Chạy trên Android
  1. Mở Android Studio -> Device Manager -> Tạo AVD (Android Virtual Divice).
  2. Khởi động emulator.
  3. Mở Command Prompt (không dùng Windows Powershell vì có thể lỗi không chạy được npx)
     ```sh
     npm install #Cày các thư viện cần thiết
     cd MyApp
     npx react-native run-android
     ```
  
# Một số lỗi có thể gặp
**1. Đã bật Android Emulator nhưng khi chạy "npx react-native run-android" thì React native không nhận máy ảo.**
+ Kiểm tra adb có nhận thiết bị/emulator chưa.
    Mở **cmd** (không phải PowerShell) và chạy:
    ```sh
    adb devices
    ```
+ Nếu OK, bạn sẽ thấy danh sách như :*
    ```sh
    List of devices attached
    emulator-5554   device
    ```
*Nếu bạn thấy "unauthorized" hoặc không hiện gì -> nghĩa là React Native không thể kết nối emulator.*
    
**Nguyên nhân thường gặp và cách xử lý**
*. Trường hợp 1: adb không chạy*
    Chạy:
    ```sh
    adb start-server
    adb devices
    ```
+ Nếu thấy emulator xuất hiện -> xong
*. Trường hợp 2: Sai biến môi trường PATH*
+Đảm bảo bạn đã thêm vào PATH:
  ```sh
  C:\Users\<User>\AppData\Local\Android\Sdk\platform-tools
  ```
  *...*
       
**2. Build được trên web nhưng build fail trên emulator (máy ảo).**
+*Lưu ý: gỡ hết App cũ từng cài để tránh cài đè lên dẫn đến bị lỗi.*
+Lỗi có thể do chưa set đúng biến môi trường (System variables):
  + JAVA_HOME -> trỏ tới thư mục cài JDK, ví dụ:
    ```sh
       C:\Program File\Java\jdk-17
     ```
  + Trong Path thêm:
     ```sh
     %JAVA_HOME%\bin
     ```
**Lưu ý: **
- React Native Android chỉ hỗ trợ ổn định JDK 11 hoặc JDK 17.
- Các bản mới hơn (18, 19, 20, 21,...) thường chưa được Gradle + Android Gradle Plugin hỗ trợ -> build fail với lỗi khó hiểu.
- Nếu đang cài JDK 19 thì có thể cài thêm JDK 17 (không cần phải xóa JDK 19) và set lại biến môi trường thành JDK 17.

