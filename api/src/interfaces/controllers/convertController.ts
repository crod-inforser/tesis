import * as e from 'express';


export interface IReq<T = void> extends e.Request {
  body: T;
}

export type IRes = e.Response

export interface IConvertReq {
    url: string;
    room: string;
}

export interface IUploadReq {
  room: string;
}

export interface IRoomReq {
  room: string;
}

export interface IConvertFromUrlParams {
    url: string;
    room: string;
}