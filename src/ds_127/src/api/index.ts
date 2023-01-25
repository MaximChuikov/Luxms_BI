import { getData } from "../../../ds_res/utils";

const TABLE_DATA_LOOKUP_ID = 2;
const UNIQ_VALUES_BY_COLUMN_LOOKUP_ID = 3;

export const fetchTableData = async () => {
  const res = await getData(TABLE_DATA_LOOKUP_ID, {
    // limit: 100,
    // offset: 0,
    // WHERE user_ip='${user_ip}'
  });
  return res;
};

export const fetchColumnUniqFilters = async (
  columnName: string
): Promise<string[]> => {
  const res = await getData(UNIQ_VALUES_BY_COLUMN_LOOKUP_ID, { columnName });
  return res.rows.map((row) => row[0]).filter((item) => item);
};
