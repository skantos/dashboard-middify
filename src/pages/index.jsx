import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useProductStates } from "../api/getProductStates";
import { useMarketplaceSummary } from "../api/getMarketplaceSummary";
import { useUsers } from "../api/getUsers";
import Navbar from "../navbar/navbar";
import Sidebar from "../navbar/sidebar";
import Dashboard from "./Dashboard";
import Stores from "./Stores";
import OrdersTable from "./OrdersTable";

const VIEW_REGISTRY = {
  dashboard: Dashboard,
  stores: Stores,
  orders: OrdersTable,
};

const Index = () => {
  const auth = useAuth();
  const token = auth.user?.id_token;

  const {
    tenants,
    loading: tenantsLoading,
    error: tenantsError,
  } = useProductStates(token);
  const {
    tenants: marketplaceTenants,
    loading: marketplaceLoading,
    error: marketplaceError,
  } = useMarketplaceSummary(token);
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useUsers(token);

  const [activeView, setActiveView] = useState("dashboard");
  const [selectedTenantId, setSelectedTenantId] = useState(null);
  const [selectedOrderState, setSelectedOrderState] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleChangeView = useCallback((nextView) => {
    setActiveView((current) =>
      nextView && VIEW_REGISTRY[nextView] ? nextView : current
    );
  }, []);

  const isLoading = tenantsLoading || marketplaceLoading || userLoading;
  const error = tenantsError || marketplaceError || userError;

  const handleSelectOrderState = useCallback(
    (stateId) => {
      setSelectedOrderState(stateId ?? null);
      setActiveView("orders");
    },
    [setActiveView, setSelectedOrderState]
  );

  const filteredTenants = useMemo(() => {
    if (selectedTenantId) {
      return (tenants || []).filter(
        (tenant) => tenant.tenantId === selectedTenantId
      );
    }
    return tenants || [];
  }, [selectedTenantId, tenants]);

  const filteredMarketplaceTenants = useMemo(() => {
    if (selectedTenantId) {
      return (marketplaceTenants || []).filter(
        (tenant) => tenant.tenantId === selectedTenantId
      );
    }
    return marketplaceTenants || [];
  }, [selectedTenantId, marketplaceTenants]);

  const ActiveViewComponent = useMemo(() => {
    return VIEW_REGISTRY[activeView] ?? Dashboard;
  }, [activeView]);

  const viewProps = useMemo(() => {
    if (activeView === "stores") {
      return {
        isLoading,
        error,
        productTenants: tenants || [],
        marketplaceTenants: marketplaceTenants || [],
      };
    }

    if (activeView === "orders") {
      return {
        token,
        selectedTenantId,
        selectedOrderState,
      };
    }

    return {
      isLoading,
      error,
      tenants: filteredTenants,
      marketplaceTenants: filteredMarketplaceTenants,
      isAggregated: selectedTenantId === null,
      onSelectOrderState: handleSelectOrderState,
    };
  }, [
    activeView,
    error,
    filteredMarketplaceTenants,
    filteredTenants,
    isLoading,
    marketplaceTenants,
    selectedOrderState,
    selectedTenantId,
    tenants,
    token,
  ]);

  const handleToggleSidebarCollapse = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  const handleOpenSidebar = useCallback(() => {
    setIsSidebarOpen(true);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  useEffect(() => {
    const updateSidebarState = () => {
      if (typeof window !== "undefined" && window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    updateSidebarState();
    window.addEventListener("resize", updateSidebarState);
    return () => window.removeEventListener("resize", updateSidebarState);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Sidebar
        tenants={tenants}
        selectedTenantId={selectedTenantId}
        onChangeTenant={setSelectedTenantId}
        activeView={activeView}
        onChangeView={handleChangeView}
        showTenantFilter={true}
        activeOrderState={selectedOrderState}
        onChangeOrderState={setSelectedOrderState}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={setIsSidebarCollapsed}
        isMobileOpen={isSidebarOpen}
        onCloseMobile={handleCloseSidebar}
      />
      <div className="flex flex-1 flex-col">
        <Navbar
          user={user}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebarCollapse={handleToggleSidebarCollapse}
          onToggleMobileSidebar={handleOpenSidebar}
        />
        <div className="flex-1 px-4 pb-10 sm:px-6 lg:px-8">
          <main className="mx-auto w-full max-w-6xl">
            <ActiveViewComponent {...viewProps} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;