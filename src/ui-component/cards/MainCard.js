import PropTypes from "prop-types";
import { forwardRef } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { BiSearchAlt2 } from "react-icons/bi";

// constant
const headerSX = {
  "& .MuiCardHeader-action": { mr: 0 },
};

// ==============================|| CUSTOM MAIN CARD ||============================== //

const MainCard = forwardRef(
  (
    {
      border = true,
      boxShadow,
      children,
      content = true,
      contentClass = "",
      contentSX = {},
      darkTitle,
      secondary,
      shadow,
      sx = {},
      title,
      save,
      saveTemplate,
      buttontitle,
      approve,
      disapprove,
      disapprovecolor,
      approveColor,
      buttontitle1,
      buttontitle2,
      searchBar,
      handleSearch,
      searchText,
      label,
      name,
      ...others
    },
    ref
  ) => {
    const theme = useTheme();

    return (
      <Card
      className={name}
        ref={ref}
        {...others}
        sx={{
          border: border ? "1px solid" : "none",
          borderColor: theme.palette.primary[200] + 25,
          ":hover": {
            boxShadow: boxShadow
              ? shadow || "0 2px 14px 0 rgb(32 40 45 / 8%)"
              : "inherit",
          },
          ...sx,
        }}
      >
        {/* card header and action */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: save || approve || disapprove ? "15px" : "0px",
          }}
        >
          {title && (
            <CardHeader
              sx={{
                headerSX,
                padding: save || approve || disapprove ? "0px" : "15px",
              }}
              title={
                darkTitle ? (
                  <Typography style={{ padding: 0 }} variant="h3">
                    {title}
                  </Typography>
                ) : (
                  title
                )
              }
              action={secondary}
            />
          )}

          {save && (
            <Button
              style={{
                background: "#1d213e",
                color: "#fff",
              }}
              //  disabled={isManualDisabled}
              size="small"
              variant="contained"
              onClick={save}
            >
              {buttontitle}
              {/* Save */}
            </Button>
          )}
          <div
            style={{
              display: save ? "none" : "block",
              padding: searchBar ? "12px 0" : "unset",
            }}
          >
            {disapprove && (
              <Button
                style={{
                  background: disapprovecolor,
                  color: "#fff",
                  marginRight: 10,
                }}
                //  disabled={isManualDisabled}
                size="small"
                variant="contained"
                onClick={disapprove}
              >
                {buttontitle2}
                {/* Save */}
              </Button>
            )}
            {approve && (
              <Button
                style={{
                  background: approveColor,
                  color: "#fff",
                }}
                //  disabled={isManualDisabled}
                size="small"
                variant="contained"
                onClick={approve}
              >
                {buttontitle1}
                {/* Save */}
              </Button>
            )}

            {searchBar && (
              <TextField
                fullWidth
                label={label}
                // label="Search"
                autoComplete="false"
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
            )}
          </div>
        </div>

        {/* content & header divider */}
        {title && <Divider />}

        {/* card content */}
        {content && (
          <CardContent sx={contentSX} className={contentClass}>
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    );
  }
);

MainCard.propTypes = {
  border: PropTypes.bool,
  boxShadow: PropTypes.bool,
  children: PropTypes.node,
  content: PropTypes.bool,
  contentClass: PropTypes.string,
  contentSX: PropTypes.object,
  darkTitle: PropTypes.bool,
  secondary: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.object,
  ]),
  shadow: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.object,
  ]),
};

export default MainCard;
