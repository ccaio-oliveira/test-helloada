import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header/Header";
import TaskTable from "../../components/Tasks/TaskTable/TaskTable";

const Dashboard = () => {
    const { handleValidateSession, session, handleSetHeaders } = useAuth();

    useEffect(() => {
        handleValidateSession();

        if(session && session.logged === true) {
            handleSetHeaders();
        }

    }, [session]);

    return (
        <div>
            <Header />

            <main className="card shadow-md w-11/12 mt-5 m-auto border rounded-lg">
                <TaskTable />
            </main>
        </div>
    )
}

export default Dashboard;