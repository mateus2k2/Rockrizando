import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// import axios from 'axios';

const PartyDetails = () => {
  const { partyId } = useParams();
  console.log(partyId)

  const [party, setParty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const fetchParty = async () => {
    //   try {
    //     const response = await axios.get(`http://localhost:5000/parties/${partyId}`);
    //     setParty(response.data);
    //     setLoading(false);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    // fetchParty();

    const MACK_DATA = {
      id: 1,
      name: 'Party 1',
      description: 'This is the first party',
    }
    setParty(MACK_DATA);
    
  }, []);

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
