import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useIsAuthenticated } from 'react-auth-kit';
import axios from 'axios';

const PartyDetails = () => {
  const { partyId } = useParams();

  const [party, setParty] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    const fetchParty = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/party/${partyId}`);
        // console.log(response.data);
        setParty(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchParty();
  }, [partyId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!party) {
    return <div>Party not found.</div>;
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#E6F0F6', // Tonalidade de azul
      }}
    >
      <div style={{ width: '800px', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <div style={{ position: 'relative' }}>
          <img
            src={`http://localhost:5000/files/party/party_picture_${partyId}.jpg` || 'https://via.placeholder.com/400x200'} // URL da imagem da festa ou uma imagem de espaço reservado
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
            {party.name}
          </h2>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h1 style={{ marginBottom: '10px' }}>Party Details</h1>
          <p>{party.description}</p>
          <p>Location: {party.location}</p>
          {party.organizer && (
            <div>
              <p>Owner: {party.organizer.name}</p>
              <p>Email: {party.organizer.email}</p>
            </div>
          )}
          <h3>Ticket Types:</h3>
          {party.tickets.map((ticketType) => (
            <div key={ticketType.name}>
              <h4>{ticketType.name}</h4>
              <p>{ticketType.description}</p>
              <p>Price: ${ticketType.price}</p>
            </div>
          ))}
          <Link to={`http://localhost:3000/party/${partyId}/buy/`}>
            {isAuthenticated() && <button
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                borderRadius: '4px',
                backgroundColor: '#1890FF', // Tonalidade de azul mais escura
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              Buy Ticket
            </button>}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PartyDetails;


