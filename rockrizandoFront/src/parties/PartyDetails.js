import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PartyDetails = ({ match }) => {
  const [party, setParty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParty = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/Parties/${match.params.id}`);
        setParty(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchParty();
  }, [match.params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Party Details</h1>
      <h2>{party.name}</h2>
      <p>Description: {party.description}</p>
      <p>Location: {party.location}</p>
      {/* ... other party details ... */}
    </div>
  );
};

export default PartyDetails;
