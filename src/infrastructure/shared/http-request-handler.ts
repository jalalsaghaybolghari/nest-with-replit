import { EMPTY, Observable, catchError, first, map, of } from 'rxjs';

import { HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { UrlHelper } from './constants/url-helper';
import { AxiosResponse } from 'axios';
import { REQUEST } from '@nestjs/core';
import { ExternalApiError } from 'src/domain/errors/external-api.error';

@Injectable({ scope: Scope.REQUEST })
export class HttpRequestHandler {
  constructor(protected http: HttpService,@Inject(REQUEST) private readonly request: any) {}

  get<T>(
    baseUrl: string,
    urlTemplate: string,
    urlParams: object = new Object(),
    urlQueryStrings: Object = new Object(),
    hasAuth: boolean = true,
    contentType: string | null = 'application/json',
    responseType: string | null = 'json',
  ): Observable<T> {
    return this.http.get<T>(UrlHelper.getUrlAddress(baseUrl, urlTemplate, urlParams, urlQueryStrings), this.getRequestOptions(hasAuth, contentType, null, responseType)).pipe(
      map((response: AxiosResponse<T>) => response.data),
      catchError((error) => {
        this.handleError(error.response || error);
        return EMPTY;
      }),
    );
  }

  post<T>(
    baseUrl: string,
    urlTemplate: string,
    urlParams: object | undefined = new Object(),
    urlQueryStrings: Object | undefined = new Object(),
    body: object | undefined = undefined,
    hasAuth: boolean = true,
    contentType: string | null = 'application/json',
    responseType: string | null = 'json',
  ): Observable<T> {
    const res = this.http
      .post<T>(UrlHelper.getUrlAddress(baseUrl, urlTemplate, urlParams, urlQueryStrings), body, this.getRequestOptions(hasAuth, contentType, undefined, responseType))
      .pipe(
        map((response: AxiosResponse<T>) => response.data),
        catchError((error) => {
          this.handleError(error.response || error);
          return EMPTY;
        }),
      );

    return res;
  }

  put<T>(
    baseUrl: string,
    urlTemplate: string,
    urlParams: object | undefined = new Object(),
    urlQueryStrings: Object | undefined = new Object(),
    body: any | null = null,
    hasAuth: boolean = true,
    contentType: string | null = 'application/json',
    responseType: string | null = 'json',
  ): Observable<T> {
    return this.http.put<T>(UrlHelper.getUrlAddress(baseUrl, urlTemplate, urlParams, urlQueryStrings), body, this.getRequestOptions(hasAuth, contentType, null, responseType)).pipe(
      map((response: AxiosResponse<T>) => response.data),
      catchError((error) => {
        this.handleError(error.response || error);
        return EMPTY;
      }),
    );
  }

  patch<T>(
    baseUrl: string,
    urlTemplate: string,
    urlParams: object | undefined = new Object(),
    urlQueryStrings: Object | undefined = new Object(),
    body: any | null = null,
    hasAuth: boolean = true,
    contentType: string | null = 'application/json',
    responseType: string | null = 'json',
  ): Observable<T> {
    return this.http
      .patch<T>(UrlHelper.getUrlAddress(baseUrl, urlTemplate, urlParams, urlQueryStrings), body, this.getRequestOptions(hasAuth, contentType, null, responseType))
      .pipe(
        map((response: AxiosResponse<T>) => response.data),
        catchError((error) => {
          this.handleError(error.response || error);
          return EMPTY;
        }),
      );
  }

  delete<T>(
    baseUrl: string,
    urlTemplate: string,
    urlParams: object | undefined = new Object(),
    urlQueryStrings: Object | undefined = new Object(),
    body: any | null = null,
    hasAuth: boolean = true,
    contentType: string | null = 'application/json',
    responseType: string | null = 'json',
  ): Observable<T> {
    return this.http.delete<T>(UrlHelper.getUrlAddress(baseUrl, urlTemplate, urlParams, urlQueryStrings), this.getRequestOptions(hasAuth, contentType, body, responseType)).pipe(
      map((response: AxiosResponse<T>) => response.data),
      catchError((error) => {
        this.handleError(error.response || error);
        return EMPTY;
      }),
    );
  }

  private getRequestOptions(
    auth: boolean,
    contentType: string | null = 'application/json',
    body: any | null = null,
    responseType: string | null = 'json',
    isFormData: boolean = false,
  ): { headers: Record<string, string>; withCredentials?: boolean; body?: any | null; responseType?: any; reportProgress?: boolean; observe?: any } {
    let headers: Record<string, string> = {};
    if (auth) {
      const accessToken = this.request?.session?.accessToken
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    if (contentType != null) {
      headers['Content-Type'] = contentType;
    }

    return {
      headers: headers,
      withCredentials: true,
      body: body || undefined,
      responseType: responseType,
    };
  }
  private handleError(error: any) {
    throw new ExternalApiError(`Api: ${error?.data?.error || error}` ,HttpStatus.BAD_GATEWAY)
    return of(0);
  }

}
