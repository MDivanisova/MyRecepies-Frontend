import { deleteUser, editUser, getMe, getUsersRecepies, resendCode } from "../../utils/UserEndpoints";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { PROFILE_RECIPE_PAGE_SIZE } from "../../utils/enum";
import ProfileRecipeCardComponent from "./ProfileRecipeCardComponent";
import ElectricBorder from "../ElectricBorder";


import profileYellow from "../../assets/profileYellow.jpeg";

import Spinner from "../Spiner";
import "./profileComponent.css";

//treba uste da se dodade ako on izbrise nesto od toa so e zadolzitelno da mu se pojave ili popup ili nes takvo deka
//tie polinja se zadolzitelni kako Full Name email i gender 


export default function ProfileComponent() {

    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [originalUser, setOriginalUser] = useState({});
    const [loadingUser, setLoadingUser] = useState(true);

    const [editMode, setEditMode] = useState(false);
    const [genderOpen, setGenderOpen] = useState(false);

    const [errMessageName, setErrMessageName] = useState("");
    const [errMessageEmail, setErrMessageEmail] = useState("");
    const [errMessageDescription, setErrMessageDescription] = useState("");
    const [errMessageAge, setErrMessageAge] = useState("");


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

        const nameError = validateName(user.name || "");
        const emailError = validateEmail(user.email || "");
        const descriptionError = validateDescription(user.description || "");
        const ageError = validateAge(user.age);

        setErrMessageName(nameError);
        setErrMessageEmail(emailError);
        setErrMessageDescription(descriptionError);
        setErrMessageAge(ageError);

        if (
            nameError ||
            emailError ||
            descriptionError ||
            ageError
        ) {

            return;

        }

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
            user.gender === ""
                ? undefined
                : user.gender
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

    function isProfileFormInvalid() {
        return (
            validateName(user?.name || "") ||
            validateEmail(user?.email || "")
        );
    }

    function validateName(value) {

        if (value.trim() === "") {

            return "name is required";

        }

        if (value.trim().length < 3) {

            return "name must be at least 3 characters";

        }

        if (value.trim().length > 50) {

            return "name can't be more than 50 characters";

        }

        return "";
    }


    function validateEmail(value) {

        if (value.trim() === "") {

            return "email is required";

        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {

            return "invalid email";

        }

        return "";
    }


    function validateDescription(value) {

        if (value.length > 255) {

            return "description can't be longer than 255 characters";

        }

        return "";
    }


    function validateAge(value) {

        if (value === "" || value === null || value === undefined) {

            return "";

        }

        if (!Number.isInteger(Number(value)) || Number(value) <= 0) {

            return "age must be a positive number";

        }

        return "";
    }



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


    async function handleDelete(){
        const data = await deleteUser(token, user._id);

        if(data.succ === true){
            logout();
            alert("You have deleted your profile redirecting to sign up");
            navigate("/login");
        }
        else if (data.status === 400) {

                console.log(data.error);

                //za validaciskite errori ni gi dava

            } else if (data.status === 401) {
                logout();
                alert("Your session has expired, please log in again");
                navigate("/login");

            } else if (data.status === 404) {

                navigate("/pageNotFound");

            } else if (data.status === 500) {

                navigate("/internalServerError");

            }
    }


    return (

        <div className="profile-component">

            <div className="profile-cover">

                <img
                    src={profileYellow}
                    alt="Profile cover"
                />

            </div>


            <div className="profile-picture-container">

                <div className="profile-picture">
                    {getUserInitials(user?.name)}
                </div>

            </div>
 

            <div className="profile-information">

                {/*za brisenje na profilo e voa treba da mu se stave event onclich so ke se povika endpointo za brisenje na profilo*/}    

                <i className="fa-solid fa-trash edit-other-users-profile-icon-trash" onClick={()=> handleDelete()}></i>

                {
                    editMode ? (

                        <>

                            <button
                                type="button"
                                className="edit-profile-save-button"
                                onClick={updateInfoHandler}
                                disabled={isProfileFormInvalid()}
                            >
                                <i className="fa-regular fa-square-check"></i>
                            </button>

                            <i
                                className="fa-solid fa-x edit-profile-icon-x"
                                onClick={() => {
                                    
                                    setErrMessageName("");
                                    setErrMessageEmail("");
                                    setErrMessageDescription("");
                                    setErrMessageAge("");
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

                        <div className="profile-input-field">
                            <input
                                className="profile-input"
                                value={user?.name}
                                 onChange={(e) => {

                                    const value = e.target.value;

                                    setUser(prev => ({
                                        ...prev,
                                        name: value
                                    }));

                                    setErrMessageName(
                                        validateName(value)
                                    );

                                }}
                                placeholder="Full Name"
                            />
                             {
                                errMessageName && (
                                    <span className="form-error">
                                        {errMessageName}
                                    </span>
                                )
                            }
                        </div>
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
                        <div className="profile-input-field">
                            <input
                                className="profile-input"
                                value={user?.email}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setUser(prev => ({
                                        ...prev,
                                        email: value
                                    }));

                                    setErrMessageEmail(
                                        validateEmail(value)
                                    );

                                }}
                                placeholder="Email"
                            />
                             {
                                errMessageEmail && (
                                    <span className="form-error">
                                        {errMessageEmail}
                                    </span>
                                )
                            }
                        </div>
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

                        <div className="profile-textarea-field">
                            <textarea
                                className="profile-textarea"
                                value={user?.description || ""}
                                onChange={(e) => {

                                    const value = e.target.value;

                                    setUser(prev => ({
                                        ...prev,
                                        description: value
                                    }));

                                    setErrMessageDescription(
                                        validateDescription(value)
                                    );

                                }}
                                placeholder="Description"
                            ></textarea>

                            {
                                errMessageDescription && (
                                    <span className="form-error">
                                        {errMessageDescription}
                                    </span>
                                )
                            }
                        </div>

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
                                    <div className="profile-age-field">

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

                                                    setErrMessageAge("");

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

                                                    setErrMessageAge(
                                                        validateAge(numberValue)
                                                    );

                                                }

                                            }}

                                            placeholder="Age"
                                        />

                                        {
                                            errMessageAge && (
                                                <span className="form-error">
                                                    {errMessageAge}
                                                </span>
                                            )
                                        }

                                    </div>
                            ) : (

                                <strong>
                                    {user.age ? user.age + " years old": "Age not disclosed"}
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
                                                        !user?.gender
                                                            ? "selected"
                                                            : ""
                                                    }`}
                                                    onClick={() => {

                                                        setUser(prev => ({
                                                            ...prev,
                                                            gender: ""
                                                        }));

                                                        setGenderOpen(false);

                                                    }}
                                                >

                                                    <span>
                                                        Not disclosed
                                                    </span>

                                                    {
                                                        !user?.gender && (
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
                                                    isMe={true}
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
                                                    isMe={true}
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
