import { editUser, getMe, getUsersRecepies, resendCode } from "../../utils/UserEndpoints";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { PROFILE_RECIPE_PAGE_SIZE } from "../../utils/enum";
import ProfileRecipeCardComponent from "./ProfileRecipeCardComponent";
import ElectricBorder from "../ElectricBorder";

import profileYellow from "../../assets/profileYellow.jpeg";

import Spinner from "../Spiner";
import "./profileComponent.css";


export default function OtherProfileComponent({userId}) {

    const { token, user: loggedUser } = useAuth();
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [loadingUser, setLoadingUser] = useState(true);


    const [publicRecipes, setPublicRecipes] = useState([]);

    const [publicSearch, setPublicSearch] = useState("");
    const [publicFilter, setPublicFilter] = useState("");

    const [publicPage, setPublicPage] = useState(1);

    const [publicPagination, setPublicPagination] = useState({
        numRecepies: 0,
        totalPages: 0,
        pageNumber: 1,
        pageSize: PROFILE_RECIPE_PAGE_SIZE
    });

    const [loadingPublicRecipes, setLoadingPublicRecipes] = useState(false);
    const [originalUser, setOriginalUser] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [genderOpen, setGenderOpen] = useState(false);

    const hasChanges = () => {
        return (
            user.name !== originalUser.name ||
            user.email !== originalUser.email ||
            user.description !== originalUser.description ||
            user.age !== originalUser.age ||
            user.gender !== originalUser.gender
        );
    };

    function getUserInitials(name) {

        if (!name) {
            return "";
        }

        const nameParts = name.trim().split(" ");

        if (nameParts.length >= 2) {

            return (
                nameParts[0].charAt(0) +
                nameParts[nameParts.length - 1].charAt(0)
            ).toUpperCase();

        }

        return nameParts[0].charAt(0).toUpperCase();
    }



    const initProfile = async () => {

        const resultUser = await getMe(token, userId);

        if (resultUser.succ) {

            setUser(resultUser.user);

        } else {

            navigate('/pageNotFound')

        }

        setLoadingUser(false);
    };


    const fetchPublicRecipes = async () => {

        setLoadingPublicRecipes(true);

        const response = await getUsersRecepies(
            token,
            publicPage,
            publicFilter,
            "public",
            userId
        );

        if (response.succ) {

            setPublicRecipes(
                response.recepies || []
            );

            setPublicPagination(
                response.pagination || {
                    numRecepies: 0,
                    totalPages: 0,
                    pageNumber: 1,
                    pageSize: PROFILE_RECIPE_PAGE_SIZE
                }
            );
            console.log("Public recipes fetched successfully:", response.recepies);

        } else if (response.status === 401) {

            navigate("/login");

        } else {

            console.log(
                "Failed to fetch public recipes:",
                response
            );

        }

        setLoadingPublicRecipes(false);
    };


    useEffect(() => {

        initProfile();

    }, []);


    useEffect(() => {

        fetchPublicRecipes();

    }, [token, publicPage, publicFilter]);




    const handlePublicSearch = () => {

        setPublicPage(1);

        setPublicFilter(publicSearch);

    };



    const handlePublicPrevious = () => {

        if (
            publicPage > 1 &&
            !loadingPublicRecipes
        ) {

            setPublicPage(
                prev => prev - 1
            );

        }
    };


    const handlePublicNext = () => {

        if (
            publicPage < publicPagination.totalPages &&
            !loadingPublicRecipes
        ) {

            setPublicPage(
                prev => prev + 1
            );

        }
    };


    async function updateInfoHandler() {

        if (!hasChanges()) {

            setEditMode(false);
            setGenderOpen(false);

            return;
        }

        const data = await editUser(
            token,
            user.name,
            user.email,
            user.description,
            user.age,
            user.gender === "not-disclosed"
                ? undefined
                : user.gender
        );

        if (data === true) {

            setEditMode(false);
            setGenderOpen(false);

            initProfile();

        } else {

            if (data.status === 200) {

                await resendCode(data.email);

                localStorage.setItem(
                    "codeSentAt",
                    new Date().toISOString()
                );

                navigate(`/verify?email=${data.email}`);

            } else if (data.status === 400) {

                console.log(data.error);

            } else if (data.status === 401) {

                navigate("/login");

            } else if (data.status === 404) {

                navigate("/pageNotFound");

            } else if (data.status === 500) {

                navigate("/internalServerError");

            }
        }
    }


    return (

        <div className="profile-component">

            <div className="profile-cover">

                <img
                    src={profileYellow}
                    alt="Profile cover"
                />
                <button
                    type="button"
                    className="profile-back-button"
                    onClick={() => navigate(-1)}
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    Back
                </button>
            </div>


            <div className="profile-picture-container">

                <div className="profile-picture">
                    {getUserInitials(user?.name)}
                </div>

            </div>
 

            <div className="profile-information">

                {/*za brisenje na profilo e voa treba da mu se stave event onclich so ke se povika endpointo za brisenje na profilo*/}    

                {(
                        loggedUser?._id === user?._id ||
                        loggedUser?.role?.roleName === "admin" ||
                        loggedUser?.role?.roleName === "userAdministrator"
                    ) && (
                        <i className="fa-solid fa-trash edit-other-users-profile-icon-trash"></i>
                )}

                {
                    loggedUser?._id === user?._id && (
                        editMode ? (
                            <>
                                <i className="fa-regular fa-square-check edit-profile-icon"
                                    onClick={updateInfoHandler}
                                ></i>

                                <i className="fa-solid fa-x edit-profile-icon-x"
                                    onClick={() => {
                                        setUser(originalUser);
                                        setEditMode(false);
                                        setGenderOpen(false);
                                    }}
                                ></i>
                            </>
                        ) : (
                            <i className="fa-solid fa-pen-to-square edit-profile-icon"
                                onClick={() => {
                                    setOriginalUser(structuredClone(user));
                                    setEditMode(true);
                                }}
                            ></i>
                        )
                    )
                }



                {
                    loadingUser ? (

                        <Spinner
                            w={20}
                            h={20}
                        />

                    ) : editMode ? (

                        <input
                            className="profile-input"
                            value={user?.name || ""}
                            onChange={(e) => {

                                setUser(prev => ({
                                    ...prev,
                                    name: e.target.value
                                }));

                            }}
                            placeholder="Full Name"
                        />

                    ) : (

                        <h1>
                            {user?.name}
                        </h1>

                    )
                }


                {
                    loadingUser ? (

                        <Spinner
                            w={20}
                            h={20}
                        />

                    ) : editMode ? (

                        <input
                            className="profile-input"
                            value={user?.email || ""}
                            onChange={(e) => {

                                setUser(prev => ({
                                    ...prev,
                                    email: e.target.value
                                }));

                            }}
                            placeholder="Email"
                        />

                    ) : (

                        <p className="profile-email">
                            {user?.email}
                        </p>

                    )
                }


                {
                    loadingUser ? (

                        <Spinner
                            w={20}
                            h={20}
                        />

                    ) : editMode ? (

                        <textarea
                            className="profile-textarea"
                            value={user?.description || ""}
                            onChange={(e) => {

                                setUser(prev => ({
                                    ...prev,
                                    description: e.target.value
                                }));

                            }}
                            placeholder="Description"
                        ></textarea>

                    ) : (

                        <p className="profile-description">

                            {
                                user?.description === ""
                                    ? "No description"
                                    : user?.description
                            }

                        </p>

                    )
                }


                <div className="profile-details">


                    <div className="profile-detail">

                        <i className="fa-solid fa-user-shield"></i>

                        <span>
                            Role
                        </span>

                        {
                            loadingUser ? (

                                <Spinner
                                    w={20}
                                    h={20}
                                />

                            ) : (

                                <strong>
                                    {user?.role.roleName}
                                </strong>

                            )
                        }

                    </div>


                    <div className="profile-detail">

                        <i className="fa-solid fa-cake-candles"></i>

                        <span>
                            Age
                        </span>

                        {
                            loadingUser ? (

                                <Spinner
                                    w={20}
                                    h={20}
                                />

                            ) : editMode ? (

                                <input
                                    type="number"
                                    className="profile-input-age"
                                    value={user?.age ?? ""}
                                    min="0"
                                    step="1"

                                    onKeyDown={(e) => {

                                        if (
                                            [
                                                "-",
                                                "+",
                                                "e",
                                                "E",
                                                ".",
                                                ","
                                            ].includes(e.key)
                                        ) {

                                            e.preventDefault();

                                        }

                                    }}

                                    onChange={(e) => {

                                        const value = e.target.value;

                                        if (value === "") {

                                            setUser(prev => ({
                                                ...prev,
                                                age: ""
                                            }));

                                            return;

                                        }

                                        const numberValue = Number(value);

                                        if (
                                            Number.isInteger(numberValue) &&
                                            numberValue >= 0
                                        ) {

                                            setUser(prev => ({
                                                ...prev,
                                                age: numberValue
                                            }));

                                        }

                                    }}

                                    placeholder="Age"
                                />

                            ) : (

                                <strong>
                                    {
                                        user?.age
                                            ? user.age + " years old"
                                            : "Age not disclosed"
                                    }
                                </strong>

                            )
                        }

                    </div>


                    <div className="profile-detail">

                        <i className="fa-solid fa-venus-mars"></i>

                        <span>
                            Gender
                        </span>

                        {
                        loadingUser ? (

                            <Spinner
                                w={20}
                                h={20}
                            />

                        ) : editMode ? (

                            <div className="custom-select-wrapper">

                                <div
                                    className={`custom-select ${
                                        genderOpen ? "open" : ""
                                    }`}
                                    onClick={() =>
                                        setGenderOpen(prev => !prev)
                                    }
                                >

                                    <span>
                                        {
                                            user?.gender === "female"
                                                ? "Female"
                                                : user?.gender === "male"
                                                    ? "Male"
                                                    : "Not disclosed"
                                        }
                                    </span>

                                    <i className="fa-solid fa-chevron-down"></i>

                                </div>

                                {
                                    genderOpen && (

                                        <div className="custom-select-options">

                                            <div
                                                className={`custom-option ${
                                                    user?.gender === "male"
                                                        ? "selected"
                                                        : ""
                                                }`}
                                                onClick={() => {

                                                    setUser(prev => ({
                                                        ...prev,
                                                        gender: "male"
                                                    }));

                                                    setGenderOpen(false);

                                                }}
                                            >

                                                <span>
                                                    Male
                                                </span>

                                                {
                                                    user?.gender === "male" && (
                                                        <i className="fa-solid fa-check"></i>
                                                    )
                                                }

                                            </div>


                                            <div
                                                className={`custom-option ${
                                                    user?.gender === "female"
                                                        ? "selected"
                                                        : ""
                                                }`}
                                                onClick={() => {

                                                    setUser(prev => ({
                                                        ...prev,
                                                        gender: "female"
                                                    }));

                                                    setGenderOpen(false);

                                                }}
                                            >

                                                <span>
                                                    Female
                                                </span>

                                                {
                                                    user?.gender === "female" && (
                                                        <i className="fa-solid fa-check"></i>
                                                    )
                                                }

                                            </div>


                                            <div
                                                className={`custom-option ${
                                                    !user?.gender ||
                                                    user?.gender === "not-disclosed"
                                                        ? "selected"
                                                        : ""
                                                }`}
                                                onClick={() => {

                                                    setUser(prev => ({
                                                        ...prev,
                                                        gender: "not-disclosed"
                                                    }));

                                                    setGenderOpen(false);

                                                }}
                                            >

                                                <span>
                                                    Not disclosed
                                                </span>

                                                {
                                                    (!user?.gender ||
                                                    user?.gender === "not-disclosed") && (
                                                        <i className="fa-solid fa-check"></i>
                                                    )
                                                }

                                            </div>

                                        </div>
                                    )
                                }

                            </div>

                        ) : (

                            <strong>

                                {
                                    user?.gender === "female"
                                        ? "Female"
                                        : user?.gender === "male"
                                            ? "Male"
                                            : "Not disclosed"
                                }

                            </strong>

                        )
                    }

                    </div>


                    <div className="profile-detail">

                        <i className="fa-solid fa-clock"></i>

                        <span>
                            Last Login
                        </span>

                        {
                            loadingUser ? (

                                <Spinner
                                    w={20}
                                    h={20}
                                />

                            ) : (

                                <strong>

                                    {
                                        new Date(
                                            user?.lastLogedIn
                                        ).toLocaleString(
                                            "en-UK",
                                            {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            }
                                        )
                                    }

                                </strong>

                            )
                        }

                    </div>


                </div>


                <div className="profile-statistics">


                    <div className="profile-stat">

                        <i className="fa-solid fa-star"></i>

                        <span>
                            Reviews Written
                        </span>

                        {
                            loadingUser ? (

                                <Spinner
                                    w={20}
                                    h={20}
                                />

                            ) : (

                                <strong>
                                    {user?.reviewsWriten}
                                </strong>

                            )
                        }

                    </div>


                    <div className="profile-stat">

                        <i className="fa-solid fa-bookmark"></i>

                        <span>
                            Bookmarks
                        </span>

                        {
                            loadingUser ? (

                                <Spinner
                                    w={20}
                                    h={20}
                                />

                            ) : (

                                <strong>
                                    {user?.bookmarks}
                                </strong>

                            )
                        }

                    </div>


                </div>


                <div className="my-profile-recipes">

                    <h2>
                        This user has {publicPagination.numRecepies} public recipe
                    </h2>

                    <div className="my-profile-recipes-section">

                        <div className="my-profile-recipes-section-header">

                            <h3>
                                THIS USERS RECIPES
                            </h3>

                            <div className="my-profile-recipes-search">

                                <i className="fa-solid fa-magnifying-glass"></i>

                                <input
                                    type="text"
                                    placeholder="Search public recipe..."
                                    value={publicSearch}
                                    onChange={(e) =>
                                        setPublicSearch(e.target.value)
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={handlePublicSearch}
                                >
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </button>

                            </div>

                        </div>

                        {
                            loadingPublicRecipes ? (

                                <div className="profile-recipes-loading">

                                    <Spinner
                                        w={100}
                                        h={100}
                                    />

                                </div>

                            ) : publicRecipes.length > 0 ? (

                                <div className="profile-recipes-grid">

                                    {
                                        publicRecipes.map(recipe => (

                                        <div className="profile-recipe-border"
                                                key={recipe._id}>
                                            <ElectricBorder
                                                color="#fdaa2d"
                                                speed={0.1}
                                                chaos={0.01}
                                                thickness={10}
                                            >
                                                <ProfileRecipeCardComponent
                                                    recipe={recipe}
                                                    setRecipes={setPublicRecipes}
                                                    isMe={false}
                                                />
                                            </ElectricBorder>
                                        </div>

                                        ))
                                    }

                                </div>

                            ) : (

                                <div className="no-profile-recipes">

                                    <i className="fa-solid fa-utensils"></i>

                                    <span>
                                        No public recipes found.
                                    </span>

                                </div>

                            )
                        }

                        <div className="profile-recipes-pagination">

                            <button
                                type="button"
                                disabled={
                                    publicPage === 1 ||
                                    loadingPublicRecipes
                                }
                                onClick={handlePublicPrevious}
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                                Back
                                
                            </button>

                            <span>
                                Page {publicPage} of{" "}
                                {publicPagination.totalPages || 1}
                            </span>

                            <button
                                type="button"
                                disabled={
                                    publicPage >= publicPagination.totalPages ||
                                    loadingPublicRecipes ||
                                    publicPagination.totalPages === 0
                                }
                                onClick={handlePublicNext}
                            >
                                <i className="fa-solid fa-arrow-right"></i>
                                Next
                            </button>

                        </div>

                    </div>

                </div>


            </div>

        </div>

    );
}
