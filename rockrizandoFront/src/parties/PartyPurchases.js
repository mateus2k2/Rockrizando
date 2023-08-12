import React, { useState, useEffect } from 'react';
import { Card, Spin, Input, message } from 'antd';
import { Link, useParams } from 'react-router-dom';
import { useAuthHeader, useAuthUser } from 'react-auth-kit';
import antIcon from '../shared/Spin.js';
import axios from 'axios';

const { Search } = Input;

const PartyPurchases = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const auth = useAuthUser();
  const authHeader = useAuthHeader();

  const { userid } = useParams();

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      // const response = await axios.get('http://localhost:5000/parties');
      const response = await axios.get(`http://localhost:5000/user/${auth().user}/purchases`,{
                headers: {
                    Authorization: authHeader(),
                },
            });
      setData(response.data['parties']);
      console.log(response.data)

      setLoading(false);
    } catch (error) {
      console.log(error);
      message.error('Error or no purchases found');
      setLoading(false);
    }
  };

  const handleSearch = event => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <React.Fragment>
      <h1 className="centerText">Suas Festas Compradas</h1>
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
                <Link key={item.id} to={`/user/${userid}/purchases/${item.id}`}>
                  <Card title={item.name} style={{ width: 300 }}>
                    <p>{item.description}</p>
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

export default PartyPurchases;
