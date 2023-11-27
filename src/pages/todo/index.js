import React, { useState, useEffect } from 'react';
import { Button, Card, Collapse, Box, FormControl, InputLabel, Select, MenuItem,Typography } from '@mui/material';
import todostyles from '../../styles/todo.module.css';
import CustomModal from './Modal';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Todo_App = () => {
    
    const [open, setOpen] = useState(false);
    const [taskList, setTaskList] = useState([]);
    console.log(taskList);
    const [editingTaskIndex, setEditingTaskIndex] = useState(null);
    const [taskIdCounter, setTaskIdCounter] = useState(1);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [isEditAlertOpen, setIsEditAlertOpen] = useState(false);
    const [isNoChangesAlertOpen, setIsNoChangesAlertOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState('All');




    const handleOpen = () => {
        setEditingTaskIndex(null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleTaskSubmission = (taskData, editingTaskId) => {
        const currentDateTime = new Date().toLocaleString(); 

        if (editingTaskId !== null) {
            const updatedTaskList = [...taskList];
            const taskIndexToEdit = updatedTaskList.findIndex(task => task.id === editingTaskId);

            if (taskIndexToEdit !== -1) {
                const editedTask = {
                    ...taskData,
                    editedOn: currentDateTime, 
                };

                updatedTaskList[taskIndexToEdit] = editedTask;
                setTaskList(updatedTaskList);

                if (
                    taskData.title === taskList[taskIndexToEdit].title &&
                    taskData.status === taskList[taskIndexToEdit].status
                ) {
                    setIsNoChangesAlertOpen(true);
                    setTimeout(() => setIsNoChangesAlertOpen(false), 2000);
                } else {
                    setIsEditAlertOpen(true);
                    setTimeout(() => setIsEditAlertOpen(false), 2000);
                }
            }
        } else {
            const newTask = {
                ...taskData,
                id: taskIdCounter,
                createdOn: currentDateTime, 
            };

            setTaskList([...taskList, newTask]);
            setTaskIdCounter(taskIdCounter + 1);
            setIsAlertOpen(true);
            setTimeout(() => setIsAlertOpen(false), 2000);
        }

        handleClose();
    };

    const handleToggleCheckbox = (taskId) => {
        const updatedTaskList = [...taskList];
        const taskIndexToToggle = updatedTaskList.findIndex(task => task.id === taskId);
        if (taskIndexToToggle !== -1) {
            updatedTaskList[taskIndexToToggle].status =
                updatedTaskList[taskIndexToToggle].status === 'Completed' ? 'Incomplete' : 'Completed';
            setTaskList(updatedTaskList);
        }
    };

    const handleDeleteFunction = (taskId) => {
        const updatedTaskList = taskList.filter(task => task.id !== taskId);
        setTaskList(updatedTaskList);
        setIsDeleteAlertOpen(true);
          setTimeout(() => setIsDeleteAlertOpen(false), 2000);
    };

    const handleEditFunction = (taskId) => {
        const taskToEdit = taskList.find(task => task.id === taskId);
        if (taskToEdit) {
            setEditingTaskIndex(taskId);
            setOpen(true);
        }
    };

    const filteredTaskList = taskList.filter(task => {
        if (statusFilter === 'All') {
            return true; 
        } else if (statusFilter === 'Completed') {
            return task.status === 'Completed';
        } else {
            return task.status === 'Incomplete';
        }
    });

    return (
        <div className={todostyles.container}>
            <h1>ToDo List</h1>
            <div className={todostyles.buttons}>
                <Button style={{ fontFamily: "cursive" }} onClick={handleOpen} variant="contained">
                    Add Task
                </Button>

                <Box>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={statusFilter}
                            label="Status"
                            onChange={(event) => setStatusFilter(event.target.value)}
                            style={{ width: '140px' }}
                        >
                            <MenuItem value='All'>All</MenuItem>
                            <MenuItem value="Incompleted">Incompleted</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </div>

            <CustomModal
                open={open}
                onClose={handleClose}
                onSubmit={handleTaskSubmission}
                taskData={editingTaskIndex !== null ? taskList.find(task => task.id === editingTaskIndex) : null}
                editingTaskId={editingTaskIndex}
            />

            {taskList.length > 0 ? (
                <div>
                    <h2>Task List:</h2>

                    <ul className="tasklist" style={{ backgroundColor: "lightgrey", padding: "5px", borderRadius: "5px", }}>
                        {filteredTaskList.map((task) => (
                            <Card
                                style={{
                                    padding: '10px',
                                    margin: '10px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                                }}
                                key={task.id}>

                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type="checkbox"
                                            checked={task.status === 'Completed'}
                                            onChange={() => handleToggleCheckbox(task.id)}
                                            style={{ width: '24px', height: '24px', marginRight: '10px' }}
                                        />
                                        <div style={{ fontWeight: 'bold' }}>{task.title}</div>
                                    </div>
                                    <div style={{ fontSize: '0.8em', display: 'flex', alignItems: 'center', color: 'gray' }}>
                                        <span>{task.createdOn}</span>
                                        {task.editedOn && <span style={{ marginLeft: '10px' }}>{task.editedOn}</span>}
                                    </div>
                                </div>


                                <div>
                                    <Button style={{ margin: "5px", minWidth: "5px", padding: "5px" }}
                                        onClick={() => handleDeleteFunction(task.id)}
                                        variant="outlined"
                                    >
                                        <DeleteIcon />
                                    </Button>

                                    <Button style={{ margin: "5px", minWidth: "5px", padding: "5px" }}
                                        onClick={() => handleEditFunction(task.id)}
                                        variant="outlined"
                                    >
                                        <EditIcon />
                                    </Button>
                                </div>
                            </Card>
                        ))}


                    </ul>
                    <div>
                        <Collapse in={isAlertOpen}>
                            <Alert severity="success" className={todostyles.alertContainer}>
                                <AlertTitle>Task added successfully</AlertTitle>
                            </Alert>
                        </Collapse>

                        <Collapse in={isDeleteAlertOpen}>
                            <Alert severity="error" className={todostyles.alertContainer}>
                                <AlertTitle>Task deleted successfully</AlertTitle>
                            </Alert>
                        </Collapse>

                        <Collapse in={isEditAlertOpen}>
                            <Alert severity="success" className={todostyles.alertContainer}>
                                <AlertTitle>Task edited successfully</AlertTitle>
                            </Alert>
                        </Collapse>

                        <Collapse in={isNoChangesAlertOpen}>
                            <Alert severity="info" className={todostyles.alertContainer}>
                                <AlertTitle>No changes made</AlertTitle>
                            </Alert>
                        </Collapse>
                    </div>
                </div>
             )
             : (
                <Card style={{margin:"10px",padding:"10px"}}>
                        <Typography variant="body2" color="textSecondary" component="p">
                            <b>No tasks to display.</b>
                        </Typography>
                </Card>
            )
            }
        </div>
    );
};

export default Todo_App;
