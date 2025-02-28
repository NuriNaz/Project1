import React, { useState, useEffect } from "react";
import MainCard from "ui-component/cards/MainCard";
import {
  Button,
  ButtonGroup,
  Grid,
  ImageList,
  ImageListItem,
  InputAdornment,
  Pagination,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { IconLayoutGrid, IconList } from "@tabler/icons";
import { BsGrid1X2 } from "react-icons/bs";


// Components
import Axios from "api/Axios";
import { API } from "api/API";
import Loading from "components/Loading";
import { BiSearchAlt2 } from "react-icons/bi";

const Media = () => {
  const [views, setViews] = useState(
    localStorage.getItem("flowDisplayStyle") || "card"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [imagesURL, setImagesURL] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  const handleChange = (event, nextView) => {
    localStorage.setItem("flowDisplayStyle", nextView);
    setViews(nextView);
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchText(value);
  };

  const AllMediaImages = async (page, text) => {
    const data = {
      title: text,
      page: page,
      api_key: "d2F1IGF1dGhvciBpbWFnZXMgcHcgZGF0YSBlbmNycHQ=",
    };
    try {
      setIsLoading(true);
      const response = await Axios.post(API.PW_Media_Images1, data);
      if (response.status === 200) {
        setImagesURL(response.data);
        // console.log(response.data.posts, "hello I am the Images Data");
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err, "Error while getting Categories");
      setIsLoading(false);
    }
  };

  const handleChangePage = async (event, newPage) => {
    setPage(newPage);
    if (!searchText) {
      await AllMediaImages(newPage);
    }
    await AllMediaImages(newPage, searchText);
  };

  useEffect(() => {
    AllMediaImages(page);
  }, []);

  return (
    <MainCard
      label="Search"
      // handleSearch={handleSearch}
      // searchBar="true"
      // value={searchText}
      title="Media Management"
    >
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 1 }}
        sx={{ alignItems: "center", marginBottom: 5 }}
      >
        {/* Search Bar */}
        <Grid item xs={8}>
          <TextField
            fullWidth
            // label={label}
            label="Search"
            // autoComplete="false"
            variant="outlined"
            value={searchText}
            onChange={handleSearch}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <BiSearchAlt2 />
                </InputAdornment>
              ),
            }}
            style={{ paddingRight: "15px" }}
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            size="large"
            variant="contained"
            color="secondary"
            style={{
              background: "#15223F",
              padding: "12px 20px",
              borderRadius: "8px",
              // color: isSubmitting && "white",
            }}
            onClick={async () => await AllMediaImages(1, searchText)}
          >
            Search
          </Button>
        </Grid>
        {/* Search End */}

        {/* View Type */}
        <Grid item xs={2}>
          <ButtonGroup
            sx={{ maxHeight: 40 }}
            disableElevation
            variant="contained"
            aria-label="outlined primary button group"
          >
            <ButtonGroup
              disableElevation
              variant="contained"
              aria-label="outlined primary button group"
            >
              <ToggleButtonGroup
                sx={{ maxHeight: 40 }}
                value={views}
                color="primary"
                exclusive
                onChange={handleChange}
              >
                <ToggleButton
                  sx={{ borderRadius: "0px" }}
                  variant="contained"
                  value="card"
                  title="Grid View"
                >
                  <IconLayoutGrid />
                </ToggleButton>

                <ToggleButton
                  sx={{ borderRadius: "0px" }}
                  variant="contained"
                  value="list"
                  title="Masnory View"
                >
                  <BsGrid1X2 style={{ fontSize: 20 }} />
                </ToggleButton>
              </ToggleButtonGroup>
            </ButtonGroup>
          </ButtonGroup>
        </Grid>
      </Grid>

      {/* Media Starts here  */}
      {views === "card" ? (
        <ImageList cols={4}>
          {imagesURL && imagesURL?.posts?.length > 0
            ? imagesURL?.posts?.map((item, index) => (
                <ImageListItem
                  sx={{ marginBottom: 1, marginLeft: 1 }}
                  key={index}
                >
                  <img
                    srcSet={`${item.author_pic}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    src={`${item.author_pic}?w=164&h=164&fit=crop&auto=format`}
                    alt={item.post_title}
                    loading="lazy"
                  />
                </ImageListItem>
              ))
            : "No Record Found"}
        </ImageList>
      ) : (
        <ImageList
          cols={4}
          gap={8}
          variant="masonry"
          // cols={4}
        >
          {imagesURL && imagesURL?.posts?.length > 0
            ? imagesURL?.posts?.map((item, index) => (
                <ImageListItem key={index}>
                  <img
                    srcSet={`${item.author_pic}?w=248&fit=crop&auto=format&dpr=2 2x`} //248
                    src={`${item.author_pic}?w=248&fit=crop&auto=format`}
                    alt={item.post_title}
                    loading="lazy"
                  />
                </ImageListItem>
              ))
            : "No Record Found"}
        </ImageList>
      )}
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
      {imagesURL?.posts?.length > 0 && (
        //  && imagesURL?.totalPageCount > 1
        <Pagination
          count={Math.ceil(imagesURL?.total_count / 24)}
          defaultPage={1}
          page={page}
          onChange={handleChangePage}
          siblingCount={1}
          boundaryCount={1}
          color="primary"
          className="paging"
          sx={{
            button: { mt: 2 },
            width: "100%",
            display: "flex",
            justifyContent: { xs: "center", md: "flex-end" },
          }}
        />
      )}
    </MainCard>
  );
};

export default Media;
