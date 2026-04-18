import { Receiver } from "./receiver";

export interface PostDTO {
    _id: string;
    senderId: string;
    receivers: Array<Receiver>;
    caption: string;
    urlImage: string;
    created_at: string;
}

//Phía dưới đã tách ra các file riêng, xem và import lại

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


// export interface PostResponse {
//   id: string;
//   senderId: string;
//   receivers: ReceiverRequest[];
//   caption: string;
//   urlImage: string;
//   created_at: string;
// }

// export interface PostFilterRequest {
//   userId: string | null;
//   type: string;
//   senderId: string | null;
// export interface PostResponse {
//   _id: string;
//   senderId: string;
//   receivers: ReceiverRequest[];
//   caption: string;
//   urlImage: string;
//   created_at: string;
// }

// export interface PostFilterRequest {
//   userId: string;
//   type: string;
//   senderId: string;
//   viewMode: string;
//   page: number;
//   size: number;
// }

export interface ReactRequest{
  postId: string | null;
  senderId: string | null;
  reaction: string;
}

