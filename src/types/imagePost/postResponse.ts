import { Receiver } from "./receiver";

export interface PostResponse {
    _id: string;
    senderId: string;
    receivers: Array<Receiver>;
    caption: string;
    urlImage: string;
    created_at: string;
}