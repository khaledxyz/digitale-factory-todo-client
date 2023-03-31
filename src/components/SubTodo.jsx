import { MinusCircleOutlined } from "@ant-design/icons";
import { Checkbox, Form, Input, Space } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTodo } from "../redux/todos.slice";

const SubTodo = ({ field, remove }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const dispatch = useDispatch();
    const [checked, setChecked] = useState(true);
    const { selectedTodo } = useSelector(state => state.todos);

    const toggleChecked = () => {
        setChecked(!checked);
        if (!selectedTodo) return;
        const updatedTodo = {
            ...selectedTodo,
            embeddedTodos: selectedTodo.embeddedTodos.map((todo) => ({
                ...todo,
                checked: !checked,
            })),
        };

        dispatch(updateTodo({ token: user.token, id: selectedTodo._id, updatedTodo }));
    };

    return (
        <Space align="baseline">
            <Form.Item
                noStyle
                shouldUpdate={() => { }}
            >
                {() => (
                    <Form.Item {...field} name={[field.name, 'checked']} valuePropName='checked' >
                        <Checkbox checked={checked} onClick={toggleChecked} />
                    </Form.Item>
                )}
            </Form.Item>
            <Form.Item
                {...field}
                name={[field.name, 'title']}
                rules={[{ required: true, message: 'Please enter an embedded todo!' },]}
            >
                <Input placeholder='Embedded Todo' />
            </Form.Item>

            <MinusCircleOutlined onClick={() => remove(field.name)} />
        </Space>
    );
};

export default SubTodo;