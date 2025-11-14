import PropTypes from "prop-types";
import { formatDateTime, formatText, safeArray } from "./formatters";

const PanelFive = ({ data }) => {
  const documents = safeArray(data);

  if (documents.length === 0) {
    return <p className="text-sm text-slate-600">Sin datos</p>;
  }

  return (
    <div className="space-y-4">
      {documents.map((doc, index) => (
        <div
          key={`${doc?.name ?? "document"}-${index}`}
          className="rounded-xl border border-slate-200 bg-slate-50 p-4"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {formatText(doc?.name)}
              </p>
              <p className="text-xs text-slate-500">
                Tipo: {formatText(doc?.type)} • Estado: {formatText(doc?.status)}
              </p>
            </div>
            {doc?.url ? (
              <a
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-indigo-600 hover:underline"
              >
                Ver documento
              </a>
            ) : null}
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                Creación
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {formatDateTime(doc?.creation)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                Última actualización
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {formatDateTime(doc?.lastUpdate)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

PanelFive.propTypes = {
  data: PropTypes.array,
};

PanelFive.defaultProps = {
  data: [],
};

export default PanelFive;



