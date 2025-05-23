import React from 'react';
import { Modal } from 'antd';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ViewDetailsModal = ({ initialValues, onClose }) => {
  if (!initialValues) return null;

  return (
    <Modal
      title="Data"
      open // updated from "visible" (deprecated in AntD v4+)
      closable
      footer={null}
      width={600}
      destroyOnClose
      onCancel={onClose}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            {initialValues && (
              <SyntaxHighlighter
                className="hl-code"
                style={atomDark}
                language="json"
              >
                {JSON.stringify(initialValues, null, 4)}
              </SyntaxHighlighter>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewDetailsModal;
