import React from "react";
import {
  CrownTwoTone,
  CloseCircleOutlined,
  CheckOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./user-card.css";
import { Button, Space } from "antd";
import { AVATAR_URL } from "../../constants/apiConfig";

const UserCard = ({
  className,
  handleBlock,
  handleUnblock,
  handleDel,
  user,
  ...props
}) => {
  return (
    <div className={`${className} p-7 user-card rounded`}>
      <div className="user-card__icon">
        {user.avatar ? (
          <img
            className="border-0 rounded-circle h-24 w-24 object-cover"
            src={`${AVATAR_URL}${user.avatar}`}
            alt="avatar"
          />
        ) : (
          <img
            className="border-0 h-24 w-24 object-cover rounded-circle"
            src={`./img/no-avatar.png`}
            alt="avatar"
          />
        )}
      </div>
      <div className="user-card__info">
        <h4 className="font-bold">{user.name}</h4>
        <span>{user.email}</span>
        {user.premium !== 0 ? (
          <span className="ml-2">
            <CrownTwoTone />
          </span>
        ) : (
          ""
        )}
        <div className="mt-4">
          <Space size="middle">
            {user.active ? (
              <Button
                className="bg-gray-700 p-2 flex align-center"
                onClick={(e) => handleBlock(e, user.id)}
              >
                <CloseCircleOutlined className="text-red-600" />
              </Button>
            ) : (
              <Button
                className="bg-gray-700 p-2 flex align-center"
                onClick={(e) => handleUnblock(e, user.id)}
              >
                <CheckOutlined className="text-green-500" />
              </Button>
            )}
            <Button
              className="bg-gray-700 p-2 flex align-center"
              onClick={(e) => handleDel(e, user.id)}
            >
              <DeleteOutlined className="text-red-600" />
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
