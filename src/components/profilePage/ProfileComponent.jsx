import { editUser, getMe, getUsersRecepies, resendCode } from "../../utils/UserEndpoints";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { PROFILE_RECIPE_PAGE_SIZE } from "../../utils/enum";
import ProfileRecipeCardComponent from "./ProfileRecipeCardComponent";
import ElectricBorder from "../ElectricBorder";

import Spinner from "../Spiner";
import "./profileComponent.css";

//treba uste da se dodade ako on izbrise nesto od toa so e zadolzitelno da mu se pojave ili popup ili nes takvo deka
//tie polinja se zadolzitelni kako Full Name email i gender 


export default function ProfileComponent() {

    const { token } = useAuth();
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [originalUser, setOriginalUser] = useState({});
    const [loadingUser, setLoadingUser] = useState(true);

    const [editMode, setEditMode] = useState(false);
    const [genderOpen, setGenderOpen] = useState(false);


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


    const [privateRecipes, setPrivateRecipes] = useState([]);

    const [privateSearch, setPrivateSearch] = useState("");
    const [privateFilter, setPrivateFilter] = useState("");

    const [privatePage, setPrivatePage] = useState(1);

    const [privatePagination, setPrivatePagination] = useState({
        numRecepies: 0,
        totalPages: 0,
        pageNumber: 1,
        pageSize: PROFILE_RECIPE_PAGE_SIZE
    });

    const [loadingPrivateRecipes, setLoadingPrivateRecipes] = useState(false);


    const hasChanges = () => {
        return (
            user.name !== originalUser.name ||
            user.email !== originalUser.email ||
            user.description !== originalUser.description ||
            user.age !== originalUser.age ||
            user.gender !== originalUser.gender
        );
    };


    const initProfile = async () => {

        //if (!token) return;

        const resultUser = await getMe(token);

        if (resultUser.succ) {

            setUser(resultUser.user);

        } else {

            console.log("Failed to fetch user:", resultUser);

            //ako e false za kaj redirekt
        }

        setLoadingUser(false);
    };


    const fetchPublicRecipes = async () => {

        if (!token) return;

        setLoadingPublicRecipes(true);

        const response = await getUsersRecepies(
            token,
            publicPage,
            publicFilter,
            "public"
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


    const fetchPrivateRecipes = async () => {

        if (!token) return;

        setLoadingPrivateRecipes(true);

        const response = await getUsersRecepies(
            token,
            privatePage,
            privateFilter,
            "private"
        );

        if (response.succ) {

            setPrivateRecipes(
                response.recepies || []
            );

            setPrivatePagination(
                response.pagination || {
                    numRecepies: 0,
                    totalPages: 0,
                    pageNumber: 1,
                    pageSize: PROFILE_RECIPE_PAGE_SIZE
                }
            );

        } else if (response.status === 401) {

            navigate("/login");

        } else {

            console.log(
                "Failed to fetch private recipes:",
                response
            );

        }

        setLoadingPrivateRecipes(false);
    };


    useEffect(() => {

        initProfile();

    }, []);


    useEffect(() => {

        fetchPublicRecipes();

    }, [token, publicPage, publicFilter]);


    useEffect(() => {

        fetchPrivateRecipes();

    }, [token, privatePage, privateFilter]);


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
            user.gender
        );

        if (data === true) {

            setEditMode(false);

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

                //za validaciskite errori ni gi dava

            } else if (data.status === 401) {

                //popup deka sesijata mu e istecena

                // da se dodade otposle da pamte do kaj zastanal usero na koja strana ako mu izmine tokeno kako ke se logira direktno tam da go nose

            } else if (data.status === 404) {

                navigate("/pageNotFound");

            } else if (data.status === 500) {

                navigate("/internalServerError");

            }
        }
    }


    const handlePublicSearch = () => {

        setPublicPage(1);

        setPublicFilter(publicSearch);

    };


    const handlePrivateSearch = () => {

        setPrivatePage(1);

        setPrivateFilter(privateSearch);

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


    const handlePrivatePrevious = () => {

        if (
            privatePage > 1 &&
            !loadingPrivateRecipes
        ) {

            setPrivatePage(
                prev => prev - 1
            );

        }
    };


    const handlePrivateNext = () => {

        if (
            privatePage < privatePagination.totalPages &&
            !loadingPrivateRecipes
        ) {

            setPrivatePage(
                prev => prev + 1
            );

        }
    };


    return (

        <div className="profile-component">

            <div className="profile-cover">

                <img
                    src="/src/assets/profileYellow.jpeg"
                    alt="Profile cover"
                />

            </div>


            <div className="profile-picture-container">

                <img
                    src={
                        user?.gender == "female"
                            ? "/src/assets/femaleProfile.jpeg"
                            : "/src/assets/maleProfile.jpeg"
                    }
                    alt="Profile"
                    className="profile-picture"
                />

            </div>
 

            <div className="profile-information">

                {/*za brisenje na profilo e voa treba da mu se stave event onclich so ke se povika endpointo za brisenje na profilo*/}    

                <i className="fa-solid fa-trash edit-profile-icon-trash"></i>

                {
                    editMode ? (

                        <>

                            <i
                                className="fa-regular fa-square-check edit-profile-icon"
                                onClick={updateInfoHandler}
                            ></i>

                            <i
                                className="fa-solid fa-x edit-profile-icon-x"
                                onClick={() => {

                                    setUser(originalUser);
                                    setEditMode(false);
                                    setGenderOpen(false);

                                }}
                            ></i>

                        </>

                    ) : (
                    <>
                        <i
                            className="fa-solid fa-pen-to-square edit-profile-icon"
                            onClick={() => {

                                setOriginalUser(
                                    structuredClone(user)
                                );

                                setEditMode(true);

                            }}
                        ></i>

                   </> )
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
                            value={user?.name}
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
                            value={user?.email}
                            onChange={(e) => {

                                setUser(prev => ({
                                    ...user,
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
                            value={user?.description}
                            onChange={(e) => {

                                setUser(prev => ({
                                    ...user,
                                    description: e.target.value
                                }));

                            }}
                            placeholder="Description"
                        ></textarea>

                    ) : (

                        <p className="profile-description">

                            {
                                user.description === ""
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

                                        const value =
                                            e.target.value;

                                        if (value === "") {

                                            setUser(prev => ({
                                                ...prev,
                                                age: ""
                                            }));

                                            return;

                                        }

                                        const numberValue =
                                            Number(value);

                                        if (
                                            Number.isInteger(
                                                numberValue
                                            ) &&
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
                                    {user?.age} years old
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
                                            genderOpen
                                                ? "open"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setGenderOpen(
                                                prev => !prev
                                            )
                                        }
                                    >

                                        <span>

                                            {
                                                user?.gender === "female"
                                                    ? "Female"
                                                    : "Male"
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


                                            </div>

                                        )
                                    }

                                </div>

                            ) : (

                                <strong>

                                    {
                                        user?.gender
                                            ? user.gender
                                                .charAt(0)
                                                .toUpperCase() +
                                              user.gender.slice(1)
                                            : "Not specified"
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
                        MY RECIPES
                    </h2>

                    <div className="my-profile-recipes-section">

                        <div className="my-profile-recipes-section-header">

                            <h3>
                                MY PUBLIC RECIPES
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


                    <div className="my-profile-recipes-section private-profile-recipes-section">

                        <div className="my-profile-recipes-section-header">

                            <h3>
                                MY PRIVATE RECIPES
                            </h3>

                            <div className="my-profile-recipes-search">

                                <i className="fa-solid fa-magnifying-glass"></i>

                                <input
                                    type="text"
                                    placeholder="Search private recipe..."
                                    value={privateSearch}
                                    onChange={(e) =>
                                        setPrivateSearch(e.target.value)
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={handlePrivateSearch}
                                >
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </button>

                            </div>

                        </div>

                        {
                            loadingPrivateRecipes ? (

                                <div className="profile-recipes-loading">

                                    <Spinner
                                        w={100}
                                        h={100}
                                    />

                                </div>

                            ) : privateRecipes.length > 0 ? (

                                <div className="profile-recipes-grid">

                                    {
                                        privateRecipes.map(recipe => (
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
                                                    setRecipes={setPrivateRecipes}
                                                />
                                            </ElectricBorder>
                                        </div>

                                        ))
                                    }

                                </div>

                            ) : (

                                <div className="no-profile-recipes">

                                    <i className="fa-solid fa-lock"></i>

                                    <span>
                                        No private recipes found.
                                    </span>

                                </div>

                            )
                        }

                        <div className="profile-recipes-pagination">

                            <button
                                type="button"
                                disabled={
                                    privatePage === 1 ||
                                    loadingPrivateRecipes
                                }
                                onClick={handlePrivatePrevious}
                            >
                                <i className="fa-solid fa-arrow-left"></i>
                                Back
                            </button>

                            <span>
                                Page {privatePage} of{" "}
                                {privatePagination.totalPages || 1}
                            </span>

                            <button
                                type="button"
                                disabled={
                                    privatePage >= privatePagination.totalPages ||
                                    loadingPrivateRecipes ||
                                    privatePagination.totalPages === 0
                                }
                                onClick={handlePrivateNext}
                            >
                                Next
                                <i className="fa-solid fa-arrow-right"></i>
                            </button>

                        </div>

                    </div>

                </div>


            </div>

        </div>

    );
}
