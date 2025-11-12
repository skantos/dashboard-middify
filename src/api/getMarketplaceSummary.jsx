import { useEffect, useState } from "react";

const API_URL =
  "https://957chi25kf.execute-api.us-east-2.amazonaws.com/dev/getMarketplaceSummary";

const normalizeTenants = (tenants) => {
  const deduped = [];
  const seen = new Set();

  tenants.forEach((tenant, index) => {
    if (!tenant || typeof tenant !== "object") {
      return;
    }

    const hasId = typeof tenant.tenantId === "string" && tenant.tenantId.length;
    const key = hasId ? tenant.tenantId : `__tenant_${index}`;

    if (seen.has(key)) {
      return;
    }

    seen.add(key);

    const marketplaces = Array.isArray(tenant.marketplaces)
      ? tenant.marketplaces.map((marketplace, marketplaceIndex) => ({
          id:
            marketplace?.name ??
            `marketplace-${key}-${marketplaceIndex}`,
          name: marketplace?.name ?? "Sin nombre",
          count: Number(marketplace?.count) || 0,
          creation: marketplace?.creation ?? null,
          lastUpdate: marketplace?.lastUpdate ?? null,
        }))
      : [];

    deduped.push({
      tenantId: hasId ? tenant.tenantId : key,
      tenantName: tenant?.tenantName ?? "Sin nombre",
      marketplaces,
    });
  });

  return deduped;
};

export const getMarketplaceSummary = async ({ token, signal } = {}) => {
  if (!token) {
    throw new Error("Token de autenticación no proporcionado.");
  }

  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}`);
  }

  const result = await response.json();

  const tenantsList = Array.isArray(result?.tenants)
    ? result.tenants
    : Array.isArray(result)
    ? result
    : null;

  if (!tenantsList) {
    throw new Error(
      "La respuesta no contiene la propiedad 'tenants' como arreglo."
    );
  }

  return normalizeTenants(tenantsList);
};

export const useMarketplaceSummary = (token) => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setTenants([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const tenantsList = await getMarketplaceSummary({
          token,
          signal: controller.signal,
        });
        if (isMounted) {
          setTenants(tenantsList);
        }
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [token]);

  return { tenants, loading, error };
};

