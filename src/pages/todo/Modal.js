import React, { useEffect } from 'react';
import { Modal, Box, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: "20px",
};

const CustomModal = ({ open, onClose, onSubmit, taskData, editingTaskId }) => {
    const [status, setStatus] = React.useState('');
    const [inputValue, setInputValue] = React.useState('');
    const [taskId, setTaskId] = React.useState(null);

    useEffect(() => {
        if (taskData) {
            setStatus(taskData.status);
            setInputValue(taskData.title);
            setTaskId(taskData.id);
        } else {
            setStatus('Incomplete');
            setInputValue('');
            setTaskId(null);
        }
    }, [taskData]);

    const handleChange = (event) => {
        const newStatus = event.target.value;
        setStatus(newStatus);
    };

    const handleClose = () => {
        onClose();
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmitFunction = () => {
        const taskData = {
            title: inputValue,
            status: status,
            id: taskId,
        };

        onSubmit(taskData, editingTaskId);
        setStatus('Incomplete');
        setInputValue('');
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <h2>{editingTaskId !== null ? 'Edit Task' : 'Add TODO'}</h2>
                <TextField
                    id="outlined-basic"
                    type="text"
                    onChange={handleInputChange}
                    value={inputValue}
                    style={{ width: '100%', paddingBottom: '10px' }}
                    label="Title"
                    variant="outlined"
                />
                <FormControl fullWidth style={{ paddingBottom: '10px' }}>
                    <InputLabel id="demo-simple-select-label">Status</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={status}
                        label="Status"
                        onChange={handleChange}
                    >
                        <MenuItem value="Incomplete">Incomplete</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                </FormControl>
                <div>
                    <Button
                        style={{ marginRight: '10px' }}
                        onClick={handleSubmitFunction}
                        variant="contained"
                    >
                        {editingTaskId !== null ? 'Update Task' : 'Add Task'}
                    </Button>

                    <Button onClick={handleClose} variant="outlined">
                        Cancel
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default CustomModal;
