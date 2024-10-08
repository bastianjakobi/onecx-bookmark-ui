/**
 * onecx-bookmark-bff
 * Backend-For-Frontend (BFF) service for onecx bookmark. With this API you can manage bookmarks in your portal.
 *
 * Contact: tkit_dev@1000kit.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export interface CreateBookmark { 
    displayName: string;
    endpointName: string;
    endpointParameters?: { [key: string]: string; };
    query?: string;
    hash?: string;
    userId?: string;
    workspaceName: string;
    productName: string;
    appId?: string;
    scope: CreateBookmarkScopeEnum;
    position: number;
}
export enum CreateBookmarkScopeEnum {
    Private = 'PRIVATE',
    Public = 'PUBLIC'
};



