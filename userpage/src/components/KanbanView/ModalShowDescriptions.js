import React, { useState } from 'react';
import { Modal } from 'antd';

export default function ModalShowDescriptions({description,isModalDescriptionVisible,setIsModalDescriptionVisible}) {

    const handleOk = () => {
        setIsModalDescriptionVisible(false);
    };
  
    const handleCancel = () => {
        setIsModalDescriptionVisible(false);
    };
    return (
        <>
        <Modal title="Mô tả của công việc" visible={isModalDescriptionVisible} onOk={handleOk} onCancel={handleCancel}>
          <p style={{textAlign:"center"}}>{description}</p>
        
        </Modal>
      </>
    )
}
