import React from "react";
import "./price-card.css";
import Avatar from "antd/lib/avatar/avatar";

const PriceCard = ({ className, price, ...props }) => {
  return (
    <div className={`${className} p-7 price-card rounded`}>
      <div className="price-card__icon">
        <Avatar gap={10} size={40}>{price.name}</Avatar>
      </div>
      <div className="price-card__info">
        <div>
          {price.price} {price.currency}
        </div>
        <div>
          {price.lastModified} by {price.modifiedBy}
        </div>
      </div>
    </div>
  );
};

export default PriceCard;
