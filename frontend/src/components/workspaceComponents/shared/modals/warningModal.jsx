import React from 'react';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

function WarningModal({message, onConfirm, open, setOpen }) {
  const handleConfirm = () => {
    onConfirm(true);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningRoundedIcon />
            Внимание
          </DialogTitle>
          <Divider />
          <DialogContent>
            {message}
          </DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={handleConfirm}>
              Подтвердить
            </Button>
            <Button variant="plain" color="neutral" onClick={handleClose}>
              Назад
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </>
  );
}

export default WarningModal;
