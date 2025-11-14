import PropTypes from "prop-types";
import { formatMoney, formatNumber, formatText, safeArray } from "./formatters";

const ItemCard = ({ item }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">{item.name}</p>
          <p className="text-xs text-slate-500">Marca: {item.brand}</p>
        </div>
        <span className="text-xs font-semibold uppercase text-slate-500">
          Cantidad: {item.quantity}
        </span>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Precio unitario
          </p>
          <p className="mt-1 text-sm font-medium text-slate-800">
            {item.unitPrice}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Precio pagado
          </p>
          <p className="mt-1 text-sm font-medium text-slate-800">{item.payPrice}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Precio envío
          </p>
          <p className="mt-1 text-sm font-medium text-slate-800">
            {item.deliveryPrice}
          </p>
        </div>
      </div>
    </div>
  );
};

ItemCard.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    quantity: PropTypes.string.isRequired,
    unitPrice: PropTypes.string.isRequired,
    payPrice: PropTypes.string.isRequired,
    deliveryPrice: PropTypes.string.isRequired,
  }).isRequired,
};

const PanelTwo = ({ data }) => {
  const brands = safeArray(data?.brand);
  const names = safeArray(data?.name);
  const quantities = safeArray(data?.quantity);
  const unitPrices = safeArray(data?.unitPrice);
  const payPrices = safeArray(data?.payPrice);
  const deliveryPrices = safeArray(data?.deliveryPrice);

  const totalItems = Math.max(
    brands.length,
    names.length,
    quantities.length,
    unitPrices.length
  );

  if (totalItems === 0) {
    return <p className="text-sm text-slate-600">Sin datos</p>;
  }

  const items = Array.from({ length: totalItems }, (_, index) => ({
    name: formatText(names[index]),
    brand: formatText(brands[index]),
    quantity: formatNumber(quantities[index]),
    unitPrice: formatMoney(unitPrices[index]),
    payPrice: formatMoney(payPrices[index]),
    deliveryPrice: formatMoney(deliveryPrices[index]),
  }));

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <ItemCard key={`${item.name}-${index}`} item={item} />
      ))}
    </div>
  );
};

PanelTwo.propTypes = {
  data: PropTypes.object,
};

PanelTwo.defaultProps = {
  data: null,
};

export default PanelTwo;



