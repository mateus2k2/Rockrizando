import axios from 'axios';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthHeader } from 'react-auth-kit';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'


import { Upload, Space, Form, Button, Input, Spin, AutoComplete, message, DatePicker } from 'antd';
import antIcon from '../shared/Spin.js'

import { validatePasswordPromise, validadeEmailPromise, validatePassword, validadeEmail } from '../shared/Validators.js'

const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e?.fileList;
};

const NewParty = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { TextArea } = Input;
    const [form] = Form.useForm()
    const [addressOptions, setAddressOptions] = useState([]);
    const [fileList, setFileList] = useState([]);
    const authHeader = useAuthHeader()

    const handleAddressSearch = value => {
        const API_KEY = 'pk.eyJ1IjoibWF0ZXVzMmsyIiwiYSI6ImNsYmd4ZmV3MzA2ZTkzd2xjMDgzdWR2ejYifQ.RudfKTpz0CtaADWcoei8WA';
        const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            value
        )}.json?access_token=${API_KEY}&autocomplete=true`;

        axios
            .get(endpoint)
            .then(response => {
                const features = response.data.features;
                const suggestions = features.map(feature => feature.place_name);
                setAddressOptions(suggestions);
            })
            .catch(error => {
                console.error('Error fetching address suggestions:', error);
            });
    };

    const handleAddressSelect = value => {
        console.log('Selected address:', value);
    };

    // Handle form submission
    const onFinish = async (values) => {
        const partyDate = values.partyDate; // Assuming values.partyDate is a valid datetime object
        const formattedPartyDate = `${partyDate['$D'].toString().padStart(2, '0')}-${(partyDate['$M'] + 1).toString().padStart(2, '0')}-${partyDate['$y']}`;

        const partyData = {
            location: values.address,
            description: values.description,
            name: values.name,
            party_date: formattedPartyDate,
            ticket_type: values.ticketType,
        };

        const formData = new FormData();
        formData.append('party_picture', fileList[0].originFileObj);
        formData.append('name', values.name);

        try {
            setLoading(true)
            await axios.post('http://localhost:5000/newPartyData', partyData, {
                headers: {
                    Authorization: authHeader(),
                },
            });

            await axios.post('http://localhost:5000/newPartyPicture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: authHeader(),
                },
            });

            // console.log(responseData.data)
            // console.log(responsePicture)
            message.success('Party Added! Redirecting...');
            navigate('/');
        }
        catch (error) {
            setLoading(false)
            console.error('Add Party failed:', error);
            message.error('Failed to add party.');
            return false;
        }

    };

    // Handle form submission errors
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);

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

    return (

        <React.Fragment>


            <div className="center">
                <h1 className="centerText">NewParty</h1>
                <Form
                    name="createParty"
                    labelCol={{
                        span: 6,
                    }}
                    wrapperCol={{
                        span: 18,
                    }}
                    style={{
                        maxWidth: 800,
                        margin: '0 auto',
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="on"
                    form={form}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input a name For the party!',
                            },
                            { validator: validadeEmailPromise },
                        ]}
                    >
                        <Input />

                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: 'Please input a description for the party!',
                            },
                            { validator: validatePasswordPromise },
                        ]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        label="Party Date"
                        name="partyDate"
                        rules={[
                            {
                                required: true,
                                message: 'Please input a date for the Party!',
                            },
                            { validator: validatePasswordPromise },
                        ]}
                    >
                        <DatePicker />
                    </Form.Item>

                    <Form.Item name="address" label="Address">
                        <AutoComplete
                            options={addressOptions.map(address => ({ value: address }))}
                            onSearch={handleAddressSearch}
                            onSelect={handleAddressSelect}
                            placeholder="Type an address"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Ticket Type"
                        name="ticketTypeFormItem"
                    >

                        <Form.List
                            name="ticketType"
                            initialValue={[
                                { description: "", name: "", price: "" },
                            ]}
                            rules={[
                                {
                                    validator: async (_, fields) => {
                                        if (fields.length >= 6 || fields.length < 1) {
                                            console.log(fields)
                                            return Promise.reject(new Error("Exceeded maximum or minimum of field. (Max is 7 and Min is 1)"));
                                        }
                                    },
                                },
                            ]}
                        >
                            {(fields, { add, remove }) => {
                                return (
                                    <div>
                                        {fields.map(field => (
                                            <Space
                                                key={field.key + 1}
                                                style={{ display: 'flex', marginBottom: 11 }}
                                                align="start"
                                            >
                                                {/* Name */}
                                                <Form.Item
                                                    noStyle
                                                    {...field}
                                                    name={[field.name, 'name']}
                                                    rules={[{ required: true, message: 'Missing Name' }]}
                                                    key={field.key + 2}
                                                >
                                                    <Input placeholder="Name" />
                                                </Form.Item>

                                                {/* Price */}
                                                <Form.Item
                                                    noStyle
                                                    {...field}
                                                    name={[field.name, 'price']}
                                                    rules={[{ required: true, message: 'Missing Price' }]}
                                                    key={field.key + 3}
                                                >
                                                    <Input placeholder="Price" />
                                                </Form.Item>

                                                {/* Description */}
                                                <Form.Item
                                                    noStyle
                                                    {...field}
                                                    name={[field.name, 'description']}
                                                    rules={[{ required: true, message: 'Missing Description' }]}
                                                    key={field.key + 4}
                                                >
                                                    {/* <Input placeholder="Description" /> */}
                                                    <TextArea rows={4} placeholder="Description" />
                                                </Form.Item>

                                                <MinusCircleOutlined
                                                    onClick={() => {
                                                        remove(field.name)
                                                    }}
                                                />
                                            </Space>
                                        ))}

                                        <Form.Item>
                                            <Button
                                                type="dashed"
                                                onClick={() => {
                                                    add()
                                                }}
                                                block
                                            >
                                                <PlusOutlined /> Add Ticket Type
                                            </Button>
                                        </Form.Item>
                                    </div>
                                )
                            }}
                        </Form.List>
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


                    <Form.Item
                        shouldUpdate
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        {({ getFieldsValue }) => {
                            const { email, password } = getFieldsValue();
                            const formIsComplete = validadeEmail(email) && validatePassword(password);

                            return (
                                <React.Fragment>
                                    <Button type="primary" htmlType="submit" disabled={!formIsComplete}>
                                        Log In
                                    </Button>

                                    {loading && (
                                        <div style={{ marginTop: '10px' }}>
                                            <Spin indicator={antIcon} />
                                        </div>
                                    )}

                                </React.Fragment>
                            );
                        }}
                    </Form.Item>

                </Form>
            </div>
        </React.Fragment>
    );

}

export default NewParty