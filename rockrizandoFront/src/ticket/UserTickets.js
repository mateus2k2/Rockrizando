import React, { useState, useEffect } from 'react';
import { Card, Spin, Input } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { useAuthHeader, useAuthUser } from 'react-auth-kit';
import antIcon from '../shared/Spin.js';
import axios from 'axios';

const { Search } = Input;

const UserTickets = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const auth = useAuthUser();
  const authHeader = useAuthHeader();

  const { userid, partyid } = useParams();

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      // const response = await axios.get('http://localhost:5000/parties');
      const response = await axios.get(`http://localhost:5000/user/${auth().user}/purchases/${partyid}`,{
                headers: {
                    Authorization: authHeader(),
                },
            });
      console.log(response.data)

      setData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = event => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data.filter(item =>
    item.ticket_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <React.Fragment>
      <h1 className="centerText">{`Ingresso comprados para a festa ${partyid}`}</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>
          <Search
            placeholder="Search parties..."
            allowClear
            onChange={handleSearch}
            style={{ width: 300, marginBottom: 16 }}
          />

          {loading ? (
            <Spin size="large" indicator={antIcon} />
          ) : (
            <div>
              {filteredData.map(item => (
                <Link key={item.purchase} to={`/user/${userid}/ticket/${item.purchase}`}>
                  <Card title={item.ticket_name} style={{ width: 300 }}>
                    <p>{item.ticket_description}</p>
                    <p>{item.purchaseEmail}</p>
                    <p>{item.purchaseName}</p>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default UserTickets;
