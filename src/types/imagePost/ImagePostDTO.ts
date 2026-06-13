import { Receiver } from "./receiver";

export interface PostDTO {
    _id: string;
    senderId: string;
    receivers: Array<Receiver>;
    caption: string;
    urlImage: string;
    created_at: string;
}

export interface ImagePostDTO {
  id: string;
  urlImage: string;
  created_at?: string;
}

export interface ReceiverRequest {
  receiverId: string;
  icon?: string | null;
  timestamp?: string | null;
}

export interface PostRequest {
  senderId: string | null;
  receivers: ReceiverRequest[];
  caption: string;
  urlImage: string;
}

export interface ReactRequest{
  postId: string | null;
  senderId: string | null;
  reaction: string;
}
