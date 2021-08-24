import React from "react";
import { Drawer, Spin } from "antd";
import day from "dayjs";

export default function DrawerHistoryLog({
  visibleHistoryLog,
  setVisibleHistoryLog,
  logs,
  loading,
}) {
  const onClose = () => {
    setVisibleHistoryLog(false);
  };
  return (
    logs.length > 0 && (
      <Drawer
        width={600}
        title={<p className="title-modal">Lịch sử thay đổi công việc</p>}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visibleHistoryLog}
      >
        {logs.map((record, i) => {
          return (
            <p>
              {day(record.time).format("DD/MM/YYYY HH:mm")} {record.message}
            </p>
          );
        })}
      </Drawer>
    )
  );
}
