import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';
import StudentPage from '../pages/student/StudentPage';

const BASE_URL = 'http://localhost:8080/api/v1';

export const getAlll = createAsyncThunk("student/getAll", async ({ currentPage, limit }, thunkAPI) => {
    const url = BASE_URL + `/student/list?page=${currentPage}&size=${limit}`;
    try {
        const response = await axios.get(url);
        return response.data;
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.response.data); // Trả về lỗi nếu có
    }
});

// Hàm xóa sinh viên
export const deleteStudent = createAsyncThunk(
    'student/deleteStudent',
    async (studentId, thunkAPI) => {
        const url = `${BASE_URL}/student/${studentId}`;
        try {
           const respone= await axios.delete(url);
            return respone.data; // Trả về ID của sinh viên đã xóa
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response ? error.response.data : { message: 'Network error' });
        }
    }
);

//thêm sinh viên
export const addStudent = createAsyncThunk("student/addStudent", async ( student , thunkAPI) => {
    const url = BASE_URL + `/student`;
    try {
        console.log(student)
        const response = await axios.post(url, student);
        return response.data;
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.response.data); // Trả về lỗi nếu có
    }
});
//sửa
export const editStudent= createAsyncThunk('student/editProduct', async ({id,student},thunkAPI) => {
    const url= BASE_URL+`/student/${id}`;
    try {
      console.log(student)
      const response = await axios.put(url,student);
      return response.data; // Trả về dữ liệu từ phản hồi
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data); // Trả về lỗi nếu có
    }
  });

  export const searchByName = createAsyncThunk("student/searchByName", async (name, thunkAPI) => {
    const url = BASE_URL + `/student/search3?name=${name}`;
    try {
        const response = await axios.get(url);
        return response.data;
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.response.data); // Trả về lỗi nếu có
    }
});
export const searchByYear = createAsyncThunk("student/searchByYear", async ({startYear,endYear}, thunkAPI) => {
    const url = BASE_URL + `/student/search4?startYear=${startYear}&endYear=${endYear}`;
    try {
        const response = await axios.get(url);
        return response.data;
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.response.data); // Trả về lỗi nếu có
    }
});
export const searchStudentsXepLoai = createAsyncThunk("student/searchStudentsXepLoai", async (xeploai, thunkAPI) => {
    const url =  `${BASE_URL}/student/searchXepLoai?xepLoai=${xeploai}`;
    try {
        const response = await axios.get(url
           
       );
        return response.data;
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.response.data); // Trả về lỗi nếu có
    }
});

export const searchAll = createAsyncThunk("student/searchAll", async ({xepLoai,name,startYear,endYear}, thunkAPI) => {
   
    const url =  `${BASE_URL}/student/searchAll?xepLoai=${xepLoai}&name=${name}&startYear=${startYear}&endYear=${endYear}`;
    try {
        const response = await axios.get(url
           
       );
        return response.data;
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.response.data); // Trả về lỗi nếu có
    }
});
export const studentSlice = createSlice({
    name: "student",
    initialState: {
        students: null,
        totalPages: 10,
        status:'idle',
        error:null,
        message:""

    },
    reducers: {
        resetStatusAndMessage:(state)=>{
            state.status=null;
            state.message=""
            state.error=null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAlll.fulfilled, (state, action) => {
                state.students = action.payload.data.studentResponeList
                state.totalPages = action.payload.data.totalPages
            })

            // Xử lý trường hợp deleteStudent.pending
            .addCase(deleteStudent.pending, (state) => {
                state.loading = true;
                state.error = null; // Xóa lỗi trước đó
            })
            // Xử lý trường hợp deleteStudent.fulfilled
            .addCase(deleteStudent.fulfilled, (state, action) => {
               
                state.status=action.payload.status
                console.log(action.payload)
                state.message=action.payload.message
                state.students = state.students.filter(student => student.id !== action.payload.data);
            })
            // Xử lý trường hợp deleteStudent.rejected
            .addCase(deleteStudent.rejected, (state, action) => {
                // state.loading = false;
                // state.error = action.payload || 'Failed to delete student'; // Xử lý lỗi
                state.status=action.payload.status
                state.message=action.payload.message
                state.error=action.payload.data
            })
            .addCase(addStudent.fulfilled, (state, action) => {
           
             
              
                state.status=action.payload.status
                state.message=action.payload.message
                // state.students.push(action.payload.data)
                state.students=[...state.students,action.payload.data]
            }).addCase(addStudent.rejected, (state, action) => {
                state.status=action.payload.status
              
                state.message=action.payload.message
            
                state.error=action.payload.data
            }).addCase(editStudent.fulfilled, (state, action) => {
                state.status=action.payload.status
                state.message=action.payload.message
                state.students = state.students.map(student =>
                  student.id === action.payload.data.id ? action.payload.data : student
              );
              })
              .addCase(editStudent.rejected, (state, action) => {
                state.status=action.payload.status
                state.message=action.payload.message
                state.error=action.payload.data
              })
              .addCase(searchByName.fulfilled, (state, action) => {
                state.status=action.payload.status
                state.students=action.payload.data
              })
              .addCase(searchByName.rejected, (state, action) => {
                state.status=action.payload.status
                state.message=action.payload.message
                state.error=action.payload.data
              })
              .addCase(searchByYear.fulfilled, (state, action) => {
                state.status=action.payload.status
                state.students=action.payload.data
              })
              .addCase(searchByYear.rejected, (state, action) => {
                state.status=action.payload.status
                state.message=action.payload.message
                state.error=action.payload.data
              })
              .addCase(searchStudentsXepLoai.fulfilled, (state, action) => {
                state.status=action.payload.status
                state.students=action.payload.data
              })
              .addCase(searchStudentsXepLoai.rejected, (state, action) => {
                state.status=action.payload.status
                state.message=action.payload.message
                state.error=action.payload.data
              })
              .addCase(searchAll.fulfilled, (state, action) => {
                state.status=action.payload.status
                state.students=action.payload.data
              })
              .addCase(searchAll.rejected, (state, action) => {
                state.status=action.payload.status
                state.message=action.payload.message
                state.error=action.payload.data
              })
             



    }
})
export const {resetStatusAndMessage}=studentSlice.actions
export default studentSlice.reducer