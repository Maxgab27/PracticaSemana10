import React from 'react';

interface CustomerSearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedSegment: number | 'todos';
  onSegmentChange: (value: number | 'todos') => void;
  availableSegments: number[];
}

export const CustomerSearchFilter: React.FC<CustomerSearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedSegment,
  onSegmentChange,
  availableSegments
}) => {
  return (
    <div className="filter-bar">
      <div className="filter-input-wrap">
        <input
          type="text"
          className="form-input"
          placeholder="Buscar por código o nombre..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filter-select-wrap">
        <label className="filter-label">Filtrar por Segmento:</label>
        <select
          className="form-select"
          value={selectedSegment}
          onChange={(e) =>
            onSegmentChange(e.target.value === 'todos' ? 'todos' : Number(e.target.value))
          }
        >
          <option value="todos">Todos los segmentos</option>
          {availableSegments.map((s) => (
            <option key={s} value={s}>
              Segmento #{s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
