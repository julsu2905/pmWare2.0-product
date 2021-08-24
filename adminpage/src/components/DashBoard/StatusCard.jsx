import React from "react";

import "../component-css/statuscard.css";

const StatusCard = ({ className, ...props }) => {
    return (
        <div className={`${className} status-card`}>
            <div className="status-card__icon">
                <i>{props.icon}</i>
            </div>
            <div className="status-card__info text-gray-400">
                <h4 className="text-gray-400">{props.count}</h4>
                <span>{props.title}</span>
            </div>
        </div>
    );
};

export default StatusCard;
