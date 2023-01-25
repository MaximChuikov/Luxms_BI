export type Column = { idx: number; name: number; title: number };
type DataResponse = {
  columns: Column[];
  rows: string[][];
  config: any;
  execTime: number;
};

export const getData = async (
  lookupId: number,
  data: any = {}
): Promise<DataResponse> => {
  const HEADERS_FOR_FETCH = {
    accept: "application/json, text/javascript, */*; q=0.01",
    "accept-language": "en-US,en;q=0.9,ru;q=0.8",
    "cache-control": "no-cache",
    "content-type": "application/json",
    pragma: "no-cache",
    "x-requested-with": "XMLHttpRequest",
  };

  const body = {
    lookupId: lookupId,
    ...data,
  };

  try {
    const response = await fetch(`../../../api/lookup/ds_127/${lookupId}`, {
      credentials: "include",
      headers: HEADERS_FOR_FETCH,
      body: JSON.stringify(body),
      method: "POST",
      mode: "cors",
    });
    return await response.json();
  } catch (error) {
    console.log(`fetch data ${lookupId} is not load`);
  }
};
