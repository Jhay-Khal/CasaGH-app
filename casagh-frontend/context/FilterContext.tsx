import React, { createContext, useContext, useState, useMemo } from 'react';

export type Filters = {
  roomType: string | null;
  maxPrice: number;
  amenities: Set<string>;
};

const defaultFilters: Filters = {
  roomType: null,
  maxPrice: 5000,
  amenities: new Set(),
};

type FilterContextValue = {
  filters: Filters;
  setRoomType: (v: string | null) => void;
  setMaxPrice: (v: number) => void;
  toggleAmenity: (v: string) => void;
  clearFilters: () => void;
  activeFilterCount: number;
  properties: any[];
  setProperties: (p: any[]) => void;
  applyFilters: (list: any[]) => any[];
};

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [properties, setProperties] = useState<any[]>([]);

  const setRoomType = (v: string | null) =>
    setFilters((f) => ({ ...f, roomType: f.roomType === v ? null : v }));

  const setMaxPrice = (v: number) => setFilters((f) => ({ ...f, maxPrice: v }));

  const toggleAmenity = (v: string) =>
    setFilters((f) => {
      const next = new Set(f.amenities);
      next.has(v) ? next.delete(v) : next.add(v);
      return { ...f, amenities: next };
    });

  const clearFilters = () => setFilters(defaultFilters);

  const applyFilters = (list: any[]) =>
    list.filter((p) => {
      // maxPrice at its default (5000) means "no limit" — only filter once the
      // user has actually moved the slider below the max.
      if (filters.maxPrice < 5000 && p.price > filters.maxPrice) return false;
      if (filters.roomType && p.roomType && String(p.roomType) !== filters.roomType) return false;
      if (filters.amenities.size > 0) {
        const propAmenities: string[] = p.amenities || [];
        for (const a of filters.amenities) {
          if (!propAmenities.includes(a)) return false;
        }
      }
      return true;
    });

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.roomType) count++;
    if (filters.maxPrice < 5000) count++;
    count += filters.amenities.size;
    return count;
  }, [filters]);

  return (
    <FilterContext.Provider
      value={{ filters, setRoomType, setMaxPrice, toggleAmenity, clearFilters, activeFilterCount, properties, setProperties, applyFilters }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used within a FilterProvider');
  return ctx;
}