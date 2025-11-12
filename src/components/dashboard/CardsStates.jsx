const numberFormatter = new Intl.NumberFormat("es-CL");

const aggregateTenants = (tenants) => {
  const stateOrder = [];
  const stateMap = new Map();
  let total = 0;

  tenants.forEach((tenant) => {
    total += Number(tenant?.total) || 0;

    (Array.isArray(tenant?.states) ? tenant.states : []).forEach((state) => {
      const name = state?._id ?? "Sin estado";
      const countValue = Number(state?.count) || 0;

      if (!stateMap.has(name)) {
        stateOrder.push(name);
        stateMap.set(name, countValue);
      } else {
        stateMap.set(name, stateMap.get(name) + countValue);
      }
    });
  });

  const states = stateOrder.map((name) => ({
    id: name,
    name,
    count: stateMap.get(name),
  }));

  return {
    id: "all-tenants",
    name: "Todas las tiendas",
    total,
    states,
  };
};

const normalizeTenant = (tenant, index) => {
  const id = tenant?.tenantId ?? `tenant-${index}`;
  const states = Array.isArray(tenant?.states)
    ? tenant.states.map((state, stateIndex) => ({
        id: state?._id ?? `tenant-${id}-state-${stateIndex}`,
        name: state?._id ?? "Sin estado",
        count: Number(state?.count) || 0,
      }))
    : [];

  return {
    id,
    name: tenant?.tenantName ?? "Sin nombre",
    total: Number(tenant?.total) || 0,
    states,
  };
};

const CardsStates = ({ tenants, isAggregated }) => {
  if (!Array.isArray(tenants) || tenants.length === 0) {
    return null;
  }

  const cards = isAggregated
    ? [aggregateTenants(tenants)]
    : tenants.map((tenant, index) => normalizeTenant(tenant, index));

  return (
    <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        Tenants y estados
      </h2>
      <ul className="mt-4 space-y-4 text-sm text-slate-700">
        {cards.map((card) => (
          <li key={card.id} className="rounded-lg border border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <strong className="text-base text-slate-900">{card.name}</strong>
              <span className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                Total: {numberFormatter.format(card.total || 0)}
              </span>
            </div>
            {card.states.length > 0 && (
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {card.states.map((state) => (
                  <li
                    key={state.id}
                    className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600"
                  >
                    <span className="capitalize text-slate-700">
                      {state.name}
                    </span>
                    <span className="rounded-full bg-white px-2 py-0.5 text-indigo-600 shadow-sm">
                      {numberFormatter.format(state.count || 0)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CardsStates;

