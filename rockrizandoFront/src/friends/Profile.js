import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Spin } from 'antd';
import axios from 'axios';
import { useAuthHeader } from 'react-auth-kit';

const UserDetails = () => {
  const { userid } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const authHeader = useAuthHeader()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${userid}`);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    };

    fetchUser();
  }, [userid]);

  const handleFriendRequest = async (friendId) => {
    const data = {
      "friend_id": friendId
    }

    try {
      const response = await axios.post('http://localhost:5000/user/friend/request', data,{
        headers: {
            Authorization: authHeader(),
        },
      });
      console.log(response.data);
      setLoading(false);

    } 
    catch (error) {
      console.log(error);
    }

    console.log(`Sending friend request to user with userid ${friendId}`);
  };

  if (loading) {
    return <Spin />;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  const { email, username, birth_date} = user;

  return (
    
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      
      <Card // eslint-disable-next-line
        cover={<img alt="Profile Picture" src={`http://localhost:5000/files/user/profile_picture_${userid}.jpg`} />}
        style={{ width: 300 }}
      >
        <h2>{username}</h2>
        <p>Email: {email}</p>
        <p>Birth Date: {birth_date}</p>
        <Button type="primary" onClick={() => handleFriendRequest(userid)}>
          Send Friend Request
        </Button>
      </Card>
    </div>
  );
};

export default UserDetails;
