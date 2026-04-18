// File: src/utils/dateUtils.ts

const padZero = (num: number) => num.toString().padStart(2, '0');

export const formatTime = (isoString: string | null | undefined): string => {
    if (!isoString) return '';

    const date = new Date(isoString);
    const now = new Date();

    if (isNaN(date.getTime())) return '';

    const isToday = date.getDate() === now.getDate() &&
                    date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear();

    // Logic kiểm tra hôm qua chính xác
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isYesterday = date.getDate() === yesterday.getDate() &&
                        date.getMonth() === yesterday.getMonth() &&
                        date.getFullYear() === yesterday.getFullYear();

    if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    if (isYesterday) {
        return "Hôm qua";
    }

    if (date.getFullYear() === now.getFullYear()) {
        return `${padZero(date.getDate())}/${padZero(date.getMonth() + 1)}`;
    }

    return `${padZero(date.getDate())}/${padZero(date.getMonth() + 1)}/${date.getFullYear()}`;
};