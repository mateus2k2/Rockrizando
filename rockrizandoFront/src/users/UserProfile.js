import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';
import { useAuthUser, useAuthHeader } from 'react-auth-kit';
import { PlusOutlined } from '@ant-design/icons'
import axios from 'axios';
import { Form, Input, Button, Upload, message } from 'antd';

const UserProfile = () => {
  const [fileList, setFileList] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const navigate = useNavigate();

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
      // console.log(response.data)
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

  const handleSaveClick = async () => {
    setIsEditMode(false);
    console.log(fileList[0].originFileObj);
    console.log(name)
    console.log(email)
    console.log(password)
    console.log(auth().user)

    const formData = new FormData();
    formData.append('profile_picture', fileList[0].originFileObj);
    formData.append('username', name);
    formData.append('email', email);
    formData.append('password', password);

    try {
      // setLoading(true); 

      await axios.patch(`http://localhost:5000/user/${auth().user}/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: authHeader(),
        },
      });

      message.success('User Updated! Redirecting...');
      navigate('/');
    } 
    
    catch (error) {
      // setLoading(false);
      message.error('Failed to User Update.');
      return false;
    }
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
        <h1>{/* {name} */}</h1>
      </div>
      {isEditMode ? (
        <Form>
          <Form.Item label="Name">
            <Input /* value={name} */ onChange={handleNameChange} />
          </Form.Item>
          <Form.Item label="Email">
            <Input type="email" /* value={email} */ onChange={handleEmailChange} />
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password /* value={password} */ onChange={handlePasswordChange} />
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
