import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');
const scale = PixelRatio.get();

export const optimizeCloudinaryUrl = (url: string) => {
    if (!url || !url.includes('/upload/')) return "../../assets/image/account_icon.png";

    const w = Math.round(width * scale);
    const h = Math.round(height * scale);

    const transform = `w_${w},h_${h},c_fill,q_auto:eco,f_auto`;

    return url.replace('/upload/', `/upload/${transform}/`);
};
