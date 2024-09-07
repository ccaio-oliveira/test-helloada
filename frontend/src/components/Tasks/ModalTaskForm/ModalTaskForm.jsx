import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { PropTypes } from 'prop-types';
import { useContext, useState } from "react";
import { ToastContext } from "../../../context/ToastContext";
import { useAuth } from "../../../context/AuthContext";

const ModalTaskForm = ({ action, visible, handleVisible }) => {
    const toast = useContext(ToastContext);
    const { headers, session } = useAuth();
    const [title, setTitle] = useState(action !== 'new' ? action.task.title : '');
    const [description, setDescription] = useState(action !== 'new' ? action.task.description : '');

    const handleSave = async () => {
        if (!title || !description) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Title and description are required' });
            return;
        }

        toast.current.show({ severity: 'info', summary: 'Saving', detail: 'Please wait...' });

        await axios.post('/api/tasks', { 
            user_id: session.id,
            title, 
            description 
        }, {
            headers
        }).then(() => {
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Task created successfully' });
            handleVisible(false);
        }).catch(err => {
            toast.current.show({ severity: 'error', summary: 'Error', detail: err.response.data.message });
        });
    }

    const handleEdit = async () => {
        if (!title || !description) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Title and description are required' });
            return;
        }
        
        toast.current.show({ severity: 'info', summary: 'Saving', detail: 'Please wait...' });

        await axios.put(`/api/tasks/${action.task.id}`, {
            title,
            description
        }, {
            headers
        }).then(() => {
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Task updated successfully' });
            handleVisible(false);
        }).catch(err => {
            toast.current.show({ severity: 'error', summary: 'Error', detail: err.response.data.message });
        });
    }

    const footerContent = (
        <div className="flex justify-between">
            <Button className="bg-red-500 text-white p-2" onClick={() => handleVisible(false)} label="Cancel" />
            <Button className="bg-sky-600 text-white p-2" onClick={() => action === 'new' ? handleSave() : handleEdit()} label="Save" />
        </div>
    );

    return (
        <Dialog 
            header={action === 'new' ? 'Create new task' : 'Update Task'} 
            visible={visible} 
            className="w-full sm:w-1/2"
            onHide={() => handleVisible(false)}
            footer={footerContent}
        >
            <div className="w-full">
                <label className="text-gray-500">Title</label>
                <InputText value={title} className="w-full border p-2 rounded-lg" onChange={e => setTitle(e.target.value)} />
            </div>

            <div className="w-full mt-3">
                <label className="text-gray-500">Description</label>
                <InputTextarea
                    value={description}
                    className="w-full border p-2 rounded-lg"
                    autoResize
                    rows={5}
                    onChange={e => setDescription(e.target.value)}
                ></InputTextarea>
            </div>
        </Dialog>
    );
}

ModalTaskForm.propTypes = {
    action: PropTypes.isRequired,
    visible: PropTypes.bool.isRequired,
    handleVisible: PropTypes.func.isRequired
};

export default ModalTaskForm;