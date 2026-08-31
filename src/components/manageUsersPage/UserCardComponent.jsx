import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/useAuth";
import { editUserRole, GetRole } from "../../utils/RoleEndpoint";
import { deleteUser } from "../../utils/UserEndpoints";
import "./userCardComponent.css";

export default function UserCardComponent({ user, setUsers, setLoading, setRefresh }) {
    const {token} = useAuth();
    const [edit, setEdit] = useState(false);
    const [roleOpen, setRoleOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState("");
    const [roles,setRoles] = useState([]);

    const roleSelectRef = useRef(null);

    useEffect(() => {
    
            async function fetchRoles() {

                const data = await GetRole(token);
    
                if (data.succ === true && Array.isArray(data.roles)) {
                    setRoles(data.roles);
                } else {
                    setRoles([]);
                }
        
            }
    
            fetchRoles();
    
    }, [token]);


    useEffect(() => {

        function handleClickOutside(event) {

            if (
                roleSelectRef.current &&
                !roleSelectRef.current.contains(event.target)
            ) {
                setRoleOpen(false);
            }
        }

        function handleEscape(event) {

            if (event.key === "Escape") {
                setRoleOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };

    }, []);

    async function handleDelete(userId){
        const data = await deleteUser(token, userId);

        if(data.succ === true){
            
            setUsers(prevUsers =>
                prevUsers.filter(user => user.id !== userId)
            );
            setRefresh(prev=>prev+1);

        }
    }

    async function handleEdit(userId){
        setLoading(true);
        const data = await editUserRole(token, userId, selectedRole._id);
        if(data.succ === true){
            setUsers(prevUsers =>
                prevUsers.map(user =>
                user._id === userId
                    ? {
                        ...user,
                        role: selectedRole
                    }
                    : user
                )
            );
            setEdit(false);
        }
        setLoading(false);
    }

    return (
        <div className="user-card">

            {/* TOP SECTION */}
            <div className="user-card-top">

                <div className="user-avatar">
                    {user.name
                        .split(" ")
                        .map(word => word[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    }
                </div>

                <div className="user-card-status">

                    {(
                        <div className={user.isVerified ? "verified-badge": "notverified-badge"}>
                            <i className={
                                    user.isVerified
                                        ? "fa-solid fa-check verified"
                                        : "fa-solid fa-xmark not-verified"
                                }
                            ></i>
                            Verified
                        </div>
                    )}
                    

                    {edit ? (
                        <div className="category-select" ref={roleSelectRef}>

                            <button
                                type="button"
                                className="category-select-button"
                                onClick={() => setRoleOpen(prev => !prev)}
                            >

                                <span>
                                    {selectedRole.roleName || "Select a role"}
                                </span>

                                <i
                                    className={`fa-solid fa-chevron-down ${
                                        roleOpen ? "rotate" : ""
                                    }`}
                                ></i>

                            </button>


                            {roleOpen && (
                                <div className="category-select-options">

                                    {roles.map(role => (

                                        <button
                                            type="button"
                                            key={role._id}
                                            className={`category-select-option ${
                                                selectedRole?._id === role._id
                                                    ? "selected"
                                                    : ""
                                            }`}

                                            onClick={() => {
                                                setSelectedRole(role);
                                                setRoleOpen(false);
                                            }}
                                        >
                                            {role.roleName}
                                        </button>

                                    ))}

                                </div>
                            )}

                        </div>
                    ):(
                        <div className={`role-badge role-${user.role.roleName.toLowerCase()}`}>
                            {user.role.roleName}
                        </div>
                    )}

                </div>

            </div>


            {/* USER INFO */}
            <div className="user-card-info">

                <h3>{user.name}</h3>

                <p>{user.email}</p>

            </div>


            {/* STATISTICS */}
            <div className="user-card-stats">

                <div className="user-stat">
                    <i className={
                        user.gender === "male"
                            ? "fa-solid fa-mars"
                            : "fa-solid fa-venus"
                    }></i>
                    <span>{user.age}y</span>
                </div>

                <div className="user-stat">
                    <i className="fa-regular fa-pen-to-square"></i>
                    <span>{user.reviewsWriten}</span>
                </div>

                <div className="user-stat">
                    <i className="fa-regular fa-bookmark"></i>
                    <span>{user.bookmarks}</span>
                </div>

            </div>


            {/* LAST SEEN */}
            <div className="user-last-seen">
                Last seen: {new Date(user?.lastLogedIn).toLocaleString("en-UK", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            })}
            </div>


            {/* ACTIONS */}
            <div className="user-card-actions">
                {edit? (
                    <button className="save-edit-user-button" onClick={()=>{setEdit(prev=>!prev); handleEdit(user._id)}}>
                        <i className="fa-solid fa-check verified"></i>
                        Save
                    </button>
                ):(
                    <button className="edit-user-button" onClick={()=>{setEdit(prev=>!prev)}}>
                        <i className="fa-solid fa-pen"></i>
                        Edit
                    </button>)}
                

                <button className="delete-user-button" onClick={()=>{handleDelete(user._id)}}>
                    <i className="fa-solid fa-trash"></i>
                    Delete
                </button>

            </div>

        </div>
    );
}