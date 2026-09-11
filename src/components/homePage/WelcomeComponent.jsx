import { getUsers } from "../../utils/UserEndpoints";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/useAuth";
import { CATEGORIES, CUISINES } from "../../utils/enum";

import "./welcomeComponent.css";

export default function WelcomeComponent({ setFilters, typeRecipes, setTypeRecipes }) {

    const creatorRef = useRef(null);
    const categoryRef = useRef(null);
    const cuisineRef = useRef(null);

    const [creatorSearch, setCreatorSearch] = useState("");
    const [creatorSuggestions, setCreatorSuggestions] = useState([]);

    const [selectedCreatorId, setSelectedCreatorId] = useState("");

    const [categoryOpen, setCategoryOpen] = useState(false);
    const [cuisineOpen, setCuisineOpen] = useState(false);

    // DEFAULT = ALL
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedCuisine, setSelectedCuisine] = useState("all");

    const [recipeName, setRecipeName] = useState("");
    const [ingredientSearch, setIngredientSearch] = useState("");



    const [recipeTypeOpen, setRecipeTypeOpen] = useState(false);
    const recipeTypeRef = useRef(null);

    const { user, token } = useAuth();


    /* =========================
       CLOSE DROPDOWNS
    ========================= */

    useEffect(() => {

        const handleClickOutside = (e) => {

            if (
                creatorRef.current &&
                !creatorRef.current.contains(e.target)
            ) {
                setCreatorSuggestions([]);
            }

            if (
                categoryRef.current &&
                !categoryRef.current.contains(e.target)
            ) {
                setCategoryOpen(false);
            }

            if (
                cuisineRef.current &&
                !cuisineRef.current.contains(e.target)
            ) {
                setCuisineOpen(false);
            }
        };


        const handleEscape = (e) => {

            if (e.key === "Escape") {

                setCreatorSuggestions([]);
                setCategoryOpen(false);
                setCuisineOpen(false);

            }
        };


        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);


        return () => {

            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);

        };

    }, []);


    /* =========================
       CREATOR SEARCH
    ========================= */

    const handleCreatorChange = async (e) => {

        const value = e.target.value;

        setCreatorSearch(value);

        setSelectedCreatorId("");


        if (value.trim() === "") {

            setCreatorSuggestions([]);

            return;
        }


        const response = await getUsers(
            token,
            1,
            value,
            "",
            "all"
        );


        if (response.succ) {

            setCreatorSuggestions(
                response.users || []
            );

        } else if (response.status === 401) {

            setCreatorSuggestions([]);

        }

    };


    /* =========================
       SELECT CREATOR
    ========================= */

    const handleCreatorSelect = (selectedUser) => {

        setCreatorSearch(selectedUser.name);

        setSelectedCreatorId(selectedUser._id);

        setCreatorSuggestions([]);

    };


    /* =========================
       RECIPE NAME
    ========================= */

    const handleRecipeNameChange = (e) => {

        setRecipeName(e.target.value);

    };


    /* =========================
       INGREDIENT
    ========================= */

    const handleIngredientChange = (e) => {

        setIngredientSearch(e.target.value);

    };


    /* =========================
       CATEGORY
    ========================= */

    const handleCategorySelect = (category) => {

        setSelectedCategory(category);

        setCategoryOpen(false);

    };


    /* =========================
       CUISINE
    ========================= */

    const handleCuisineSelect = (cuisine) => {

        setSelectedCuisine(cuisine);

        setCuisineOpen(false);

    };


    /* =========================
       SEARCH
    ========================= */

    const handleSearch = () => {

        setFilters(prev => ({

            ...prev,

            name: recipeName,

            creator: selectedCreatorId,

            ingredients: ingredientSearch,

            category: selectedCategory,

            cuisine: selectedCuisine

        }));

    };


    return (

        <div className="welcome-component">

            {/* =========================
                WELCOME INFO
            ========================= */}

            <div className="welcome-info">

                <div className="welcome-text">
                    WELCOME, {user?.name}!
                </div>

                <div className="welcome-description">
                    Discover delicious recipes and find something new to cook today.
                </div>

            </div>


            {/* =========================
                SEARCH
            ========================= */}

            <div className="home-search">

                <div className="home-search-toolbar">

                    {/*****************Recomended filter************************/}

                    <div className="home-recipe-type-select" ref={recipeTypeRef} >

                        <button
                            type="button"
                            className="home-recipe-type-select-button"
                            onClick={() => {

                                setRecipeTypeOpen(prev => !prev);

                                setCategoryOpen(false);
                                setCuisineOpen(false);

                            }}
                        >

                            <span>

                                {typeRecipes === "recipes"
                                    ? "Normal Recipes"
                                    : "Recommended Recipes"}

                            </span>

                            <i
                                className={`fa-solid fa-chevron-down ${
                                    recipeTypeOpen ? "rotate" : ""
                                }`}
                            ></i>

                        </button>


                        {recipeTypeOpen && (

                            <div className="home-recipe-type-select-options">

                                <button
                                    type="button"
                                    className={`home-recipe-type-select-option ${
                                        typeRecipes === "recipes"
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() => {

                                        setTypeRecipes("recipes");
                                        setRecipeTypeOpen(false);

                                    }}
                                >
                                    Normal Recipes
                                </button>


                                <button
                                    type="button"
                                    className={`home-recipe-type-select-option ${
                                        typeRecipes === "recommended"
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() => {

                                        setTypeRecipes("recommended");
                                        setRecipeTypeOpen(false);

                                    }}
                                >
                                    Recommended Recipes
                                </button>

                            </div>

                        )}

                    </div>



                    {/* =========================
                        CREATOR
                    ========================= */}

                    <div
                        className="home-search-input home-creator-search"
                        ref={creatorRef}
                    >

                        <i className="fa-solid fa-user"></i>

                        <input
                            type="text"
                            placeholder="Search recipe by creator..."
                            value={creatorSearch}
                            onChange={handleCreatorChange}
                        />


                        {creatorSuggestions.length > 0 && (

                            <div className="home-creator-suggestions">

                                {creatorSuggestions.map(user => (

                                    <button
                                        type="button"
                                        key={user._id}
                                        onClick={() =>
                                            handleCreatorSelect(user)
                                        }
                                    >
                                        {user.name}
                                    </button>

                                ))}

                            </div>

                        )}

                    </div>


                    {/* =========================
                        RECIPE NAME
                    ========================= */}

                    <div className="home-search-input">

                        <i className="fa-solid fa-utensils"></i>

                        <input
                            type="text"
                            placeholder="Search recipe by name..."
                            value={recipeName}
                            onChange={handleRecipeNameChange}
                        />

                    </div>


                    {/* =========================
                        INGREDIENT
                    ========================= */}

                    <div className="home-search-input">

                        <i className="fa-solid fa-carrot"></i>

                        <input
                            type="text"
                            placeholder="Search recipe by ingredient..."
                            value={ingredientSearch}
                            onChange={handleIngredientChange}
                        />

                    </div>


                    {/* =========================
                        CATEGORY
                    ========================= */}

                    <div
                        className="home-category-select"
                        ref={categoryRef}
                    >

                        <button
                            type="button"
                            className="home-category-select-button"
                            onClick={() => {

                                setCategoryOpen(prev => !prev);
                                setCuisineOpen(false);

                            }}
                        >

                            <span>

                                {selectedCategory === "all"
                                    ? "All Categories"
                                    : selectedCategory}

                            </span>


                            <i
                                className={`fa-solid fa-chevron-down ${
                                    categoryOpen ? "rotate" : ""
                                }`}
                            ></i>

                        </button>


                        {categoryOpen && (

                            <div className="home-category-select-options">

                                <button
                                    type="button"
                                    className={`home-category-select-option ${
                                        selectedCategory === "all"
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleCategorySelect("all")
                                    }
                                >
                                    All Categories
                                </button>


                                {CATEGORIES
                                    .filter(category => category !== "all")
                                    .map(category => (

                                        <button
                                            type="button"
                                            key={category}
                                            className={`home-category-select-option ${
                                                selectedCategory === category
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleCategorySelect(category)
                                            }
                                        >
                                            {category}
                                        </button>

                                    ))
                                }

                            </div>

                        )}

                    </div>


                    {/* =========================
                        CUISINE
                    ========================= */}

                    <div
                        className="home-cuisine-select"
                        ref={cuisineRef}
                    >

                        <button
                            type="button"
                            className="home-cuisine-select-button"
                            onClick={() => {

                                setCuisineOpen(prev => !prev);
                                setCategoryOpen(false);

                            }}
                        >

                            <span>

                                {selectedCuisine === "all"
                                    ? "All Cuisines"
                                    : selectedCuisine}

                            </span>


                            <i
                                className={`fa-solid fa-chevron-down ${
                                    cuisineOpen ? "rotate" : ""
                                }`}
                            ></i>

                        </button>


                        {cuisineOpen && (

                            <div className="home-cuisine-select-options">

                                <button
                                    type="button"
                                    className={`home-cuisine-select-option ${
                                        selectedCuisine === "all"
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleCuisineSelect("all")
                                    }
                                >
                                    All Cuisines
                                </button>


                                {CUISINES
                                    .filter(cuisine => cuisine !== "all")
                                    .map(cuisine => (

                                        <button
                                            type="button"
                                            key={cuisine}
                                            className={`home-cuisine-select-option ${
                                                selectedCuisine === cuisine
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleCuisineSelect(cuisine)
                                            }
                                        >
                                            {cuisine}
                                        </button>

                                    ))
                                }

                            </div>

                        )}

                    </div>


                    {/* =========================
                        SEARCH BUTTON
                    ========================= */}

                    <button
                        type="button"
                        className="home-search-button"
                        onClick={handleSearch}
                    >

                        <i className="fa-solid fa-magnifying-glass"></i>

                    </button>

                </div>

            </div>

        </div>

    );

}