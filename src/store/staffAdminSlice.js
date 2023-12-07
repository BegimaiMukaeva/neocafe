import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const addNewStaffAdmin = createAsyncThunk(
    'staffAdmin/addNewStaffAdmin',
    async (employeeData, {dispatch}) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.post('https://muha-backender.org.kg/admin-panel/employees/create/', employeeData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (response.data) {
                dispatch(fetchStaff());
            }
            return response.data;
        } catch (error) {
            console.error('Ошибка при создании позиции:', error.response.data);
            return null;
        }
    }
);

export const fetchStaff = createAsyncThunk(
    'staffAdmin/fetchStaff',
    async (_, {dispatch}) => {
        try {
            const accessToken = localStorage.getItem('accessToken');

            const branchesResponse = await axios.get('https://muha-backender.org.kg/branches/', {
                headers: { 'accept': 'application/json' }
            });

            if (!branchesResponse.data) {
                console.error('Данные о филиалах отсутствуют');
                return;
            }
            const branchesData = branchesResponse.data;

            const employeesResponse = await axios.get('https://muha-backender.org.kg/admin-panel/employees/', {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
            console.log(employeesResponse.data)
            if (!employeesResponse.data) {
                console.error('Ответ сотрудников пуст');
                return;
            }


            const formattedData = employeesResponse.data.map(employee => {
                console.log('branchId:', employee.branch, 'branchesData:', branchesData);
                return {
                    ...employee,
                    position: convertPosition(employee.position),
                    branchName: getBranchNameById(employee.branch, branchesData),
                    schedule: formatSchedule(employee.schedule.workdays)
                };
            });

            dispatch(setStaffs(formattedData));
        } catch (error) {
            console.error('Ошибка при получении продуктов:', error);
        }
    }
);

function getBranchNameById(branchId, branchesData) {
    const branch = branchesData.find(b => b.id === branchId);
    return branch ? branch.name : 'Неизвестный филиал';
}



const formatSchedule = (workdays) => {
    const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    return workdays
        .filter(day => day.start_time && day.end_time)
        .map(day => dayNames[day.workday - 1])
        .join(', ');
};

const convertPosition = (position) => {
    switch(position) {
        case 'barista': return 'Бармен';
        case 'waiter': return 'Официант';
        default: return position;
    }
};


export const deleteStaffAdmin = createAsyncThunk(
    'staffAdmin/deleteStaffAdmin',
    async (employeeId, { dispatch }) => {
        try {
            const response = await axios.delete(`https://muha-backender.org.kg/admin-panel/employees/destroy/${employeeId}/`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
            });
            if (response.status === 200) {
                console.log("Сотрудник удален:", employeeId);
                dispatch(fetchStaff()); // Загрузка обновленного списка сотрудников
            }
        } catch (error) {
            console.error('Ошибка при удалении сотрудника:', error);
        }
    }
);

export const editStaffAdmin = createAsyncThunk(
    'staffAdmin/editStaffAdmin',
    async ({ employeeId, updatedEmployeeData }, { dispatch }) => {
        try {
            const response = await axios.patch(`https://muha-backender.org.kg/admin-panel/employees/update/${employeeId}/`, updatedEmployeeData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                }
            });
            if (response.status === 200) {
                console.log("Сотрудник обновлен:", employeeId);
                dispatch(fetchStaff()); // Перезагружаем список сотрудников
            }
        } catch (error) {
            console.error('Ошибка при обновлении сотрудника:', error);
        }
    }
);

export const fetchStaffBySearch = createAsyncThunk(
    'staffAdmin/fetchStaffBySearch',
    async (searchTerm, { dispatch }) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get(`https://muha-backender.org.kg/admin-panel/employees/?search=${searchTerm}`, {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка при поиске сотрудников:', error);
        }
    }
);


const staffAdminSlice = createSlice({
    name: 'staffAdmin',
    initialState: [],
    reducers: {
        addStaffAdmin: (state, action) => {
            const newItem = action.payload;
            if (newItem && !state.find(item => item.id === newItem.id)) {
                return [...state, newItem];
            }
            console.log('Состояние после добавления:', state);
            return state;
        },
        setStaffs: (state, action) => {
            return action.payload;
        },
        updateEmployees: (state, action) => {
            return action.payload;
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        }
    }
});

export const { setStaffs, addStaffAdmin, updateEmployees, setSearchTerm} = staffAdminSlice.actions;
export default staffAdminSlice.reducer;


