import { Injectable } from '@angular/core'
import { Location } from '@angular/common'
import { BookmarkScopeEnum, BookmarksInternal, Configuration, CreateBookmark, UpdateBookmark } from '../generated'
import { PortalMessageService } from '@onecx/angular-integration-interface'
import { catchError, map, mergeMap, Observable, of, retry, tap } from 'rxjs'
import { environment } from 'src/environments/environment'
import { MfeInfo, PageInfo, Workspace } from '@onecx/integration-interface'

@Injectable({ providedIn: 'any' })
export class BookmarkAPIUtilsService {
  constructor(
    private bookmarkService: BookmarksInternal,
    private messageService: PortalMessageService
  ) {}

  overwriteBaseURL(baseUrl: string) {
    this.bookmarkService.configuration = new Configuration({
      basePath: Location.joinWithSlash(baseUrl, environment.apiPrefix)
    })
  }

  loadBookmarks(obs: Observable<[Workspace, MfeInfo, PageInfo | undefined]>, onError?: () => void) {
    return obs.pipe(
      mergeMap(([currentWorkspace, currentMfe]) => {
        return this.bookmarkService.searchBookmarksByCriteria({
          workspaceName: currentWorkspace.workspaceName,
          productName: currentMfe.productName,
          appId: currentMfe.appId,
          scope: BookmarkScopeEnum.Private
        })
      }),
      map((res) => res.stream ?? []),
      retry({ delay: 500, count: 3 }),
      catchError((err) => {
        console.error('Unable to load bookmarks for current application or user.', err)
        if (onError) {
          onError()
        }
        return of(undefined)
      })
    )
  }

  createNewBookmark(createBookmark: CreateBookmark) {
    return this.bookmarkService.createNewBookmark(createBookmark).pipe(
      tap(() => {
        this.messageService.success({
          summaryKey: 'BOOKMARKS_CREATE_UPDATE.CREATE.SUCCESS'
        })
      }),
      catchError(() => {
        this.messageService.error({
          summaryKey: 'BOOKMARKS_CREATE_UPDATE.CREATE.ERROR'
        })
        return of(undefined)
      })
    )
  }

  deleteBookmarkById(bookmarkId: string) {
    return this.bookmarkService.deleteBookmarkById(bookmarkId).pipe(
      tap(() => {
        this.messageService.success({
          summaryKey: 'BOOKMARKS_DELETE.SUCCESS'
        })
      }),
      catchError(() => {
        this.messageService.error({
          summaryKey: 'BOOKMARKS_DELETE.ERROR'
        })
        return of(undefined)
      })
    )
  }

  editBookmark(bookmarkId: string, updatedBookmark: UpdateBookmark) {
    return this.bookmarkService.updateBookmark(bookmarkId, updatedBookmark).pipe(
      tap(() => {
        this.messageService.success({
          summaryKey: 'BOOKMARKS_CREATE_UPDATE.UPDATE.SUCCESS'
        })
      }),
      catchError(() => {
        this.messageService.error({
          summaryKey: 'BOOKMARKS_CREATE_UPDATE.UPDATE.ERROR'
        })
        return of(undefined)
      })
    )
  }
}
