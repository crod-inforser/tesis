import * as e from 'express';


export interface IReq<T = void> extends e.Request {
  body: T;
}

export interface IRes extends e.Response {
}

export interface IConvertReq {
    url: string;
    room: string;
}

export interface IConvertFromUrlParams {
    url: string;
    room: string;
}