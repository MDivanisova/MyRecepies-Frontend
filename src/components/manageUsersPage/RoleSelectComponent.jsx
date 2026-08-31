import { useState, useRef, useEffect } from "react";
import { GetRole } from "../../utils/RoleEndpoint";
import { useAuth } from "../../context/useAuth";

export default function RoleSelectComponent({ value, onChange }) {

    const [isOpen, setIsOpen] = useState(false);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    const { token } = useAuth();

    const ref = useRef(null);

    /* =========================
       FETCH ROLES
    ========================= */

    useEffect(() => {

        async function fetchRoles() {

            setLoading(true);

            const data = await GetRole(token);

            if (data.succ === true && Array.isArray(data.roles)) {
                setRoles(data.roles);
            } else {
                setRoles([]);
            }

            setLoading(false);

        }

        fetchRoles();

    }, [token]);


    /* =========================
       CLOSE ON OUTSIDE CLICK
    ========================= */

    function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        }

    useEffect(() => {

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);

    }, []);

    function formatRoleName(name) {
        const spaced = name.replace(/([a-z])([A-Z])/g, "$1 $2");
        return spaced.charAt(0).toUpperCase() + spaced.slice(1);
    }

    /* =========================
       SELECTED LABEL
    ========================= */

    const selectedLabel =
            value === "all"
                ? "All Roles"
                : formatRoleName(roles.find(role => role._id === value)?.roleName) || "All Roles";
                
    return (
        <div className="role-select" ref={ref}>

            <button
                type="button"
                className="role-select-button"
                onClick={() => setIsOpen(prev => !prev)}
            >
                <span>{loading ? "Loading..." : selectedLabel}</span>
                <i className={`fa-solid fa-chevron-down ${isOpen ? "open" : ""}`}></i>
            </button>

            {isOpen && !loading && (

                <div className="role-select-options">

                    <button
                        type="button"
                        className={`role-select-option ${value === "all" ? "selected" : ""}`}
                        onClick={() => {
                            onChange("all");
                            setIsOpen(false);
                        }}
                    >
                        All Roles
                    </button>

                    {roles.map(role => (
                        <button
                            key={role._id}
                            type="button"
                            className={`role-select-option ${value === role._id ? "selected" : ""}`}
                            onClick={() => {
                                onChange(role._id);
                                setIsOpen(false);
                            }}
                        >
                            {formatRoleName(role.roleName)}
                        </button>
                    ))}

                </div>

            )}

        </div>
    );

}