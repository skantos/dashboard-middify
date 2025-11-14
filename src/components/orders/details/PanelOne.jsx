import PropTypes from "prop-types";
import { formatDateTime, formatMoney, formatNumber, formatText } from "./formatters";

const InfoCard = ({ label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
    <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
    <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
  </div>
);

InfoCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const PanelOne = ({ data, fallbackOrder, orderId }) => {
  const summaryInfo = [
    {
      label: "Orden marketplace",
      value: formatText(
        data?.orderId ??
          fallbackOrder?.marketPlace?.orderId ??
          fallbackOrder?.marketPlace?.idOrdenMarket ??
          fallbackOrder?.orderId
      ),
    },
    {
      label: "ID interno",
      value: formatText(orderId ?? fallbackOrder?._id ?? fallbackOrder?.id),
    },
    {
      label: "Marketplace",
      value: formatText(
        data?.nombre ??
          fallbackOrder?.marketPlace?.nombre ??
          fallbackOrder?.marketPlace?.name
      ),
    },
    {
      label: "Estado (Middify)",
      value: formatText(
        data?.statusOrder ??
          fallbackOrder?.status ??
          fallbackOrder?.marketPlace?.status
      ),
    },
    {
      label: "Estado original",
      value: formatText(
        data?.status ??
          fallbackOrder?.marketPlace?.status ??
          fallbackOrder?.status
      ),
    },
    {
      label: "Intentos",
      value: formatNumber(
        data?.attempts ??
          fallbackOrder?.attempts ??
          fallbackOrder?.marketPlace?.attempts
      ),
    },
    {
      label: "Mensaje",
      value: formatText(
        data?.message ??
          fallbackOrder?.message ??
          fallbackOrder?.marketPlace?.message
      ),
    },
    {
      label: "Creación",
      value: formatDateTime(
        data?.creation ??
          fallbackOrder?.creation ??
          fallbackOrder?.marketPlace?.creation
      ),
    },
    {
      label: "Última actualización",
      value: formatDateTime(
        data?.lastUpdate ??
          fallbackOrder?.lastUpdate ??
          fallbackOrder?.marketPlace?.lastUpdate
      ),
    },
    {
      label: "Error reportado",
      value: formatText(
        data?.errorDetail?.message ??
          fallbackOrder?.errorDetail?.message ??
          fallbackOrder?.marketPlace?.errorDetail?.message
      ),
    },
    {
      label: "Subtotal",
      value: formatMoney(data?.subTotal ?? fallbackOrder?.subTotal),
    },
    {
      label: "Total",
      value: formatMoney(data?.total ?? fallbackOrder?.total),
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">Resumen de la orden</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {summaryInfo.map((item) => (
          <InfoCard key={item.label} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  );
};

PanelOne.propTypes = {
  data: PropTypes.object,
  fallbackOrder: PropTypes.object,
  orderId: PropTypes.string,
};

PanelOne.defaultProps = {
  data: null,
  fallbackOrder: null,
  orderId: null,
};

export default PanelOne;



