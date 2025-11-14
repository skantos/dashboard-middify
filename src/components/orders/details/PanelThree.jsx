import PropTypes from "prop-types";
import {
  formatDateTime,
  formatMoney,
  formatText,
  safeArray,
} from "./formatters";

const AddressBlock = ({ title, address }) => {
  if (!address || Object.keys(address).length === 0) {
    return null;
  }

  const lines = [
    { label: "Código postal", value: formatText(address.zipCode) },
    { label: "País", value: formatText(address.country) },
    { label: "Región", value: formatText(address.region) },
    { label: "Provincia", value: formatText(address.province) },
    { label: "Municipalidad", value: formatText(address.municipality) },
    { label: "Ciudad", value: formatText(address.city) },
    { label: "Dirección 1", value: formatText(address.line1) },
    { label: "Dirección 2", value: formatText(address.line2) },
    { label: "Persona contacto", value: formatText(address.contactPerson) },
    { label: "Teléfono contacto", value: formatText(address.contactPhone) },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <dl className="mt-2 grid gap-2 sm:grid-cols-2">
        {lines.map((line) => (
          <div key={line.label}>
            <dt className="text-xs font-semibold uppercase text-slate-500">
              {line.label}
            </dt>
            <dd className="text-sm text-slate-700">{line.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

AddressBlock.propTypes = {
  title: PropTypes.string.isRequired,
  address: PropTypes.object,
};

AddressBlock.defaultProps = {
  address: null,
};

const PanelThree = ({ data }) => {
  if (!data) {
    return <p className="text-sm text-slate-600">Sin datos</p>;
  }

  const cost = formatMoney(data?.cost);
  const date = formatDateTime(data?.cost?.date ?? data?.date);

  const pickUpAddresses = safeArray(data?.pickupAddress);
  const deliveryAddresses = safeArray(data?.address);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase text-slate-500">
            Fecha de envío
          </p>
          <p className="mt-1 text-sm font-medium text-slate-800">{date}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase text-slate-500">
            Costo
          </p>
          <p className="mt-1 text-sm font-medium text-slate-800">{cost}</p>
        </div>
      </div>

      <div className="space-y-4">
        {pickUpAddresses.map((address, index) => (
          <AddressBlock
            key={`pickup-${index}`}
            title={`Dirección de retiro ${pickUpAddresses.length > 1 ? index + 1 : ""}`}
            address={address}
          />
        ))}
        {deliveryAddresses.map((address, index) => (
          <AddressBlock
            key={`delivery-${index}`}
            title={`Dirección de entrega ${deliveryAddresses.length > 1 ? index + 1 : ""}`}
            address={address}
          />
        ))}
      </div>
    </div>
  );
};

PanelThree.propTypes = {
  data: PropTypes.object,
};

PanelThree.defaultProps = {
  data: null,
};

export default PanelThree;



