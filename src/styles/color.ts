export default {
    // Base
    gray: "#33363B",
    light_gray: "#939393ff",
    white: "#ffffff",
    organce: "#ffc107ff",
    black: "#000000",
    black_blur: "#00000064",
    red: '#ff0000ff',
    cyan: '#88F4EF',

    // Neutral
    neutral_dark1: '#141f2d',
    neutral_dark2: '#203148',
    neutral_dark3: '#3e506b',
    neutral_light1: '#9fa5aeff',
    neutral_light2: '#F0FAF3',
    accent_blue: '#4BB4DE',

    // Brand palette
    brand_pink:     '#FE9EC7',
    brand_yellow:   '#F9F6C4',
    brand_sky:      '#89D4FF',
    brand_blue:     '#44ACFF',
    primary:        '#FE9EC7',
    primary_light:  '#F9F6C4',
    secondary:      '#89D4FF',
    secondary_dark: '#44ACFF',

    // Light theme pastel
    text_primary:   '#1a1a2e',
    text_secondary: '#4a4a6a',
    text_hint:      '#7a7a9a',
    surface:        'rgba(255,255,255,0.72)',
    surface_strong: 'rgba(255,255,255,0.90)',
    accent:         '#7C6FAB',

    // Gradient arrays for react-native-linear-gradient
    bg_gradient_main:  ['#ede8ff', '#e8f4ff', '#e8fff8'] as string[],  // lavender→sky→mint — màu chuẩn toàn app
    bg_gradient_soft:  ['#f5f0ff', '#eff7ff', '#f0fff9'] as string[],
    bg_gradient_page:  ['#ede8ff', '#e4f0ff'] as string[],
    bg_solid:          '#e8f4ff',   // midpoint của gradient chính

    // ─────────────────────────────────────────────
    // DARK THEME — navy tối, brand giữ nguyên
    // Dùng khi implement dark mode, KHÔNG dùng ở light theme
    // ─────────────────────────────────────────────

    // Nền trang (thay gradient tím-trắng)
    dark_bg_primary:        '#08101c',   // nền sâu nhất — toàn app
    dark_bg_secondary:      '#0d1520',   // nền card, modal, sheet
    dark_bg_elevated:       '#111e2e',   // nền item nổi lên (list item, input)
    dark_bg_gradient:       ['#08101c', '#0d1520', '#0a1a28'] as string[], // thay bg_gradient_main

    // Brand — tăng sáng 1 nấc để đủ contrast trên nền tối
    dark_primary:           '#FF9EC5',   // hồng sáng hơn #FE9EC7 một chút
    dark_secondary:         '#7DD8FF',   // xanh sáng hơn #89D4FF một chút

    // Nút chính (solid hồng) — chữ bên trong dùng màu tối thay vì trắng
    dark_btn_primary_text:  '#0d1520',   // chữ trên nút hồng solid

    // Nút phụ (X, flash, sparkle) — ghost button thay solid
    dark_btn_ghost_bg:      'rgba(137,212,255,0.15)',  // nền trong suốt xanh nhạt
    dark_btn_ghost_border:  '#7DD8FF',                 // viền xanh

    // Surface / card
    dark_surface:           'rgba(13,21,32,0.80)',     // card mờ
    dark_surface_strong:    'rgba(17,30,46,0.95)',     // card đặc hơn (modal, sheet)

    // Text
    dark_text_primary:      '#e8f0f8',   // trắng xanh nhạt — dễ đọc trên navy
    dark_text_secondary:    '#8aa8c8',   // xanh xám — phụ
    dark_text_hint:         '#5c7391',   // hint, placeholder — thay #888 / #999 hardcode

    // Border / divider
    dark_border:            '#1e3048',   // viền nhẹ giữa các item
    dark_border_accent:     'rgba(255,158,197,0.25)',  // viền hồng mờ (modal, card accent)

    // Hardcode cần thay (ghi chú để tìm & đổi)
    // '#999' / '#888'  → dùng dark_text_hint    = '#5c7391'
    // '#89D4FF' solid  → dùng dark_btn_ghost_bg = 'rgba(137,212,255,0.15)'
    // 'rgba(0,0,0,0.45)' caption overlay → '#0d1520' opacity 0.7
    // 'rgba(26,26,46,0.45)' modal overlay → 'rgba(4,8,16,0.75)'
    // 'rgba(26,26,46,0.08)' nút Hủy      → 'rgba(137,212,255,0.10)'
    // 'rgba(26,26,46,0.10)' emoji bg      → 'rgba(137,212,255,0.12)'
    // 'rgba(30,30,30,0.65)' nút ... overlay → 'rgba(8,16,28,0.80)'
    // '#203148' panel caption Send_photo  → dark_bg_secondary = '#0d1520'
    // 'rgba(255,255,255,0.7)' loading overlay → 'rgba(8,16,28,0.70)'
    // 'white' / '#ffffff' nút back        → dark_bg_elevated  = '#111e2e'
    // shadowColor '#000' nút back         → dark_primary      = '#FF9EC5'
}