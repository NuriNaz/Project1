import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { Box, Modal } from "@mui/material";

const Popup = ({ open, onClose, title, content, actions, overflowY,width, height, padding }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: width? width: "500px",
    maxWidth: 600,
    bgcolor: "white",
    borderRadius: 4,
    boxShadow: 24,
    p: 2,
    overflowY: overflowY,
    height:height,
    padding:padding
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {title && (
          <Typography
            id="modal-modal-title"
            variant="h3" // Adjusted variant to 'h4' for proper styling
            component="div"
            sx={{ marginBottom: 2 }} // Added margin to the title
          >
            {title}
          </Typography>
        )}
        <DialogContent style={{padding:0}}>{content}</DialogContent>
        {actions && <DialogActions>{actions}</DialogActions>}
      </Box>
    </Modal>
  );
};

export default Popup;
