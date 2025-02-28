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
  IconButton,
} from "@mui/material";
import { IconLayoutGrid, IconList } from "@tabler/icons";
// import { BiGridAlt } from "react-icons/bs";
// import { BiCheckCircle, BiCircle } from "react-icons/bi";
import { BiGridAlt } from "react-icons/bi";
import { BiCheckCircle, BiCircle } from "react-icons/bi";
import '../style.css'

// Components
import Axios from "api/Axios";
import { API } from "api/API";
import Loading from "components/Loading";
import { BiSearchAlt2 } from "react-icons/bi";

const Gallery_Popup = ({ close, authorURL }) => {
  const [views, setViews] = useState(
    localStorage.getItem("flowDisplayStyle") || "card"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [imagesURL, setImagesURL] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [author_image, setAuthorImage] = useState();

  const handleChange = (event, nextView) => {
    localStorage.setItem("flowDisplayStyle", nextView);
    setViews(nextView);
  };

  const handleSearch = (e) => {
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

  const toggleImageSelection = (imageId) => {
    if (selectedImage === imageId) {
      setSelectedImage(null); // Deselect the image if it's already selected
    } else {
      setSelectedImage(imageId); // Select the image
      const author_pic = imagesURL.posts
        .filter((item) => imageId === item.post_id)
        .map((item) => item.author_pic)[0];
      setAuthorImage(author_pic);
      //   setAuthorImageURL(author_pic)
    }
  };

  const isImageSelected = (imageId) => {
    return selectedImage === imageId;
  };

  const handleSave = () => {
      console.log(author_image, 'hello')
    
    if (author_image) {
        authorURL(author_image);
      close();
    }
  };

  useEffect(() => {
    AllMediaImages(page);
  }, []);

  return (
    <>
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
            label="Search"
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
                  <BiGridAlt style={{ fontSize: 20 }} />
                </ToggleButton>
              </ToggleButtonGroup>
            </ButtonGroup>
          </ButtonGroup>
        </Grid>
      </Grid>

      {/* Media Starts here  */}
      {views === "card" ? (
        <ImageList cols={4}>
          {imagesURL && imagesURL?.posts?.length > 0 ? (
            imagesURL?.posts?.map((item, index) => (
              <ImageListItem
                sx={{ marginBottom: 1, marginLeft: 1, position: "relative" }}
                key={index}
              >
                <IconButton
                  sx={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    backgroundColor: isImageSelected(item.post_id)
                      ? "#4CAF50"
                      : "rgba(0, 0, 0, 0.5)",
                    borderRadius: "50%",
                  }}
                  onClick={() => toggleImageSelection(item.post_id)}
                >
                  {isImageSelected(item.post_id) ? (
                    <BiCheckCircle />
                  ) : (
                    <BiCircle />
                  )}
                </IconButton>
                <img
                  srcSet={`${item.author_pic}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.author_pic}?w=164&h=164&fit=crop&auto=format`}
                  alt={item.post_title}
                  loading="lazy"
                />
              </ImageListItem>
            ))
          ) : (
            <p>No Record Found</p>
          )}
        </ImageList>
      ) : (
        <ImageList cols={4} gap={8} variant="masonry">
          {imagesURL && imagesURL?.posts?.length > 0 ? (
            imagesURL?.posts?.map((item, index) => (
              <ImageListItem key={index}>
                <IconButton
                  sx={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    backgroundColor: isImageSelected(item.post_id)
                      ? "#4CAF50"
                      : "rgba(0, 0, 0, 0.5)",
                    borderRadius: "50%",
                  }}
                  onClick={() => toggleImageSelection(item.post_id)}
                >
                  {isImageSelected(item.post_id) ? (
                    <BiCheckCircle />
                  ) : (
                    <BiCircle />
                  )}
                </IconButton>
                <img
                  srcSet={`${item.author_pic}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.author_pic}?w=248&fit=crop&auto=format`}
                  alt={item.post_title}
                  loading="lazy"
                />
              </ImageListItem>
            ))
          ) : (
            <p>No Record Found</p>
          )}
        </ImageList>
      )}
     
      {imagesURL?.posts?.length > 0 && (
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
      <div className="buttons">
       <Button
        size="large"
        variant="contained"
        color="secondary"
        style={{
          background: "#15223F",
          padding: "12px 20px",
          borderRadius: "8px",
        }}
        onClick={handleSave}
      >
        Insert
      </Button>
      <Button
        size="large"
        variant="contained"
        color="secondary"
        style={{
          background: "#15223F",
          padding: "12px 20px",
          borderRadius: "8px",
        }}
        onClick={()=>close()}
      >
        Close
      </Button>
      </div>
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
    </>
  );
};

export default Gallery_Popup;
