import React, { useState, useEffect } from 'react';
import { Card, Spin, Input } from 'antd';
import { Link } from 'react-router-dom';
import antIcon from '../shared/Spin.js';
import axios from 'axios';

const { Search } = Input;

const Parties = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/parties');
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
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
      <h1 className="centerText">Parties</h1>
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
                <Link key={item.id} to={`/party/${item.id}`}>
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

export default Parties;
