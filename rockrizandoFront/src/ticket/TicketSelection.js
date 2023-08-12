//Versão Back end
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthHeader, useAuthUser } from 'react-auth-kit';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Input, Button, Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

const TicketForm = ({ ticketForm, index, onTicketFormChange, onRemoveTicketForm, ticketOptions }) => {
  return (
    <div style={{ backgroundColor: '#f0f0f0', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
      <Form layout="vertical">
        <Form.Item label="Name">
          <Input
            value={ticketForm.name}
            onChange={(e) => onTicketFormChange(index, 'name', e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Email">
          <Input
            value={ticketForm.email}
            onChange={(e) => onTicketFormChange(index, 'email', e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Ticket Type">
          <Select
            value={ticketForm.ticketType}
            onChange={(value) => onTicketFormChange(index, 'ticketType', value)}
          >
            {ticketOptions.map((option) => (
              <Option key={option.name} value={option.name}>
                {option.name} - ${option.price}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>

      {index > 0 && (
        <Button type="danger" icon={<MinusCircleOutlined />} onClick={() => onRemoveTicketForm(index)}>
          Remove
        </Button>
      )}
    </div>
  );
};

const TicketSelection = () => {
  const { partyId } = useParams();
  const history = useNavigate();
  const authHeader = useAuthHeader();
  const auth = useAuthUser();

  const [ticketForms, setTicketForms] = useState([{ name: '', email: '', ticketType: '' }]);
  const [ticketOptions, setTicketOptions] = useState([]);

  useEffect(() => {
    const fetchPartyDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/party/${partyId}`);
        setTicketOptions(response.data.tickets);
      } 
      catch (error) {
        console.log(error);
        // message.error('Error or no purchases found');
        // setLoading(false);
      }
    };

    fetchPartyDetails();
  }, [partyId]);

  const handleTicketFormChange = (index, field, value) => {
    const newTicketForms = [...ticketForms];
    newTicketForms[index][field] = value;
    setTicketForms(newTicketForms);
  };

  const addTicketForm = () => {
    setTicketForms([...ticketForms, { name: '', email: '', ticketType: '' }]);
  };

  const removeTicketForm = (index) => {
    const newTicketForms = [...ticketForms];
    newTicketForms.splice(index, 1);
    setTicketForms(newTicketForms);
  };

  const handleSubmit = async () => {
    const purchases = {
      userID: auth().user,
      partyID: partyId,
      tickets: ticketForms.map((ticketForm) => {
        const ticketOption = ticketOptions.find(
          (option) => option.name === ticketForm.ticketType
        );
        return {
          ticketID: ticketOption ? ticketOption.id : null,
          name: ticketForm.name,
          email: ticketForm.email,
        };
      }),
    };

    // console.log(purchases)

    try {
      await axios.post(`http://localhost:5000/party/${partyId}/buy`, purchases, {
        headers: {
          Authorization: authHeader(),
        },
      });

      history('/');
    } catch (error) {
      console.error('Error purchasing tickets:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '-100vh' }}>
      <div style={{ width: '800px' }}>
        <h1 style={{ textAlign: 'center' }}>Ticket Selection</h1>
        {ticketForms.map((ticketForm, index) => (
          <TicketForm
            key={index}
            ticketForm={ticketForm}
            index={index}
            onTicketFormChange={handleTicketFormChange}
            onRemoveTicketForm={removeTicketForm}
            ticketOptions={ticketOptions}
          />
        ))}

        <Button type="primary" icon={<PlusOutlined />} onClick={addTicketForm}>
          Add Ticket
        </Button>

        <Button type="primary" onClick={handleSubmit}>
          Buy Tickets
        </Button>
      </div>
    </div>
  );
};

export default TicketSelection;
