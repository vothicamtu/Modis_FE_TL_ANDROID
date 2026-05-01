# 📱 Hướng dẫn build Unsigned IPA với Codemagic

## 🎯 Mục đích
Build file IPA không ký (unsigned) để sau đó dùng **Sideloadly** hoặc công cụ khác re-sign và cài đặt lên iPhone.

## 📋 Trước khi bắt đầu

### 1. Cập nhật thông tin trong `codemagic.yaml`
Tìm và thay đổi những dòng có comment `← THAY TÊN THẬT`:

```yaml
# Workspace file (kiểm tra bằng: ls ios/*.xcworkspace)
XCODE_WORKSPACE: "ios/Modis.xcworkspace"  # ← THAY TÊN THẬT

# Scheme name (thường trùng tên app)
XCODE_SCHEME: "Modis"  # ← THAY TÊN THẬT

# Tên app cho file IPA output
APP_NAME: "Modis"  # ← THAY TÊN THẬT

# Email nhận thông báo
- your-email@example.com  # ← THAY EMAIL THẬT
```

### 2. Kiểm tra thông tin project
```bash
# Kiểm tra workspace name
ls ios/*.xcworkspace

# Kiểm tra scheme (mở Xcode → Product → Scheme)
# Hoặc check file: ios/YourApp.xcodeproj/xcshareddata/xcschemes/
```

## 🚀 Cách sử dụng

### Bước 1: Push code lên GitHub
```bash
git add .
git commit -m "Add unsigned IPA build configuration"
git push origin main
```

### Bước 2: Setup Codemagic
1. Đăng nhập [Codemagic](https://codemagic.io)
2. Connect GitHub repository
3. Chọn workflow: `ios-unsigned-build`
4. **KHÔNG** cần setup Apple Developer account (vì build unsigned)
5. Trigger build

### Bước 3: Download IPA
1. Chờ build hoàn thành (15-25 phút)
2. Download file `<TÊN_APP>_unsigned.ipa` từ artifacts
3. File này sẽ không có signature, sẵn sàng cho re-signing

## 🔧 Quy trình build

### Scripts thực hiện theo thứ tự:
1. **npm install** - Cài đặt dependencies
2. **pod install** - Cài đặt CocoaPods
3. **xcodebuild archive** - Build archive (unsigned)
4. **Manual IPA packaging** - Đóng gói thủ công:
   - Tạo thư mục `Payload/`
   - Copy `.app` vào `Payload/`
   - Zip thành `<TÊN_APP>_unsigned.ipa`

### Code signing settings:
```bash
CODE_SIGNING_REQUIRED=NO
CODE_SIGN_IDENTITY=""
CODE_SIGNING_ALLOWED=NO
```

## 📦 Output

### Artifacts được tạo:
- `<TÊN_APP>_unsigned.ipa` - File IPA chính (unsigned)
- `<TÊN_APP>.xcarchive` - Archive file
- Build logs - Để debug nếu có lỗi

### Cấu trúc IPA:
```
<TÊN_APP>_unsigned.ipa
└── Payload/
    └── <TÊN_APP>.app/
        ├── Info.plist
        ├── <TÊN_APP> (binary)
        └── ... (other app files)
```

## 🔄 Sử dụng với Sideloadly

### Bước 1: Download Sideloadly
- Tải từ: https://sideloadly.io/
- Hỗ trợ Windows, macOS, Linux

### Bước 2: Re-sign và install
1. Mở Sideloadly
2. Drag & drop file `<TÊN_APP>_unsigned.ipa`
3. Nhập Apple ID (free account OK)
4. Chọn device target
5. Click "Start Sideloading"

### Bước 3: Trust certificate trên iPhone
1. Settings → General → VPN & Device Management
2. Tìm profile với Apple ID của bạn
3. Tap "Trust"

## ⚠️ Lưu ý quan trọng

### Limitations của unsigned IPA:
- **Không thể cài trực tiếp** lên iPhone
- **Cần re-sign** bằng Apple ID (free hoặc paid)
- **7 ngày expiry** với free Apple ID
- **1 năm expiry** với paid Apple Developer account

### Troubleshooting:
- **Build fails**: Check logs trong Codemagic dashboard
- **Archive not found**: Verify workspace và scheme names
- **IPA corrupted**: Check xcodebuild archive step

## 🎯 Use cases

### Phù hợp cho:
- ✅ Internal testing không cần App Store
- ✅ Development builds cho team
- ✅ Bypass App Store review process
- ✅ Testing trên device thật
- ✅ Demo cho client

### Không phù hợp cho:
- ❌ Distribution qua App Store
- ❌ TestFlight distribution
- ❌ Enterprise distribution
- ❌ Production releases

## 📞 Support

### Nếu build fails:
1. Check build logs trong Codemagic
2. Verify workspace/scheme names
3. Check React Native compatibility
4. Ensure all dependencies iOS-compatible

### Nếu IPA không work:
1. Verify file không corrupted
2. Check Sideloadly logs
3. Ensure Apple ID valid
4. Trust certificate trên device