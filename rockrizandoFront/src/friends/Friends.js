import React, { useState, useEffect } from 'react';
import { Card, Spin, Input } from 'antd';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import antIcon from '../shared/Spin.js';
import { useAuthHeader } from 'react-auth-kit';
import axios from 'axios';

const { Search } = Input;

const Friends = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const authHeader = useAuthHeader()

  useEffect(() => {
    fetchData();
  });

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/user/friends', {
        headers: {
            Authorization: authHeader(),
        },
      });
      setData(response.data.friends);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = event => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data.filter(item =>
    item.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <React.Fragment>
      <h1 className="centerText">My Frinds</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>
          <Search
            placeholder="Search People..."
            allowClear
            onChange={handleSearch}
            style={{ width: 300, marginBottom: 16 }}
          />

          {loading ? (
            <Spin size="large" indicator={antIcon} />
          ) : (
            <div>
              {filteredData.map(item => (
                <Link key={item.id} to={`/user/${item.id}/profile/`}>
                  <Card title={item.username} style={{ width: 300 }}>
                    <p>{item.email}</p>
                    <p>{item.username}</p>
                    <p>{item.birth_date}</p>
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

export default Friends;
