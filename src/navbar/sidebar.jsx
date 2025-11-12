import { useEffect, useMemo, useState } from "react";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LogoFull from "../assets/logo/logo-removebg-preview.png";
import LogoCompact from "../assets/logo/middify.png";

const ORDER_STATE_ITEMS = [
  { id: "ingresada", label: "Ingresada" },
  { id: "pendiente", label: "Pendiente" },
  { id: "procesada", label: "Procesada" },
  { id: "error", label: "Error" },
  { id: "en_proceso", label: "En proceso" },
  { id: "descartada", label: "Descartada" },
];

export const SIDEBAR_WIDTH = 280;
export const SIDEBAR_COLLAPSED_WIDTH = 84;

const StatusDot = ({ active }) => (
  <span
    className={`inline-flex h-2.5 w-2.5 rounded-full transition-all duration-200 ${
      active ? "bg-white scale-110" : "bg-white/60"
    }`}
  />
);

const Sidebar = ({
  tenants = [],
  selectedTenantId = null,
  onChangeTenant,
  activeView = "dashboard",
  onChangeView,
  showTenantFilter = true,
  activeOrderState = null,
  onChangeOrderState,
  isCollapsed = false,
  onToggleCollapse = () => {},
  isMobileOpen = false,
  onCloseMobile = null,
}) => {
  const { hasValidTenants, tenantOptions } = useMemo(() => {
    if (!Array.isArray(tenants)) {
      return { hasValidTenants: false, tenantOptions: [] };
    }

    const options = tenants.filter(
      (tenant) => tenant?.tenantId && tenant?.tenantName
    );
    return { hasValidTenants: options.length > 0, tenantOptions: options };
  }, [tenants]);

  const handleViewChange = (view) => {
    if (typeof onChangeView === "function") {
      onChangeView(view);
    }
    closeMobileIfNeeded();
  };

  const handleTenantChange = (event) => {
    if (typeof onChangeTenant === "function") {
      const value = event.target.value;
      onChangeTenant(value === "all" ? null : value);
    }
  };

  const closeMobileIfNeeded = () => {
    if (isMobileOpen && typeof onCloseMobile === "function") {
      onCloseMobile();
    }
  };

  const [ordersExpanded, setOrdersExpanded] = useState(activeView === "orders");
  const [isAnimating, setIsAnimating] = useState(false);
  const effectiveCollapsed = isCollapsed && !isMobileOpen;

  useEffect(() => {
    if (effectiveCollapsed) {
      setOrdersExpanded(false);
      return;
    }
    if (activeView === "orders") {
      setOrdersExpanded(true);
    }
  }, [activeView, effectiveCollapsed]);

  const isDashboardActive = activeView === "dashboard";
  const isStoresActive = activeView === "stores";
  const isOrdersRootActive = activeView === "orders" && !activeOrderState;

  const handleOrderRootClick = () => {
    handleViewChange("orders");
    if (typeof onChangeOrderState === "function") {
      onChangeOrderState(null);
    }
    closeMobileIfNeeded();
  };

  const handleOrderStateClick = (stateId) => {
    const exists = ORDER_STATE_ITEMS.some((state) => state.id === stateId);
    if (!exists) {
      return;
    }
    handleViewChange("orders");
    if (typeof onChangeOrderState === "function") {
      onChangeOrderState(stateId);
    }
    closeMobileIfNeeded();
  };

  const handleOrdersToggle = async () => {
    if (effectiveCollapsed) {
      onToggleCollapse(false);
      return;
    }
    
    if (isAnimating) return;
    
    setIsAnimating(true);
    setOrdersExpanded(prev => !prev);
    
    // Esperar a que la animación termine
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const renderSidebarBody = (collapsed) => {
    const headerPaddingX = collapsed ? "px-3" : "px-6";
    const headerPaddingTop = collapsed ? "pt-4" : "pt-6"; // Reducido
    const navPaddingX = collapsed ? "px-2" : "px-6";
    const navPaddingTop = collapsed ? "pt-2" : "pt-4"; // Reducido
    const footerPaddingX = collapsed ? "px-3" : "px-6";
    const navAlignment = collapsed ? "text-center" : "text-left";

    const primaryButtonClasses = (isActive) =>
      [
        "flex w-full items-center rounded-2xl py-2.5 text-sm font-semibold transition-all duration-200", // py reducido
        isActive
          ? "bg-white/20 shadow-lg shadow-black/10"
          : "bg-transparent hover:bg-white/10",
        collapsed ? "justify-center px-0" : "justify-start px-4",
        collapsed ? "" : "gap-3",
      ]
        .filter(Boolean)
        .join(" ");

    const ordersButtonClasses = [
      "flex w-full items-center rounded-2xl py-2.5 text-sm font-semibold transition-all duration-200", // py reducido
      activeView === "orders" && ordersExpanded
        ? "bg-white/20 shadow-lg shadow-black/10"
        : "bg-transparent hover:bg-white/10",
      collapsed ? "justify-center px-0" : "justify-between px-4",
    ].join(" ");

    return (
      <div className="flex h-full flex-col justify-between">
        <div>
          <div className={`${headerPaddingX} ${headerPaddingTop}`}>
            <div className="flex flex-col items-center">
              <img
                src={collapsed ? LogoCompact : LogoFull}
                alt="Logo Middify"
                className={`transition-all duration-200 ${
                  collapsed ? "w-10" : "w-24"
                }`}
              />

              {showTenantFilter && !collapsed && (
                <div className="mt-4 w-full text-left">
                  <div className="h-px w-full bg-white/15 transition-all duration-200" />
                  <label
                    htmlFor="tenant-select"
                    className="mt-3 block text-sm font-medium text-white/80 transition-colors duration-200" // mt reducido
                  >
                    Tienda
                  </label>
                  <div className="relative mt-1.5"> 
                    <select
                      id="tenant-select"
                      value={selectedTenantId ?? "all"}
                      onChange={handleTenantChange}
                      className="w-full appearance-none rounded-xl border border-white/25 bg-white/10 px-3 py-2 pr-10 text-sm font-medium text-white outline-none transition-all duration-200 hover:border-white/40 focus:border-white focus:bg-white/15" // py reducido
                    >
                      <option className="bg-white text-slate-800" value="all">
                        Todas las tiendas
                      </option>
                      {hasValidTenants &&
                        tenantOptions.map((tenant) => (
                          <option
                            key={tenant.tenantId}
                            value={tenant.tenantId}
                            className="bg-white text-slate-800"
                          >
                            {tenant.tenantName}
                          </option>
                        ))}
                    </select>
                    <ExpandMoreIcon className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/70 transition-transform duration-200" />
                  </div>
                </div>
              
              )}
            </div>
          </div>

          <div
            className={`${navPaddingX} ${navPaddingTop}`} 
          >
            <nav className={`space-y-4 ${navAlignment}`}> 
              <div className="space-y-2"> 
                <button
                  type="button"
                  onClick={() => handleViewChange("dashboard")}
                  className={primaryButtonClasses(isDashboardActive)}
                >
                  <AssessmentIcon 
                    className={`transition-all duration-200 ${
                      isDashboardActive ? "text-white scale-110" : "text-white/85"
                    }`} 
                    fontSize="small" 
                  />
                  {!collapsed && (
                    <span className={`transition-all duration-200 ${
                      isDashboardActive ? "text-white font-semibold" : "text-white/90"
                    }`}>
                      Dashboard
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleViewChange("stores")}
                  className={primaryButtonClasses(isStoresActive)}
                >
                  <ApartmentIcon 
                    className={`transition-all duration-200 ${
                      isStoresActive ? "text-white scale-110" : "text-white/85"
                    }`} 
                    fontSize="small" 
                  />
                  {!collapsed && (
                    <span className={`transition-all duration-200 ${
                      isStoresActive ? "text-white font-semibold" : "text-white/90"
                    }`}>
                      Tiendas
                    </span>
                  )}
                </button>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleOrdersToggle}
                  className={ordersButtonClasses}
                >
                  <div
                    className={`flex items-center ${collapsed ? "gap-0" : "gap-3"}`}
                  >
                    <Inventory2Icon 
                      className={`transition-all duration-200 ${
                        activeView === "orders" ? "text-white scale-110" : "text-white/85"
                      }`} 
                      fontSize="small" 
                    />
                    {!collapsed && (
                      <span className={`transition-all duration-200 ${
                        activeView === "orders" ? "text-white font-semibold" : "text-white/90"
                      }`}>
                        Órdenes
                      </span>
                    )}
                  </div>
                  {!collapsed && (
                    <ExpandMoreIcon
                      className={`text-white/70 transition-all duration-300 ${
                        ordersExpanded ? "rotate-180" : ""
                      }`}
                      fontSize="small"
                    />
                  )}
                </button>

                {!collapsed && (
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      ordersExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="ml-2 space-y-1 border-l border-white/15 pl-4 pt-1">
                      <button
                        type="button"
                        onClick={handleOrderRootClick}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-1.5 text-sm transition-all duration-200 ${
                          isOrdersRootActive
                            ? "bg-white/15 font-semibold text-white shadow shadow-black/10"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        }`} // py reducido
                      >
                        <StatusDot active={isOrdersRootActive} />
                        <span>Todas</span>
                      </button>
                      {ORDER_STATE_ITEMS.map((state) => {
                        const isActive = activeOrderState === state.id;
                        return (
                          <button
                            key={state.id}
                            type="button"
                            onClick={() => handleOrderStateClick(state.id)}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-1.5 text-sm transition-all duration-200 ${
                              isActive
                                ? "bg-white/15 font-semibold text-white shadow shadow-black/10"
                                : "text-white/80 hover:bg-white/10 hover:text-white"
                            }`} // py reducido
                          >
                            <StatusDot active={isActive} />
                            <span>{state.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>

        <div className={`${footerPaddingX} pb-4`}>
          {!collapsed && (
            <div className="text-center text-xs text-white/50 transition-all duration-200">
              © {new Date().getFullYear()} Middify
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <aside
        className="hidden h-screen-full flex-shrink-0 bg-[#063279] text-white transition-all duration-200 lg:flex flex-col" // h-full-screen cambiado a h-full
        style={{
          width: effectiveCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        }}
      >
        {renderSidebarBody(effectiveCollapsed)}
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            aria-label="Cerrar barra lateral"
            onClick={closeMobileIfNeeded}
            className="absolute inset-0 bg-black/60 transition-all duration-200"
          />
          <aside className="relative ml-0 flex h-full w-72 max-w-full flex-col bg-[#063279] text-white shadow-2xl transition-all duration-200">
            {renderSidebarBody(false)}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;