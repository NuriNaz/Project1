import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "api/API";
import Axios from "api/Axios";

export const updateUser = createAsyncThunk("updateUser", async (data) => {
  console.log(data, "updateUser");
  try {
    const response = await Axios.Filepost(
      `${API.Update_Profile}/${data.id}`,
      data.formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      return response.data.data;
    }
  } catch (err) {
    console.log(err);
    return err;
  }
});

export const Data = createSlice({
  name: "Data",
  initialState: {
    loading: false,
    error: null,
    contentData: [],
    users: [],
    WallboardFilterData: [],
    SelectWallboardFilterDatas: [],
  },
  reducers: {
    contentData: (state, action) => {
      state.contentData = action.payload;
    },
    ProfileUser: (state, action) => {
      state.users = action.payload;
    },
    CreateWallboardFilterData: (state, action) => {
      state.WallboardFilterData = action.payload;
    },
    SelectWallboardFilterData: (state, action) => {
      state.SelectWallboardFilterDatas = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        // state.users = state.users.map((item) =>
        // console.log(item, 'hello this is item')
        //   // item.id === action.payload.id ? action.payload : item
        // );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      });
  },
});
// Action creators are generated for each case reducer function
export const { contentData, ProfileUser, CreateWallboardFilterData, SelectWallboardFilterData } =
  Data.actions;

export default Data.reducer;
