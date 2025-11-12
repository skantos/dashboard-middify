const Sidebar = ({
  tenants = [],
  selectedTenantId = null,
  onChangeTenant,
  activeView = "dashboard",
  onChangeView,
  showTenantFilter = true,
}) => {
  const hasTenants =
    Array.isArray(tenants) &&
    tenants.some((tenant) => tenant?.tenantId && tenant?.tenantName);

  const handleViewChange = (view) => {
    if (typeof onChangeView === "function") {
      onChangeView(view);
    }
  };

  const handleTenantChange = (event) => {
    if (typeof onChangeTenant === "function") {
      const value = event.target.value;
      onChangeTenant(value === "all" ? null : value);
    }
  };

  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:flex">
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Vistas
          </p>
          <div className="mt-2 space-y-2">
            <button
              type="button"
              onClick={() => handleViewChange("dashboard")}
              className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                activeView === "dashboard"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                  : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
              }`}
            >
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => handleViewChange("stores")}
              className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                activeView === "stores"
                  ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                  : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
              }`}
            >
              Tiendas
            </button>
          </div>
        </div>

        {showTenantFilter && (
          <div>
            <label
              htmlFor="tenant-select"
              className="block text-sm font-medium text-slate-700"
            >
              Tienda
            </label>
            <div className="mt-2">
              <select
                id="tenant-select"
                value={selectedTenantId ?? "all"}
                onChange={handleTenantChange}
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Todas las tiendas</option>
                {hasTenants &&
                  tenants.map((tenant) => (
                    <option key={tenant.tenantId} value={tenant.tenantId}>
                      {tenant.tenantName}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
