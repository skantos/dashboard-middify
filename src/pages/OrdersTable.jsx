import { useCallback, useEffect, useMemo, useState } from "react";
import { useOrdersByState } from "../api/getOrdersByState";

const ORDER_STATE_ITEMS = [
  { id: "ingresada", label: "Ingresada" },
  { id: "pendiente", label: "Pendiente" },
  { id: "procesada", label: "Procesada" },
  { id: "error", label: "Error" },
  { id: "en_proceso", label: "En proceso" },
  { id: "descartada", label: "Descartada" },
];

const PAGE_SIZE_OPTIONS_BASE = [10, 20, 50, 100];

const normalizeStatusKey = (status) => {
  if (!status) {
    return "";
  }
  return String(status).toLowerCase().replace(/\s+/g, "_");
};

const formatDateTime = (value) => {
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "—";
  }
  try {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(Number(value));
  } catch (_error) {
    return value;
  }
};

const OrdersTable = ({
  token = null,
  selectedTenantId = null,
  selectedOrderState = null,
}) => {
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);

  const apiStatus = selectedOrderState
    ? selectedOrderState.replace(/_/g, " ")
    : null;

  const { orders, meta, loading, error } = useOrdersByState(token, {
    tenantId: selectedTenantId ?? undefined,
    status: apiStatus ?? undefined,
    page,
    pageSize,
  });

  const selectedStateLabel = useMemo(() => {
    return (
      ORDER_STATE_ITEMS.find((item) => item.id === selectedOrderState)?.label ??
      "Todos los estados"
    );
  }, [selectedOrderState]);

  const pageSizeOptions = useMemo(() => {
    if (PAGE_SIZE_OPTIONS_BASE.includes(pageSize)) {
      return PAGE_SIZE_OPTIONS_BASE;
    }
    return [...PAGE_SIZE_OPTIONS_BASE, pageSize].sort((a, b) => a - b);
  }, [pageSize]);

  useEffect(() => {
    setPage(1);
  }, [selectedTenantId, selectedOrderState]);

  const totalPagesFromMeta = meta?.totalPages ?? null;
  const resolvedPageSize =
    meta?.pageSize && meta.pageSize > 0 ? meta.pageSize : pageSize;
  const currentPage = meta?.page ?? page;
  const displayOrders = Array.isArray(orders) ? orders : [];
  const ordersCount = displayOrders.length;
  const totalItems = Number.isFinite(meta?.total) ? meta.total : null;

  useEffect(() => {
    if (totalPagesFromMeta && page > totalPagesFromMeta) {
      setPage(totalPagesFromMeta);
    }
  }, [page, totalPagesFromMeta]);

  const numberFormatter = useMemo(() => new Intl.NumberFormat("es-CL"), []);

  const paginationSummary = useMemo(() => {
    if (ordersCount === 0) {
      return "Sin resultados para los filtros seleccionados";
    }
    const safePageSize = resolvedPageSize || ordersCount || 1;
    const start = (currentPage - 1) * safePageSize + 1;
    const end = start + ordersCount - 1;
    const formattedStart = numberFormatter.format(start);
    const formattedEnd = numberFormatter.format(end);

    if (totalItems && totalItems > 0) {
      const formattedTotal = numberFormatter.format(totalItems);
      return `Mostrando ${formattedStart}-${formattedEnd} de ${formattedTotal} órdenes`;
    }

    return `Mostrando ${formattedStart}-${formattedEnd} órdenes`;
  }, [
    currentPage,
    numberFormatter,
    ordersCount,
    resolvedPageSize,
    totalItems,
  ]);

  const isFirstPage = currentPage <= 1;
  const isLastPage =
    totalPagesFromMeta !== null
      ? currentPage >= totalPagesFromMeta
      : ordersCount < resolvedPageSize || ordersCount === 0;

  const handleNextPage = useCallback(() => {
    if (loading || isLastPage) {
      return;
    }
    setPage((prev) => prev + 1);
  }, [isLastPage, loading]);

  const handlePrevPage = useCallback(() => {
    if (loading || isFirstPage) {
      return;
    }
    setPage((prev) => Math.max(prev - 1, 1));
  }, [isFirstPage, loading]);

  const handlePageSizeChange = useCallback((event) => {
    const nextSize = Number(event.target.value);
    if (!Number.isFinite(nextSize) || nextSize <= 0) {
      return;
    }
    setPageSize(nextSize);
    setPage(1);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-800">Estado de órdenes</h1>
        <p className="mt-1 text-sm text-slate-500">
          Mostrando{" "}
          <span className="font-medium text-indigo-600">
            {selectedStateLabel.toLowerCase()}
          </span>{" "}
          {selectedTenantId ? "para la tienda seleccionada" : "para todas las tiendas"}.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase text-slate-500">Total</p>
            <p className="mt-1 text-lg font-semibold text-slate-800">
              {meta?.total ?? "—"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase text-slate-500">Página</p>
            <p className="mt-1 text-lg font-semibold text-slate-800">
              {currentPage ?? "—"} / {totalPagesFromMeta ?? "—"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Tamaño de página
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-800">
              {resolvedPageSize ?? "—"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase text-slate-500">Estado</p>
            <p className="mt-1 text-lg font-semibold text-slate-800">
              {meta?.ok ? "Operativo" : meta?.ok === false ? "Sin datos" : "—"}
            </p>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading && (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            Cargando órdenes...
          </div>
        )}
        {error && !loading && (
          <div className="px-6 py-12 text-center text-sm text-red-500">
            Error al cargar las órdenes: {error.message}
          </div>
        )}
        {!loading && !error && ordersCount === 0 && (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            No hay órdenes disponibles para los filtros seleccionados.
          </div>
        )}
        {!loading && !error && ordersCount > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Orden
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Tienda
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Mensaje
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Creación
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actualización
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {displayOrders.map((order) => {
                  const orderId = order._id ?? order.id ?? "—";
                  const marketplace = order.marketPlace ?? {};
                  const statusLabel =
                    ORDER_STATE_ITEMS.find(
                      (item) => item.id === normalizeStatusKey(order.status)
                    )?.label ?? order.status ?? "—";
                  const creationDate = marketplace.creation ?? order.creation;
                  const lastUpdateDate = marketplace.lastUpdate ?? order.lastUpdate;
                  const totalAmount =
                    order.total?.amount ?? marketplace.total?.amount ?? null;

                  return (
                    <tr key={`${orderId}-${order.tennantId ?? order.tenantId ?? ""}`}>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        <div className="font-medium text-slate-800">
                          {marketplace.orderId ?? "—"}
                        </div>
                        <div className="text-xs text-slate-500">{orderId}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        <div className="font-medium text-slate-800">
                          {order.tennantName ?? order.tenantName ?? "—"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {order.tennantId ?? order.tenantId ?? "—"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-indigo-600">
                        {statusLabel}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {order.message ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {formatDateTime(creationDate)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {formatDateTime(lastUpdateDate)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-800">
                        {formatCurrency(totalAmount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex flex-col gap-4 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600">{paginationSummary}</div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              Filas por página
              <select
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={pageSize}
                onChange={handlePageSizeChange}
                disabled={loading}
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={loading || isFirstPage}
                className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-sm font-medium text-slate-700">
                Página {currentPage ?? "—"} de {totalPagesFromMeta ?? "—"}
              </span>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={loading || isLastPage}
                className="rounded-lg border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrdersTable;

