// File: src/utils/dateUtils.ts

const padZero = (num: number) => num.toString().padStart(2, '0');

const parseServerDate = (value: string): Date => {
    const hasTimezone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value);
    const isDateTime = /^\d{4}-\d{2}-\d{2}T/.test(value);
    return new Date(isDateTime && !hasTimezone ? `${value}Z` : value);
};

export const formatTime = (isoString: string | null | undefined): string => {
    if (!isoString) return '';

    const date = parseServerDate(isoString);
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
        return `${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
    }

    if (isYesterday) {
        return "Hôm qua";
    }

    if (date.getFullYear() === now.getFullYear()) {
        return `${padZero(date.getDate())}/${padZero(date.getMonth() + 1)}`;
    }

    return `${padZero(date.getDate())}/${padZero(date.getMonth() + 1)}/${date.getFullYear()}`;
};
