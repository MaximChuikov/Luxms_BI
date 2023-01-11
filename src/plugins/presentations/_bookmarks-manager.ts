import { AppConfig, IRawUser } from 'bi-internal/core';
import axios from 'axios';


function readErrorMessage(err: any): string {
  let errorMessage: string = 'Unknown error';
  try {
    if (err.isAxiosError) {
      const response = err.response;
      errorMessage = response.statusText;
      const {key, type, message} = response.data;
      // TODO: check DATASET_ACCESS_DENIED
      if (key === 'INVALID_SESSION') {
        errorMessage = 'Not authenticated';                                                         // TODO: lang
      } else {
        errorMessage = message;
      }
    }
  } catch (err) {
    // ???
  }

  return errorMessage;
}


async function httpGet<T>(url: string): Promise<T> {
  try {
    return (await axios.get(url)).data;
  } catch (err) {
    throw new Error(readErrorMessage(err));
  }
}


async function httpPost<T>(url: string, body: any): Promise<T> {
  try {
    return (await axios.post(url, body)).data;
  } catch (err) {
    throw new Error(readErrorMessage(err));
  }
}



export class BookmarksManager {
  public createBookmark(datasetId, rawBookmark): Promise<tables.IBookmark> {
    const url: string = AppConfig.fixRequestUrl(`/api/db/bm.bookmarks?dataset=${datasetId}`);
    return httpPost<tables.IBookmark>(url, rawBookmark);
  }

  // TODO: move to repositories
  public getBookmark(slideId: string): Promise<any> {
    const url: string = AppConfig.fixRequestUrl(`/api/db/bm.bookmarks/${slideId}`);
    return httpGet<any>(url)
      .then((result: any[]) => {
        if ('length' in result) {    // we got an array
          if (result.length === 0) {
            throw new Error('No bookmark');
          }
          return result[0];
        }
        return result;
      });
  }

  public getPossibleUsers(presentationId: number): Promise<IRawUser[]> {
    const url: string = AppConfig.fixRequestUrl(`/api/presentations/${presentationId}/possible_users`);
    return httpGet<IRawUser[]>(url);
  }
}


const __instance = new BookmarksManager();

export function getBookmarksManager(): BookmarksManager {
  return __instance;
}

export default getBookmarksManager;
