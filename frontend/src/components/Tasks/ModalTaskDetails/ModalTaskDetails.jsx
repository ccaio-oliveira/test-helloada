import { Dialog } from "primereact/dialog";
import { PropTypes } from 'prop-types';

const ModalTaskDetails = ({ task, visible, handleVisible }) => {
    return (
        <Dialog header={task.title} visible={visible} style={{ width: '50vw' }} onHide={() => handleVisible(false)}>
            <div className="grid">
                <div className="grid border rounded p-3">
                    <span className="font-bold">Title:</span>
                    <span>{task.title}</span>
                </div>

                <div className="grid border rounded p-3 mt-3">
                    <span className="font-bold">Description:</span>
                    <span>{task.description}</span>
                </div>
            </div>
        </Dialog>
    );
}

ModalTaskDetails.propTypes = {
    task: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    handleVisible: PropTypes.func.isRequired
};

export default ModalTaskDetails;