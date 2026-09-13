import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { editUserRole, GetRole } from "../../utils/RoleEndpoint";
import { deleteUser } from "../../utils/UserEndpoints";
import Spinner from "../Spiner";
import "./userCardComponent.css";

export default function UserCardComponent({
    user,
    onRemoved,
    onEdited
}) {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [edit, setEdit] = useState(false);
    const [roleOpen, setRoleOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState("");
    const [roles, setRoles] = useState([]);
    const [profileLoading, setProfileLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

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


    function handleCardClick() {

        if (edit || profileLoading) {
            return;
        }

        setProfileLoading(true);

        navigate(`/profile/${user._id}`);

    }


    async function handleDelete(userId) {

        setDeleting(true);

        const data = await deleteUser(token, userId);

        if (data.succ === true) {

            onRemoved();

        }

        setDeleting(false);

    }


    async function handleEdit(userId) {

        if (!selectedRole?._id) {
            return;
        }

        setSaving(true);

        const data = await editUserRole(
            token,
            userId,
            selectedRole._id
        );

        if (data.succ === true) {

            onEdited({
                ...user,
                role: selectedRole
            });

            setEdit(false);

        }

        setSaving(false);

    }


    function handleEditClick(event) {

        event.stopPropagation();

        setSelectedRole(user.role);
        setEdit(true);

    }


    function handleSaveClick(event) {

        event.stopPropagation();

        handleEdit(user._id);

    }


    function handleDeleteClick(event) {

        event.stopPropagation();

        handleDelete(user._id);

    }


    return (
        <div
            className={`user-card ${edit ? "user-card-editing" : ""}`}
            onClick={handleCardClick}
        >

            {(profileLoading || deleting) && (
                <div className="user-card-loading">

                    <Spinner
                        w={100}
                        h={100}
                    />

                </div>
            )}


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

                    <div
                        className={
                            user.isVerified
                                ? "verified-badge"
                                : "notverified-badge"
                        }
                    >

                        <i
                            className={
                                user.isVerified
                                    ? "fa-solid fa-check verified"
                                    : "fa-solid fa-xmark not-verified"
                            }
                        ></i>

                        Verified

                    </div>


                    {edit ? (

                        <div
                            className="category-select"
                            ref={roleSelectRef}
                            onClick={(event) => event.stopPropagation()}
                        >

                            <button
                                type="button"
                                className="category-select-button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setRoleOpen(prev => !prev);
                                }}
                            >

                                <span>
                                    {selectedRole?.roleName || "Select a role"}
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
                                            onClick={(event) => {

                                                event.stopPropagation();

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

                    ) : (

                        <div
                            className={`role-badge role-${user.role.roleName.toLowerCase()}`}
                        >
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

                    <i
                        className={
                            user.gender === "male"
                                ? "fa-solid fa-mars"
                                : "fa-solid fa-venus"
                        }
                    ></i>

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

                Last seen:{" "}

                {new Date(user?.lastLogedIn).toLocaleString("en-UK", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                })}

            </div>


            {/* ACTIONS */}
            <div className="user-card-actions">

                {edit ? (

                    <button
                        className="save-edit-user-button"
                        onClick={handleSaveClick}
                        disabled={saving}
                    >
                        {saving ? (
                            <i className="fa-solid fa-spinner fa-spin"></i>
                        ) : (
                            <>
                                <i className="fa-solid fa-check verified"></i>
                                Save
                            </>
                        )}
                    </button>

                ) : (

                    <button
                        className="edit-user-button"
                        onClick={handleEditClick}
                    >
                        <i className="fa-solid fa-pen"></i>
                        Edit
                    </button>

                )}


                <button
                    className="delete-user-button"
                    onClick={handleDeleteClick}
                    disabled={deleting}
                >
                    {deleting ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                    ) : (
                        <>
                            <i className="fa-solid fa-trash"></i>
                            Delete
                        </>
                    )}
                </button>

            </div>

        </div>
    );
}