import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Space, message } from 'antd';
import axios from 'axios';
import { useAuthUser, useAuthHeader } from 'react-auth-kit';
import { DeleteOutlined } from '@ant-design/icons';

const UserTicket = () => {
  const { ticketid } = useParams();
  // console.log(ticketid)

  const navigate = useNavigate();
  const [partyData, setPartyData] = useState(null);
  const auth = useAuthUser();
  const authHeader = useAuthHeader();  
  const [loading, setLoading] = useState(true);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/user/${auth().user}/purchases/${partyData.purchase.id}/delete`,
        {
          headers: {
            Authorization: authHeader(),
          },
        }
      );
  
      if (response.status === 200) {
        // Purchase deleted successfully, you might want to navigate the user somewhere or show a confirmation message
        console.log('Purchase deleted successfully');
        message.success('Party Deleted, redirecting...');
        navigate('/')
      }
    } 
    catch (error) {
      message.error('Failed to log in. Please check your credentials and try again.');
      console.error('Error deleting purchase:', error);
    }

    console.log(partyData)
  };

  
  useEffect(() => {

    const fetchParty = async () => {
      try {
        // const party = await axios.get(`http://localhost:5000/party/${partyId}`);

        const purshases = await axios.get(`http://localhost:5000/user/${auth().user}/ticket/${ticketid}`, {
          headers: {
            Authorization: authHeader(),
          }
        });
        
        // console.log(party.data)
        console.log(purshases.data)

        // const tempData = {...party, ...purshases };      
        // const tempData = Object.assign(party.data, purshases.data)     

        setPartyData(purshases.data);
        // console.log(partyData)

        setLoading(false);


      } 
      
      catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchParty();

  // eslint-disable-next-line
  }, [ticketid]);

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
        
        <div style={{ width: '60%', height: 'auto', borderRadius: '8px' }}>
          { }
          <img
            src={`http://localhost:5000/files/ticket/${partyData.purchase.uuid}` || 'https://via.placeholder.com/400x200'} // URL da imagem da festa ou uma imagem de espaço reservado
            alt="Party"
            style={{ width: '60%', height: 'auto', borderRadius: '8px' }}
          />
        </div>


        <div style={{ position: 'relative' }}>
          <p>Nome Na Compra = {partyData.purchase.name}</p>
          <p>Email da Compra = {partyData.purchase.email}</p>
          <p>CPF da Compra = {partyData.purchase.cpf}</p>
          <p>Nome do Tipo de Ingresso = {partyData.ticket.name}</p>
          <p>Descrição do Tipo de Ingresso = {partyData.ticket.description}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <Space>
              <Button danger icon={<DeleteOutlined />} onClick={() => {handleDelete()}}>
                Cancel Purchases
              </Button>
            </Space>
          </div>
      </div>

    </div>
  );
};

export default UserTicket;










// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { useAuthUser, useAuthHeader } from 'react-auth-kit';

// const UserTicket = () => {
//   const { ticketid } = useParams();
//   // console.log(ticketid)

//   const [partyData, setPartyData] = useState(null);
//   const auth = useAuthUser();
//   const authHeader = useAuthHeader();  
//   const [loading, setLoading] = useState(true);

//   const [cancellationMessage, setCancellationMessage] = useState('');

//   const handleCancel = async () => {
    
//     const partyDate = new Date(partyData.ticket.date); 
//     const currentDate = new Date();

//     if (partyDate <= currentDate) {
//       setCancellationMessage("Não é possível cancelar essa festa");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `http://localhost:5000/cancel-ticket/${ticketid}`,
//         {},
//         {
//           headers: {
//             Authorization: authHeader(),
//           },
//         }
//       );

//       setCancellationMessage(response.data.message);
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   useEffect(() => {

//     const fetchParty = async () => {
//       try {
//         // const party = await axios.get(`http://localhost:5000/party/${partyId}`);

//         const purshases = await axios.get(`http://localhost:5000/user/${auth().user}/ticket/${ticketid}`, {
//           headers: {
//             Authorization: authHeader(),
//           }
//         });
        
//         // console.log(party.data)
//         console.log(purshases.data)

//         // const tempData = {...party, ...purshases };      
//         // const tempData = Object.assign(party.data, purshases.data)     

//         setPartyData(purshases.data);
//         // console.log(partyData)

//         setLoading(false);


//       } 
      
//       catch (error) {
//         console.log(error);
//         setLoading(false);
//       }
//     };

//     fetchParty();

//   // eslint-disable-next-line
//   }, [ticketid]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!partyData) {
//     return <div>Party not found.</div>;
//   }

//   return (
//     <div
//       style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         minHeight: '100vh',
//         backgroundColor: '#E6F0F6',
//       }}
//     >
//       <div style={{ width: '800px', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        
//         <div style={{ position: 'relative' }}>
//           { }
//           <img
//             src={`http://localhost:5000/files/ticket/${partyData.purchase.uuid}` || 'https://via.placeholder.com/400x200'} // URL da imagem da festa ou uma imagem de espaço reservado
//             alt="Party"
//             style={{ width: '60%', height: 'auto', borderRadius: '8px' }}
//           />
//         </div>


//         <div style={{ position: 'relative' }}>
//           <p>{partyData.purchase.name}</p>
//           <p>{partyData.purchase.email}</p>
//           <p>{partyData.ticket.name}</p>
//           <p>{partyData.ticket.description}</p>
//         </div>
//         <div style={{ width: '800px', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        
//           {/* ... (existing code) */}
          
//           {cancellationMessage ? (
//             <p>{cancellationMessage}</p>
//           ) : partyData.ticket.date <= new Date() ? (
//             <p>Não é possível cancelar essa festa</p>
//           ) : (
//             <button onClick={handleCancel}>Cancel Purchase</button>
//           )}

//       </div>
//       </div>
//     </div>
//   );
// };

// export default UserTicket;
