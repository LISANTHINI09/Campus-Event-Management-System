import React from 'react';

const DashboardCard = ({ title, value, icon: Icon, subtitle, variant = 'blue' }) => {
  return (
    <div className={`card dashboard-stat-card stat-${variant}`}>
      <div className="stat-card-content">
        <span className="stat-card-title">{title}</span>
        <h3 className="stat-card-value">{value}</h3>
        {subtitle && <p className="stat-card-subtitle">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`stat-card-icon-wrapper icon-bg-${variant}`}>
          <Icon size={24} className={`icon-${variant}`} />
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
