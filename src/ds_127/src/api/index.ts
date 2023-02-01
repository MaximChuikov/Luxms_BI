import { DATE_DB_STUB } from "../../../ds_res/constants";
import { dateToDbFormat } from "../../../ds_res/utils/dateFormatting";
import { getData } from "../../../ds_res/utils/lookupFetch";
import { DatePickerVariants } from "../../App";
import {
  DS_ID,
  TABLE_DATA_LOOKUP_ID,
  UNIQ_VALUES_BY_COLUMN_LOOKUP_ID,
} from "../constants";

type FetchTableData = {
  selectedDateVariant?: DatePickerVariants;
  selectedDate?: Date | Date[] | null;
  selectedUserIpFilters?: string[];
  selectedSystemFilters?: string[];
  selectedLoginFilters?: string[];
  orderBy?: string;
  orderDirection?: string;
};

const filtersToDbFormat = (filters: string[]) => {
  if (Array.isArray(filters)) {
    return filters.join(";");
  } else {
    return "";
  }
};

export const fetchTableData = async ({
  selectedDateVariant,
  selectedDate,
  selectedUserIpFilters,
  selectedSystemFilters,
  selectedLoginFilters,
  orderBy,
  orderDirection,
}: FetchTableData) => {
  let dateFrom = DATE_DB_STUB;
  let dateTo = DATE_DB_STUB;

  const getTableData = async () => {
    const body = {
      user_ip: filtersToDbFormat(selectedUserIpFilters),
      product: filtersToDbFormat(selectedSystemFilters),
      user_ident: filtersToDbFormat(selectedLoginFilters),
      orderBy,
      orderDirection,
      from: dateFrom,
      to: dateTo,
    };

    return await getData(DS_ID, TABLE_DATA_LOOKUP_ID, body);
  };

  switch (selectedDateVariant) {
    case "monthPicker": {
      if (selectedDate) {
        // @ts-ignore
        const selectedYear = selectedDate.getFullYear();
        // @ts-ignore
        const selectedMonth = selectedDate.getMonth();

        const firstMonthDay = new Date(selectedYear, selectedMonth, 1);
        const lastMonthDay = new Date(selectedYear, selectedMonth + 1, 0);

        dateFrom = dateToDbFormat(firstMonthDay);
        dateTo = dateToDbFormat(lastMonthDay, { isEndDate: true });
      }

      return await getTableData();
    }

    case "rangeDatePicker": {
      if (selectedDate) {
        dateFrom = dateToDbFormat(new Date(selectedDate[0].getTime()));
        dateTo = dateToDbFormat(new Date(selectedDate[1].getTime()), {
          isEndDate: true,
        });
      }
      return await getTableData();
    }

    case "multipleDatePicker": {
      if (Array.isArray(selectedDate) && selectedDate.length > 0) {
        const arr = await Promise.all(
          selectedDate.map(async (date: Date) => {
            const unmutableDate = new Date(date.getTime());
            dateFrom = dateToDbFormat(unmutableDate);
            dateTo = dateToDbFormat(unmutableDate, { isEndDate: true });

            return await getTableData();
          })
        );
        const concatenatedRows = arr.reduce((acc, item) => {
          return [...acc, ...item.rows];
        }, [] as string[][]);
        if (arr.length > 0) {
          const itemWithColumns = arr.find((item) => item.columns.length);
          return { ...itemWithColumns, rows: concatenatedRows };
        } else {
          return null;
        }
      } else {
        return await getTableData();
      }
    }

    default:
      break;
  }
};

export const fetchColumnUniqFilters = async (
  columnName: string
): Promise<string[]> => {
  const res = await getData(DS_ID, UNIQ_VALUES_BY_COLUMN_LOOKUP_ID, {
    columnName,
  });
  return res?.rows.map((row) => row[0]).filter((item) => item);
};
