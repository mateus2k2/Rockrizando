import React from 'react';

const PartyDetails = () => {
  const partyData = {
    id: 1,
    name: 'Festa de Verão',
    description: 'Venha curtir a melhor festa de verão com muita música e diversão!',
    location: 'Praia da Boa Vista, Cidade do Sol',
    organizer: {
      name: 'Organizador da Festa',
      email: 'contato@festadeverao.com',
    },
    tickets: [
      {
        id: 1,
        name: 'Ingresso Padrão',
        description: 'Acesso geral à festa',
        price: 20,
      },
      {
        id: 2,
        name: 'Ingresso VIP',
        description: 'Acesso VIP com área reservada e bebidas especiais',
        price: 50,
      },
    ],
    total_tickets_sold: 100,
    ticket_type_count: [
      {
        ticket_id: 1,
        tickets_sold: 70,
        money_made: 1400,
      },
      {
        ticket_id: 2,
        tickets_sold: 30,
        money_made: 1500,
      },
    ],
    total_money_made: 2900,
  };

    const {
      name,
      description,
      location,
      organizer,
      tickets,
      total_tickets_sold,
      ticket_type_count,
      total_money_made,
    } = partyData;
  
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
            {}
            <img
              src="https://via.placeholder.com/400x200" // URL da imagem 
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
              {name}
            </h2>
          </div>
          <div style={{ marginTop: '20px' }}>
            <h1 style={{ marginBottom: '10px' }}>Party Details</h1>
            <p>{description}</p>
            <p>Location: {location}</p>
            {organizer && (
              <div>
                <p>Owner: {organizer.name}</p>
                <p>Email: {organizer.email}</p>
              </div>
            )}
            <h3>Ticket Types:</h3>
            {tickets.map((ticketType) => (
              <div key={ticketType.id}>
                <h4>{ticketType.name}</h4>
                <p>{ticketType.description}</p>
                <p>Price: ${ticketType.price}</p>
                {}
                {ticket_type_count.map((typeCount) => {
                  if (typeCount.ticket_id === ticketType.id) {
                    return (
                      <p key={typeCount.ticket_id}>
                        Tickets Sold: {typeCount.tickets_sold} (Total Money Made: ${typeCount.money_made})
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            ))}
            <div>
              <h3>Total Tickets Sold: {total_tickets_sold}</h3>
              <h3>Total Money Made: ${total_money_made}</h3>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default PartyDetails;

// // versão com o back funcionado 
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// const PartyDetails = () => {
//   const { partyId } = useParams();
//   const [party, setParty] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchParty = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/party/${partyId}`);
//         console.log(response.data);
//         setParty(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.log(error);
//         setLoading(false);
//       }
//     };

//     fetchParty();
//   }, [partyId]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!party) {
//     return <div>Party not found.</div>;
//   }

//   // Extração dos dados
//   const {
//     total_tickets_sold,
//     ticket_type_count,
//     total_money_made,
//   } = party;

// return (
//   <div
//     style={{
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       minHeight: '100vh',
//       backgroundColor: '#E6F0F6', // Tonalidade de azul
//     }}
//   >
//     <div style={{ width: '800px', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
//       <div style={{ position: 'relative' }}>
//         <img
//           src={`http://localhost:5000/files/party/party_picture_${partyId}.jpg` || 'https://via.placeholder.com/400x200'} // URL da imagem da festa ou uma imagem de espaço reservado
//           alt="Party"
//           style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
//         />
//         <h2
//           style={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             zIndex: 1,
//             backgroundColor: 'rgba(255, 255, 255, 0.7)',
//             padding: '10px 20px',
//             borderRadius: '4px',
//           }}
//         >
//           {name}
//         </h2>
//       </div>
//       <div style={{ marginTop: '20px' }}>
//         <h1 style={{ marginBottom: '10px' }}>Party Details</h1>
//         <p>{description}</p>
//         <p>Location: {location}</p>
//         {organizer && (
//           <div>
//             <p>Owner: {organizer.name}</p>
//             <p>Email: {organizer.email}</p>
//           </div>
//         )}
//         <h3>Ticket Types:</h3>
//         {ticket_type_count.map((typeCount) => (
//           <div key={typeCount.ticket_id}>
//             <h4>Ticket ID: {typeCount.ticket_id}</h4>
//             <p>Tickets Sold: {typeCount.tickets_sold}</p>
//             <p>Total Money Made: ${typeCount.money_made}</p>
//           </div>
//         ))}
//         <div>
//           <h3>Total Tickets Sold: {total_tickets_sold}</h3>
//           <h3>Total Money Made: ${total_money_made}</h3>
//         </div>
//       </div>
//     </div>
//   </div>
// );
// };

// export default PartyDetails;
