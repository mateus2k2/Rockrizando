import React, { useEffect, useState } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import { useAuthUser, useAuthHeader } from 'react-auth-kit';
import { Button, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const PartyDetails = () => {
  const { userid, partyId } = useParams();

  const [partyData, setPartyData] = useState(null);
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const handleDelete = async () => {
    try {
      let response = await axios.delete(`http://localhost:5000/user/${userid}/party/${partyId}/delete`, {
        headers: {
          Authorization: authHeader(),
        },
      });
      console.log(response)
      navigate('/');
    } 
    catch (error) {
      console.log(error);
    }
  };


  const handleEdit = async () => {
    navigate(`/user/${userid}/party/${partyId}/update`);
  };

  useEffect(() => {

    const fetchParty = async () => {
      try {
        const party = await axios.get(`http://localhost:5000/party/${partyId}`);

        const purshases = await axios.get(`http://localhost:5000/user/${auth().user}/parties/${partyId}`, {
          headers: {
            Authorization: authHeader(),
          }
        });

        console.log(party.data)
        console.log(purshases.data)

        // const tempData = {...party, ...purshases };      
        const tempData = Object.assign(party.data, purshases.data)

        setPartyData(tempData);
        console.log(partyData)
        setLoading(false);


      }

      catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchParty();

    // eslint-disable-next-line
  }, [partyId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!partyData) {
    return <div>Party not found.</div>;
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#E6F0F6',
      }}
    >
      <div style={{ width: '800px', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <div style={{ position: 'relative' }}>
          { }
          <img
            src={`http://localhost:5000/files/party/party_picture_${partyId}.jpg` || 'https://via.placeholder.com/400x200'} // URL da imagem da festa ou uma imagem de espaço reservado
            // src="https://via.placeholder.com/400x200" // URL da imagem 
            alt="Party"
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
          />
          <h2
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              padding: '10px 20px',
              borderRadius: '4px',
            }}
          >
            {partyData.name}
          </h2>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h1 style={{ marginBottom: '10px' }}>Party Details</h1>
          <p>{partyData.description}</p>
          <p>Location: {partyData.location}</p>
          {partyData.organizer && (
            <div>
              <p>Owner: {partyData.organizer.name}</p>
              <p>Email: {partyData.organizer.email}</p>
            </div>
          )}
          <h3>Ticket Types:</h3>
          {partyData.tickets.map((ticketType) => (
            <div key={ticketType.id}>
              <h4>{ticketType.name}</h4>
              <p>{ticketType.description}</p>
              <p>Price: ${ticketType.price}</p>
              { }
              {partyData.ticket_type_count.map((typeCount) => {
                if (typeCount.ticket_id === ticketType.id) {
                  return (
                    <p key={typeCount.ticket_id}>
                      Tickets Sold: {typeCount.tickets_sold} (Total Money Made: ${typeCount.money_made})
                    </p>
                  );
                  
                }
                else{
                  return (
                    <p key={typeCount.ticket_id}>
                      Tickets Sold: 0 (Total Money Made: $0.00)
                    </p>
                  );
                  
                }
                // return null;
              })}
            </div>
          ))}
          

        <div>
          <h3>Total Tickets Sold: {partyData.total_tickets_sold}</h3>
          <h3>Total Money Made: ${partyData.total_money_made}</h3>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <Space>
              <Button type="primary" icon={<EditOutlined />} onClick={() => {handleEdit()}}>
                Edit Party
              </Button>
              <Button danger icon={<DeleteOutlined />} onClick={() => {handleDelete()}}>
                Delete Party
              </Button>
            </Space>
          </div>

    </div>
    </div >
  );
};

export default PartyDetails;
