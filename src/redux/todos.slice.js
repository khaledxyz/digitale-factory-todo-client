import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../config/axios';
const token = JSON.parse(localStorage.getItem('user'))?.token ?? null;

export const createTodo = createAsyncThunk('todos/create', async ({ token, todo }) => {
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axiosInstance.post('/api/todos', todo, config);
        if (res.data) return res.data;
    } catch (Error) {
        console.log(Error)
    }
});

export const getTodos = createAsyncThunk('todos/get', async (token) => {
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axiosInstance.get('/api/todos', config);
        if (res.data) return res.data;
    } catch (Error) {
        console.log(Error)
    }
});

export const updateTodo = createAsyncThunk('todos/update', async ({ token, id, updatedTodo }) => {
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axiosInstance.patch(`/api/todos/${id}`, updatedTodo, config);
    } catch (Error) {
        console.log(Error)
    }
});

export const reorderTodo = createAsyncThunk('todos/reorder', async ({ activeIndex, overIndex }) => {
    try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axiosInstance.put(`/api/todos/reorder`, { activeIndex, overIndex }, config);
        return { activeIndex, overIndex };
    } catch (Error) {
        console.log(Error)
    }
});

const todosSlice = createSlice({
    name: 'todos',
    initialState: {
        todos: null,
        filteredTodos: null,
        selectedTodo: null
    },
    reducers: {
        setSelectedTodo: (state, action) => { state.selectedTodo = action.payload },
        searchTodos: (state, action) => {
            const query = action.payload.toLowerCase();
            if (query.length < 0) return state.selectedTodo = null;
            state.filteredTodos = state.todos.filter(todo => todo.title.toLowerCase().includes(query));
        }
    },
    extraReducers: builder => {
        builder
            .addCase(createTodo.fulfilled, (state, action) => { state.todos = [...state.todos, action.payload].sort((a, b) => a.position - b.position) })
            .addCase(getTodos.fulfilled, (state, action) => { state.todos = action.payload.sort((a, b) => a.position - b.position) })
            .addCase(reorderTodo.fulfilled, (state, action) => {
                const { activeIndex, overIndex } = action.payload;

                const item = state.todos[activeIndex];
                const increment = overIndex < activeIndex ? -1 : 1;
                for (let i = activeIndex; i !== overIndex; i += increment) {
                    state.todos[i] = state.todos[i + increment];
                    state.todos[i].position = i;
                }
                state.todos[overIndex] = item;
                state.todos[overIndex].position = overIndex;
                state.todos = state.todos.sort((a, b) => a.position - b.position)
            })
    }
});

export const { setSelectedTodo, searchTodos } = todosSlice.actions;
export default todosSlice.reducer;