import { useState, useEffect, useCallback, useRef } from 'react';
import postController from '../controller/post.controller';
import { ImageFullItem, ImageItem, PostUIItem } from '../types';

type FilterType = "ALL" | "MINE" | "FROM_SENDER";
type ViewMode = 'GRID' | 'LIST';

export const usePostList = <T extends PostUIItem>(viewMode: ViewMode, pageSize: number = 20) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // Filter State
    const [filterType, setFilterType] = useState<FilterType>("ALL");
    const [targetSenderId, setTargetSenderId] = useState<string | undefined>(undefined);

    // Hàm core để gọi API
    const loadData = async (
        pageNumber: number,
        type: FilterType,
        senderId: string | undefined,
        isRefresh: boolean
    ) => {
        // Chặn gọi nếu đang load (trừ khi refresh)
        if (loading && !isRefresh) return;

        setLoading(true);

        const response = await postController.filterPostsGrid(
            type,
            viewMode,
            senderId,
            pageNumber
        );

        console.log("Danh sach duoc lay ra theo grid la", response )

        if (response.success) {
            const newData = response.data as T[];

            setData(prevImages => {
                const sourceList = isRefresh ? newData : [...prevImages, ...newData];

                // Logic lọc trùng ID
                const uniqueMap = new Map();
                sourceList.forEach(item => {
                    if (item._id) {
                        uniqueMap.set(item._id, item);
                    }
                });

                return Array.from(uniqueMap.values());
            });

            setHasMore(response.hasMore);
        }

        setLoading(false);
        setRefreshing(false);
    };

    // Effect: Gọi lại khi Filter thay đổi
    useEffect(() => {
        const init = () => {
            setPage(0);
            setHasMore(true);
            setData([]); // Reset data để tránh hiện ảnh cũ
            loadData(0, filterType, targetSenderId, true);
        };
        init();
    }, [filterType, targetSenderId]);

    // Các hàm handler cho UI
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setPage(0);
        setHasMore(true);
        loadData(0, filterType, targetSenderId, true);
    }, [filterType, targetSenderId]);

    const onLoadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadData(nextPage, filterType, targetSenderId, false);
        }
    };

    const handleFilterChange = (friendId: string | undefined) => {
        if (!friendId || friendId === 'ALL') {
            setFilterType("ALL");
            setTargetSenderId(undefined);
        } else if (friendId === 'MINE') {
            setFilterType("MINE");
            setTargetSenderId(undefined);
        } else {
            setFilterType("FROM_SENDER");
            setTargetSenderId(friendId);
        }
    };

    // Hàm hỗ trợ update 1 item trong list (dùng cho thả tim/reaction mà không cần load lại API)
    const updateItem = (updatedItem: T) => {
        setData(prev => prev.map(item => item._id === updatedItem._id ? updatedItem : item));
    };

    return {
        data,           // Danh sách bài viết/ảnh
        loading,        // Trạng thái loading
        refreshing,     // Trạng thái pull-to-refresh
        hasMore,        // Còn trang tiếp theo không
        onRefresh,      // Hàm gọi khi kéo xuống refresh
        onLoadMore,     // Hàm gọi khi kéo xuống đáy
        handleFilterChange, // Hàm gọi khi chọn filter ở TopBar
        updateItem,     // Hàm cập nhật cục bộ (cho React Screen)
        filterType,     // (Option) Nếu cần hiển thị UI
        targetSenderId  // (Option)
    };
};