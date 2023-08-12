import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TicketDetail = () => {
  const { ticketUUID } = useParams();

  const [partyData, setPartyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParty = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/ticket/${ticketUUID}`);
        const ticketDetails = response.data;

        setPartyData(ticketDetails); // Set the party data after fetching
        console.log(ticketDetails);

        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchParty();
  }, [ticketUUID]);

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
          <p>Email da compra = {partyData.PurchaseEmail}</p>
          <p>Nome da compra = {partyData.PurchaseName}</p>
          <p>ID da festa = {partyData.id}</p>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
