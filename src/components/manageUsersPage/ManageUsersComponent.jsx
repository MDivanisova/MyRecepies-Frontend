import { useEffect, useState, useRef } from "react";
import RoleSelectComponent from "./RoleSelectComponent";
import UserCardComponent from "./UserCardComponent";
import ElectricBorder from '../ElectricBorder';
import { getUsers } from "../../utils/UserEndpoints";
import { useAuth } from "../../context/useAuth";

import Spinner from "../Spiner";
import { useNavigate } from "react-router-dom";
import "./manageUsersComponent.css";


export default function ManageUsersComponent() {

    const [nameSearch, setNameSearch] = useState("");
    const [emailSearch, setEmailSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const totalUsers = useRef(0);
    const totalPages = useRef(0);
    const [currentPage, setCurrentPage] = useState(1);
    const {token, logout} = useAuth();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [refresh, setRefresh] = useState(1);

const navigate = useNavigate();


    async function fetchUsers(token, pageNumber, name, email, role){

        setLoading(true);
        const data = await getUsers(token, pageNumber, name, email, role);

        if(data.succ === true){

            totalUsers.current = data.pagination.numUsers;
            totalPages.current = data.pagination.totalPages;
            console.log(data.users)
            setUsers(data.users);
        }
        else if(data.status === 401){
            logout();
            alert("Your token has expired please login again.")
            navigate('/login') 
        }
        else if(data.status === 500){
            navigate('/internalServerError')
        }
        setLoading(false);
    }

    useEffect(()=>{
        fetchUsers(token, currentPage, nameSearch, emailSearch, roleFilter);
    },[nameSearch, emailSearch, roleFilter, currentPage, refresh]) 

   
    const adminUsers = users.filter(
        user => user.role.roleName === "admin"
    );

    const otherUsers = users.filter(
        user => user.role.roleName !== "admin"
    );

    return (
        <div className="manage-users-component">

            <div className="users-toolbar">

                <div className="users-toolbar-left">

                    <div className="users-search">
                        <i className="fa-solid fa-user"></i>
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={nameSearch}
                            onChange={(e) => setNameSearch(e.target.value)}
                        />
                    </div>

                    <div className="users-search">
                        <i className="fa-solid fa-envelope"></i>
                        <input
                            type="text"
                            placeholder="Search by email..."
                            value={emailSearch}
                            onChange={(e) => setEmailSearch(e.target.value)}
                        />
                    </div>

                    <RoleSelectComponent value={roleFilter} onChange={setRoleFilter} />

                </div>

                <div className="users-count">
                    <i className="fa-solid fa-users"></i>
                    <span>{totalUsers.current} users</span>
                </div>

            </div>

        

                <div className="users-list-container">

                    {loading ? (

                        <div className="users-spinner">

                            <Spinner
                                w={500}
                                h={500}
                            />

                        </div>

                    ) : users.length > 0 ? (

                        <>
                            {adminUsers.map(user => (

                                <ElectricBorder
                                    key={user.id}
                                    color="#fdaa2d"
                                    speed={0.1}
                                    chaos={0.01}
                                    thickness={20}
                                >

                                    <UserCardComponent
                                        user={user}
                                        setUsers={setUsers}
                                        setLoading={setLoading}
                                        setRefresh={setRefresh}
                                    />

                                </ElectricBorder>

                            ))}


                            {otherUsers.map(user => (

                                <ElectricBorder
                                    key={user.id}
                                    color="#78854f"
                                    speed={0.1}
                                    chaos={0.01}
                                    thickness={20}
                                >

                                    <UserCardComponent
                                        user={user}
                                        setUsers={setUsers}
                                        setLoading={setLoading}
                                        setRefresh={setRefresh}
                                    />

                                </ElectricBorder>

                            ))}
                        </>

                    ) : (

                        <div className="no-users-found">

                            <i className="fa-solid fa-users"></i>

                            <span>
                                No users found.
                            </span>

                        </div>

                    )}

                </div>


                {/* =========================
                    PAGINATION
                ========================= */}

                {!loading && users.length > 0 && totalPages.current > 0 && (

                    <div className="users-pagination">

                        <button
                            className="pagination-button"
                            disabled={
                                currentPage === 1 ||
                                loading
                            }
                            onClick={() =>
                                setCurrentPage(prev => prev - 1)
                            }
                        >

                            <i className="fa-solid fa-arrow-left"></i>

                            Back

                        </button>


                        <span>
                            Page {currentPage} of {totalPages.current}
                        </span>


                        <button
                            className="pagination-button"
                            disabled={
                                currentPage === totalPages.current ||
                                loading
                            }
                            onClick={() =>
                                setCurrentPage(prev => prev + 1)
                            }
                        >

                            Next

                            <i className="fa-solid fa-arrow-right"></i>

                        </button>

                    </div>

                )}

        </div>
    );
}