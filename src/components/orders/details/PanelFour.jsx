import PropTypes from "prop-types";
import { formatText } from "./formatters";

const CustomerRow = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
    <p className="mt-1 text-sm text-slate-700">{value}</p>
  </div>
);

CustomerRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const PanelFour = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return <p className="text-sm text-slate-600">Sin datos</p>;
  }

  const rows = [
    { label: "Documento", value: formatText(data.idDocNo) },
    { label: "Tipo documento", value: formatText(data.idDocType) },
    { label: "Tipo persona", value: formatText(data.personType) },
    { label: "Razón social", value: formatText(data.businessName) },
    { label: "Nombre", value: formatText(data.name) },
    { label: "Apellido", value: formatText(data.lastName) },
    { label: "Correo", value: formatText(data.mail) },
    { label: "Teléfono", value: formatText(data.phone) },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {rows.map((row) => (
        <CustomerRow key={row.label} label={row.label} value={row.value} />
      ))}
    </div>
  );
};

PanelFour.propTypes = {
  data: PropTypes.object,
};

PanelFour.defaultProps = {
  data: null,
};

export default PanelFour;



