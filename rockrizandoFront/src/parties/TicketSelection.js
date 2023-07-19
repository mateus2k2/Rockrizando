import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TicketSelection = () => {
  const { partyId } = useParams();
  // const history = useHistory();

  const [ticketType, setTicketType] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  const handleTicketTypeChange = event => {
    setTicketType(event.target.value);
  };

  const handleQuantityChange = event => {
    setQuantity(Number(event.target.value));
  };

  const handlePurchase = async () => {
    setLoading(true);

    try {

      const purchaseData = {
        partyId: partyId,
        ticketType: ticketType,
        quantity: quantity,
      };

      await axios.post('http://localhost:5000/purchase', purchaseData);

      setLoading(false);
      setPurchaseComplete(true);
      // history.push('/success');

    } catch (error) {
      console.error('Error purchasing ticket:', error);
      setLoading(false);

    }
  };

  return (
    <div>
      <h1>Ticket Selection</h1>
      <div>
        <label>
          Ticket Type:
          <select value={ticketType} onChange={handleTicketTypeChange}>
            <option value="">Select a ticket type</option>
            <option value="standard">Standard</option>
            <option value="vip">VIP</option>
            <option value="premium">Premium</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Quantity:
          <input type="number" value={quantity} onChange={handleQuantityChange} />
        </label>
      </div>
      <button onClick={handlePurchase} disabled={!ticketType || quantity <= 0 || loading}>
        {loading ? 'Processing...' : 'Buy Tickets'}
      </button>
      {purchaseComplete && <p>Purchase complete!</p>}
    </div>
  );
};
export default TicketSelection;
