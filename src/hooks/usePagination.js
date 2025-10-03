// hooks/usePagination.js
import { useState, useEffect } from "react";

/**
 * usePagination
 * @param {Function|Array} source - Either an array of items OR an async function(page, perPage) => {data,total}
 * @param {number} perPage - items per page
 */
export default function usePagination(source, perPage = 10) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const maxPage = Math.ceil(total / perPage);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      if (typeof source === "function") {
        const res = await source(page, perPage);
        if (active) {
          setData(res.data);
          setTotal(res.total);
        }
      } else if (Array.isArray(source)) {
        const start = (page - 1) * perPage;
        const slice = source.slice(start, start + perPage);
        if (active) {
          setData(slice);
          setTotal(source.length);
        }
      }
      setLoading(false);
    };
    fetchData();
    return () => {
      active = false;
    };
  }, [page, perPage, source]);

  return {
    page,
    setPage,
    data,
    total,
    maxPage,
    loading,
    next: () => setPage((p) => Math.min(p + 1, maxPage)),
    prev: () => setPage((p) => Math.max(p - 1, 1)),
    reset: () => setPage(1),
  };
}
