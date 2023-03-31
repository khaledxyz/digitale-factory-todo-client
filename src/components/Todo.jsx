import { EditOutlined } from '@ant-design/icons';
import { MdDragIndicator } from 'react-icons/md';
import { useSortable } from '@dnd-kit/sortable';
import { Button, Checkbox, Divider } from 'antd';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedTodo, updateTodo } from '../redux/todos.slice';
import { CSS } from '@dnd-kit/utilities';

const Todo = ({ todo, showModal }) => {
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('user'));
    const [checked, setChecked] = useState(todo.finished);

    const handleClick = () => {
        dispatch(setSelectedTodo(todo));
        showModal();
    };

    const toggleChecked = () => {
        setChecked(!checked);
        const updatedTodo = { ...todo, finished: !checked };
        console.log(updatedTodo)
        dispatch(updateTodo({ token: user.token, id: todo._id, updatedTodo }));
    };

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: todo._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        display: 'flex',
        justifyContent: 'space-between',
    };

    const dragIndicatorStyles = {
        opacity: 0.9,
        cursor: 'move',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    return (
        <>
            <div style={style} >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div ref={setNodeRef} {...attributes} {...listeners} style={dragIndicatorStyles}><MdDragIndicator /></div>
                    <Checkbox checked={checked} onClick={toggleChecked} style={{ marginRight: '8px' }}>
                        {todo.title}
                    </Checkbox>
                </div>
                <Button
                    onClick={handleClick}
                    type='dashed'
                    shape='circle'
                    size='small'
                    icon={<EditOutlined style={{ fontSize: '0.7rem' }} />}
                    style={{ zIndex: 100 }}
                />
            </div>
            <Divider />
        </>
    );
};

export default Todo;