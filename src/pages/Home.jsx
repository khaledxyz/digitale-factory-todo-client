import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { createTodo, getTodos, setSelectedTodo, updateTodo, reorderTodo, searchTodos } from '../redux/todos.slice';

import moment from 'moment';

import { Card, Space, Input, Button, Modal, Form, DatePicker, Divider, Checkbox, Select } from 'antd';
import { LogoutOutlined, PlusOutlined } from '@ant-design/icons';

import Todo from '../components/Todo';
import SubTodo from '../components/SubTodo';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { closestCenter, DndContext } from '@dnd-kit/core';

const Home = () => {
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('user'));
    const { todos, filteredTodos, selectedTodo } = useSelector(state => state.todos);

    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { TextArea } = Input;

    const handleLogout = () => {
        localStorage.clear('user');
        navigate('/login');
    };

    const handleSearch = (e) => {
        dispatch(searchTodos(e.target.value));
    };

    useEffect(() => {
        if (!user) return navigate('/login');
        dispatch(getTodos(user.token));
    }, []);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!selectedTodo) return form.setFieldsValue({ title: '', description: '', endDate: '', embeddedTodos: [] });
        form.setFieldsValue({
            title: selectedTodo.title,
            description: selectedTodo.description,
            endDate: endDate && moment(selectedTodo.endDate),
            embeddedTodos: selectedTodo.embeddedTodos
        });
    }, [selectedTodo]);

    const showModal = () => {
        if (!selectedTodo) form.setFieldsValue({ title: '', description: '', endDate: '', embeddedTodos: [] });
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
        dispatch(setSelectedTodo(null));
    };

    const handleSubmit = ({ title, description, endDate, embeddedTodos }) => {

        const todo = {
            title,
            description,
            endDate: new Date(endDate),
            embeddedTodos
        };

        if (selectedTodo) {
            const updatedTodo = { ...selectedTodo, title, description, endDate };
            dispatch(updateTodo({ token: user.token, id: selectedTodo._id, updatedTodo }));
            return;
        };

        dispatch(createTodo({ token: user.token, todo }));
        setOpen(false);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const activeIndex = todos.findIndex((todo) => todo._id === active.id);
            const overIndex = todos.findIndex((todo) => todo._id === over.id);

            dispatch(reorderTodo({ activeIndex, overIndex }))
        };
    };

    return (
        <>
            <Card title='Todo' bordered={false} >
                <Space direction='vertical' size={20}>
                    <Space>
                        <Input placeholder='Search...' onChange={(e) => handleSearch(e)} />
                        <Button onClick={showModal} type='primary' icon={<PlusOutlined />}>Add Todo</Button>
                    </Space>
                    <DndContext
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >

                        <Space direction='vertical' style={{ width: '100%' }}>{todos &&
                            <SortableContext items={todos.map((todo) => todo._id)} strategy={verticalListSortingStrategy}>
                                {!filteredTodos && todos.map((todo) => <Todo key={todo._id} todo={todo} showModal={showModal} />)}
                                {filteredTodos && filteredTodos.map((todo) => <Todo key={todo._id} todo={todo} showModal={showModal} />)}
                            </SortableContext>
                        }</Space>
                    </DndContext>
                </Space>

                <Modal
                    title='New Todo'
                    open={open}
                    onOk={form.submit}
                    onCancel={handleCancel}
                    okText={selectedTodo ? 'Update Todo' : 'Create Todo'}
                >
                    <Form form={form} onFinish={handleSubmit} >
                        <Form.Item name='title' rules={[{ required: true, message: 'Please enter a title!' }]}>
                            <Input placeholder='Title' />
                        </Form.Item>

                        <Form.Item name='description'>
                            <TextArea placeholder='Description' />
                        </Form.Item>

                        <Form.Item name='endDate' label='End Date'>
                            <DatePicker />
                        </Form.Item>
                        <Divider />
                        <p className='ant-modal-title'>Embedded Todos</p>
                        <br />
                        <Form.List name="embeddedTodos">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field) => (
                                        <div key={field.key} style={{ display: 'flex', flexDirection: 'column' }}>
                                            <SubTodo field={field} remove={remove} />
                                        </div>
                                    ))}

                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Add Embedded Todo
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Form>
                </Modal>
            </Card>
            <br />
            <Button block icon={<LogoutOutlined />} onClick={handleLogout}>Log Out</Button>
        </>
    );
};

export default Home;