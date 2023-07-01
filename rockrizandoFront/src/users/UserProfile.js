import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import { useAuthUser, useAuthHeader } from 'react-auth-kit';
import { PlusOutlined } from '@ant-design/icons'
import axios from 'axios';
import { Form, Input, Button, Upload, message } from 'antd';

const UserProfile = () => {
  const [fileList, setFileList] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [password, setPassword] = useState('');
  const auth = useAuthUser();
  const authHeader = useAuthHeader();

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const beforeUpload = (file) => {
    if (fileList.length >= 1) {
      message.error('You can only upload one file');
      return false;
    }
    else {
      setFileList([file]);
    }
    return false;
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  useEffect(() => {
    // Fetch initial user information from the backend
    fetchUserInfo();
  });

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/user/${auth().user}`, {
        headers: {
          Authorization: authHeader(),
        },
      });
      const userData = response.data;
      setName(userData.username);
      setEmail(userData.email);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleSaveClick = () => {
    setIsEditMode(false);
    // Logic to save the changes made by the user
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
    // Logic to cancel the changes
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-picture">
          {/* Render the profile picture here */}
          <img src={`http://localhost:5000/files/user/profile_picture_${auth().user}.jpg`} alt="Profile" />
        </div>
        <h1>{name}</h1>
      </div>
      {isEditMode ? (
        <Form>
          <Form.Item label="Name">
            <Input value={name} onChange={handleNameChange} />
          </Form.Item>
          <Form.Item label="Email">
            <Input type="email" value={email} onChange={handleEmailChange} />
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password value={password} onChange={handlePasswordChange} />
          </Form.Item>

          <Form.Item name="upload" label="Upload" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload
              action=""
              listType="picture-card"
              beforeUpload={beforeUpload}
              fileList={fileList}
              onChange={handleChange}
              accept=".png,.jpg,.jpeg"
              multiple={false}>
              {fileList.length === 0 ? (
                <div>
                  <PlusOutlined />
                  <div
                    style={{
                      marginTop: 8,
                    }}
                  >
                    Upload
                  </div>
                </div>
              ) : null}

            </Upload>
          </Form.Item>

          <div className="edit-buttons">
            <Button type="primary" onClick={handleSaveClick}>
              Save
            </Button>
            <Button onClick={handleCancelClick}>Cancel</Button>
          </div>
        </Form>
      ) : (
        <Button onClick={handleEditClick}>Edit</Button>
      )}
    </div>
  );
};

export default UserProfile;
