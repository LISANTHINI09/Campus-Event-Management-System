import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No Data Available',
  message = 'There are no records to display at this time.',
  actionText,
  onAction,
}) => {
  return (
    <div className="empty-state-card">
      <div className="empty-state-icon-wrapper">
        <Icon size={44} className="empty-state-icon" />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm empty-state-btn">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
