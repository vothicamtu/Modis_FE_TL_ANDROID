export interface PostFilterRequest {
    userId: string | null;
    type: "ALL" | "MINE" | "FROM_SENDER";
    senderId?: string | null;
    viewMode: "GRID" | "LIST";
    page: number;
    size: number;
}