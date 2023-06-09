import React, { useState, useEffect, useRef } from 'react';
import { Button, Table, Input, Modal, Radio, Tag, Popconfirm, message, Form } from 'antd';
import type { InputRef, RadioChangeEvent } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    DeleteOutlined,
    EditOutlined
} from '@ant-design/icons';
import { regUserList, reqDeleteUserList, reqSelectUser, reqHandleUser } from '../../api'
import './index.css'
import { nanoid } from 'nanoid';
import { useHistory } from 'react-router-dom';



interface DataType {
    id: string;
    name: string;
    phone: string;
    age?: number;
    gender: boolean;
}


const User: React.FC = () => {
    const history = useHistory();
    const idref = useRef<InputRef>(null)
    const nameref = useRef<InputRef>(null)
    const phoneref = useRef<InputRef>(null)
    const [gender, setGender] = useState(true)
    const [userlist, setUserList] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userId, setUserID] = useState("")
    const [form] = Form.useForm();

    //添加员工
    const addUser = () => {
        form.setFieldValue("name", "")
        form.setFieldValue("gender", true)
        form.setFieldValue("phone", "")
        setUserID("")
        setIsModalOpen(true);
    };
    //Modal确认
    const handleOk = () => {
        form.validateFields().then(async (values) => {
            const res = await reqHandleUser(
                {
                    id: userId,
                    name: nameref.current?.input?.value,
                    gender,
                    phone: phoneref.current?.input?.value
                })
            setUserList(res.data)
            setIsModalOpen(false)
        }).catch(() => {
            message.error('请检查用户信息')
            setIsModalOpen(true)
        })
    }

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        //请求员工信息
        (async () => {
            let result = await regUserList()
            setUserList(result.data.userList)
        })()
        history.replace('/user')
    }, [])

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };

    //表格信息
    const columns: ColumnsType<DataType> = [
        {
            title: '工号',
            key: 'id',
            align: 'center',
            dataIndex: 'id',
        },
        {
            title: '姓名',
            align: 'center',
            key: 'name',
            dataIndex: 'name',
        },
        {
            title: '联系方式',
            align: 'center',
            key: 'phone',
            dataIndex: 'phone',
        },
        {
            title: '性别',
            key: 'gender',
            dataIndex: 'gender',
            render: (_, { gender }) => (
                <>
                    <Tag color={gender ? 'blue' : 'red'} >
                        {gender ? '男' : '女'}
                    </Tag>
                </>
            ),
        },
        {
            title: '操作',
            align: 'center',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => (
                <>
                    <EditOutlined onClick={editUserInfo(record)} />
                    <Popconfirm
                        title="确定删除吗"
                        // description="Are you sure to delete this task?"
                        okText="是"
                        cancelText="否"
                        onConfirm={() => confirm(record)}
                        onCancel={cancel}
                    >
                        <DeleteOutlined style={{ fontSize: '15px', padding: '0 10px' }} />
                    </Popconfirm>

                </>
            ),
        },
    ];

    const confirm = async (record: DataType) => {
        const result = await reqDeleteUserList({ keylist: [record.id] })
        //删除后更新页面
        setUserList(result.data)
        message.success('删除成功');
    };

    const cancel = (e: any) => {
        console.log(e);
        message.error('取消删除');
    };
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    // 批量删除
    const deleteSelectedUser = async () => {
        const result = await reqDeleteUserList({ keylist: selectedRowKeys })
        //删除后更新页面
        setUserList(result.data)
        selectedRowKeys.length ? message.success('Click on Yes') : message.error('No Selected Data')
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    //查找员工信息
    const findUser = async () => {
        const id = idref.current?.input?.value
        history.push(`/user?id=${id}`)
        const result = await reqSelectUser({ id })
        //查询后更新页面
        setUserList(result.data)
    }
    //修改员工信息
    const editUserInfo = (record: DataType) => {
        return async () => {
            const { name, gender, phone } = record
            setGender(gender)
            setUserID(record.id)
            form.setFieldValue("name", name)
            form.setFieldValue("gender", gender)
            form.setFieldValue("phone", phone)
            setIsModalOpen(true)
        }
    }

    const onChange = (e: RadioChangeEvent) => {
        setGender(e.target.value)
    }

    return (
        <div>
            <div className="user-head">
                <div>
                    工号<Input ref={idref} style={{ width: '60%' }} />
                    <Button onClick={findUser}>查询</Button>
                </div>
                <div>
                    <Button type="primary" onClick={addUser}>添加员工</Button>
                    <Popconfirm
                        title="确定删除吗"
                        okText="是"
                        cancelText="否"
                        onConfirm={deleteSelectedUser}
                        onCancel={cancel}
                    >
                        <Button type="primary">删除选中</Button>
                    </Popconfirm>


                </div>
            </div>
            <Table rowSelection={rowSelection} columns={columns} rowKey="id" dataSource={userlist} />
            <Modal title="用户信息" className='edit-modal'
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form
                    autoComplete='off'
                    {...formItemLayout}
                    form={form}
                    style={{ maxWidth: 600 }}
                    scrollToFirstError
                >
                    <Form.Item
                        name="name"
                        label="姓名"
                        shouldUpdate
                        rules={[{ required: true, message: '请输入姓名!', whitespace: true },
                        ]}
                        key={nanoid()}
                    >
                        <Input ref={nameref} />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="联系方式"
                        shouldUpdate
                        // validateTrigger='onBlur'
                        rules={[{ required: true, message: '请输入联系方式!' },
                        {
                            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                            message: '请输入正确的手机号'
                        }]}
                    >
                        <Input style={{ width: '100%' }} ref={phoneref} key={userId} />
                    </Form.Item>
                    <Form.Item
                        name="gender"
                        label="性别"
                        shouldUpdate
                    >
                        <Radio.Group name="gendergroup" onChange={onChange} key={userId} >
                            <Radio value={true}>男</Radio>
                            <Radio value={false}>女</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>
        </div >
    );
};

export default User;