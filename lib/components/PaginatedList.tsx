import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FlatList, FlatListProps, RefreshControl } from "react-native";
import { FetchPaginatedQuery } from "../redux/types/common.types";
import { ICustomViewStyle } from "react-native-reanimated-skeleton";
import { defaultSkeleton } from "../constants/skeletons";
import Skeleton from "./Skeleton";
import ListEmptyComponent from "./ListEmptyComponent";
import { globalErrorHandler } from "../utils/error.utils";

export const PAGE_LIMIT = 15;

export type GetHelpers<T> = {
  dataList: T[];
  fetchData: Function;
  setDataList: Function;
  setLoading: Function;
};
interface PaginatedListProps<T> extends Omit<FlatListProps<T>, "data"> {
  dispatchForDataFetch: (
    query: FetchPaginatedQuery & any,
    reset?: boolean
  ) => Promise<any>;
  onEndReachedThreshold?: number;
  pageLimit?: number;
  getHelpers?: (helpers: GetHelpers<T>) => void;
  responseParser?: (response: any) => T[];
  additionalQueryParams?: any;
  customSkeleton?: {
    noOfSkeletonInList: number;
    layout: ICustomViewStyle;
    marginTop?: number;
  };
}

export function PaginatedFlatList<T>(props: PaginatedListProps<T>) {
  const {
    dispatchForDataFetch,
    onEndReachedThreshold = 0.2,
    pageLimit = PAGE_LIMIT,
    responseParser = (response) => response.list,
    additionalQueryParams,
    getHelpers,
    customSkeleton = {
      noOfSkeletonInList: 5,
      layout: defaultSkeleton,
    },
  } = props;

  const [dataList, setDataList] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isEndReached, setIsEndReached] = useState(false);
  const hasMounted = useRef(false);
  const [componentMounted, setComponentMounted] = useState(false);
  const flatListRef = useRef<FlatList<T>>(null);

  const fetchData = useCallback(
    async ({ reset = false, showLoading = false }) => {
      try {
        if (!reset || showLoading) setLoading(true);
        const response = await dispatchForDataFetch(
          {
            page,
            limit: pageLimit,
            ...additionalQueryParams,
          },
          (reset = reset)
        );
        let data = response.data;
        if (typeof responseParser === "function") {
          data = responseParser(data);
        }
        setIsEndReached(data.length < pageLimit);
        if (reset) {
          setDataList(data);
        } else {
          setDataList((prevDataList) => [...prevDataList, ...data]);
        }
      } catch (error) {
        globalErrorHandler(error);
      } finally {
        setLoading(false);
      }
    },
    [page, additionalQueryParams]
  );

  const fetchNextPage = () => {
    if (isEndReached || loading) {
      return;
    }
    setPage((prevPage) => prevPage + 1);
  };

  const onRefresh = useCallback(async () => {
    setRefreshLoading(true);
    setPage(1);
    await fetchData({ reset: true });
    setRefreshLoading(false);
  }, [additionalQueryParams]);

  useEffect(() => {
    if (hasMounted.current) {
      setPage(1);
      setDataList([]);
      fetchData({ reset: true, showLoading: true });
    } else {
      hasMounted.current = true;
    }
  }, [additionalQueryParams]);

  useEffect(() => {
    if (!refreshLoading) fetchData({});
  }, [page]);

  useEffect(() => {
    setTimeout(() => {
      setComponentMounted(true);
    }, 20);
  }, []);

  useEffect(() => {
    // Scroll to bottom when loading new data
    if (flatListRef.current && loading) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [loading]);

  const ListEndLoader = () => {
    if (loading) {
      return (
        <Skeleton
          isLoading={true}
          layout={Array.from({ length: 1 }, () => customSkeleton.layout)}
          children={null}
        />
      );
    }
    return null;
  };

  const skeleton = useMemo(() => {
    return [
      {
        marginTop: customSkeleton?.marginTop || 0,
        children: Array.from(
          { length: customSkeleton.noOfSkeletonInList },
          () => customSkeleton.layout
        ),
      },
    ];
  }, [customSkeleton?.marginTop]);

  useEffect(() => {
    if (typeof getHelpers === "function")
      getHelpers({
        dataList,
        fetchData,
        setDataList,
        setLoading,
      });
  }, [dataList, fetchData, setDataList, setLoading]);

  if (!componentMounted) {
    return null;
  }

  return (
    <Skeleton
      isLoading={
        loading &&
        dataList.length === 0 &&
        (customSkeleton ? customSkeleton.noOfSkeletonInList > 0 : false)
      }
      layout={skeleton}
    >
      <FlatList<T>
        ref={flatListRef}
        data={dataList}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={onEndReachedThreshold}
        ListFooterComponent={ListEndLoader}
        keyExtractor={(item: any, index) => item.id || index.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshLoading} onRefresh={onRefresh} />
        }
        style={{ height: "100%" }}
        ListEmptyComponent={<ListEmptyComponent />}
        showsVerticalScrollIndicator={false}
        {...props}
      />
    </Skeleton>
  );
}
