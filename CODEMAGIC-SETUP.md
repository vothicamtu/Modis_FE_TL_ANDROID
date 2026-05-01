# 🚀 Hướng dẫn setup Codemagic cho Modis iOS

## 📋 Chuẩn bị trước khi build

### 1. Cập nhật thông tin trong codemagic.yaml
```yaml
# Thay đổi những dòng này:
APP_STORE_APPLE_ID: 1234567890  # ➡️ Thay bằng Apple ID thật của bạn
your-email@example.com          # ➡️ Thay bằng email thật của bạn
```

### 2. Tạo App trên App Store Connect
1. Đăng nhập [App Store Connect](https://appstoreconnect.apple.com)
2. Tạo app mới với Bundle ID: `com.modis.app`
3. Lấy Apple ID number từ URL app (ví dụ: 1234567890)

## 🔧 Setup Codemagic

### Bước 1: Kết nối Repository
1. Đăng nhập [Codemagic](https://codemagic.io)
2. Chọn "Add application"
3. Kết nối GitHub repository của bạn
4. Chọn project Modis_FE_TL

### Bước 2: Cấu hình Apple Developer
1. Vào "Team settings" → "Integrations"
2. Thêm "App Store Connect API key":
   - Key ID
   - Issuer ID  
   - Private key (.p8 file)
3. Thêm "Apple Developer Portal":
   - Apple ID
   - App-specific password

### Bước 3: Cấu hình Build
1. Chọn workflow "ios-workflow"
2. Kiểm tra environment variables:
   - `BUNDLE_ID`: com.modis.app
   - `APP_STORE_APPLE_ID`: Apple ID number của bạn
3. Cấu hình code signing:
   - Distribution type: App Store
   - Bundle identifier: com.modis.app

### Bước 4: Trigger Build
1. Nhấn "Start new build"
2. Chọn branch (thường là main/master)
3. Chờ build hoàn thành (15-25 phút)

## 📊 Kết quả mong đợi

### ✅ Build thành công
- File IPA được tạo trong artifacts
- Tự động upload lên App Store Connect
- Email thông báo thành công

### ❌ Nếu build fail
1. Kiểm tra logs trong Codemagic dashboard
2. Thường gặp:
   - Code signing issues → Kiểm tra Apple Developer setup
   - CocoaPods issues → Đã được fix trong Podfile
   - Native module issues → Đã được fix

## 🎯 Checklist trước khi build

- [ ] Đã cập nhật APP_STORE_APPLE_ID trong codemagic.yaml
- [ ] Đã cập nhật email trong codemagic.yaml  
- [ ] Đã tạo app trên App Store Connect với Bundle ID: com.modis.app
- [ ] Đã setup Apple Developer account trong Codemagic
- [ ] Đã push code lên GitHub
- [ ] Đã chạy `npm run ios-check` để kiểm tra

## 🚀 Commands để push GitHub

```bash
cd Modis_FE_TL

# Kiểm tra build requirements
npm run ios-check

# Add và commit changes
git add .
git commit -m "feat: iOS build ready for Codemagic

✅ Optimized Podfile for cloud builds
✅ Added ExportOptions.plist for IPA export
✅ Enhanced codemagic.yaml with proper configuration
✅ Added comprehensive iOS permissions
✅ Disabled Flipper for stability
✅ Added build check scripts

Ready for Codemagic iOS build!"

# Push to GitHub
git push origin main
```

## 📱 Sau khi có IPA

### TestFlight
1. IPA tự động upload lên App Store Connect
2. Vào TestFlight tab
3. Submit for review
4. Invite testers

### App Store
1. Test kỹ trên TestFlight
2. Submit for App Store review
3. Release to production

## 🆘 Troubleshooting

### Build fails với "Code signing error"
- Kiểm tra Apple Developer account setup
- Verify Bundle ID matches App Store Connect
- Check provisioning profiles

### Build fails với "CocoaPods error"  
- Đã được fix trong Podfile
- Nếu vẫn lỗi, check logs chi tiết

### Build fails với "Native module error"
- Tất cả modules đã được test compatibility
- Check specific error trong logs

## 📞 Support
- Codemagic docs: https://docs.codemagic.io/
- React Native docs: https://reactnative.dev/
- Apple Developer: https://developer.apple.com/