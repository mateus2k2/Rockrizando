import React, { useState, useEffect } from 'react';
import { Card, Spin, Input } from 'antd';
import antIcon from '../shared/Spin.js';

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
      // Simulating the fetch request delay with a setTimeout
      setTimeout(() => {
        // Mock response data
        const mockData = [
          {
            id: 1,
            title: 'Card 1',
            description: 'This is the description for Card 1.',
          },
          {
            id: 2,
            title: 'Card 2',
            description: 'This is the description for Card 2.',
          },
          {
            id: 3,
            title: 'Card 3',
            description: 'This is the description for Card 3.',
          },
          {
            id: 4,
            title: 'Card 3',
            description: 'This is the description for Card 3.',
          },
          {
            id: 5,
            title: 'Card 3',
            description: 'This is the description for Card 3.',
          },
          {
            id: 6,
            title: 'Card 3',
            description: 'This is the description for Card 3.',
          },
        ];

        setData(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = event => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
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
              <Card key={item.id} title={item.title} style={{ width: 300 }}>
                <p>{item.description}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
    </React.Fragment>

  );
};

export default Parties;
