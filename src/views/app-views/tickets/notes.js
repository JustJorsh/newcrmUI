import React, { useState, useEffect } from 'react'
import {
  Modal, Card, message
} from 'antd';
import AxiosClient from 'services/AxiosClient';

const NotesModal = ({ initialValues, onClose}) => {

  const fetchNotes = async (id) => {
    message.info("......processing");
    try {
      const client = await AxiosClient();
      const response = await client.get(`customers/freshdesk/conversations/${initialValues?.id}`);
      console.log(response?.data?.data);
      setNote(response?.data?.data);
    } catch (error) {
        console.log(error);
      setNote([])
    }
  }

  const [note, setNote] = useState([]);
  useEffect(() => {
    fetchNotes(initialValues?.id)
  }, [initialValues])

  if (!initialValues) return null



  return (
    <Modal
      title={'Ticket Notes'}
      visible
      closable
      footer={null}
      width={800}
      destroyOnClose
      onCancel={onClose}
    >
      <div className="container">
          <div className="table-responsive">
            {note.length > 0  ? note.map((item, i) => (
                 <div key={i} dangerouslySetInnerHTML={{ __html: item?.body }} />
            ))  : ""}
          </div>
      </div>

    </Modal>
  )
}

export default NotesModal;
