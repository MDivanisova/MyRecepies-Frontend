import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

import "./recipeDetailComponent.css";import { getRecepie, removeRecipe, editRecepie} from "../../utils/RecepieEndpoint";
import ReviewComponent from "./ReviewComponent";
import OtherReviewsComponent from "./OtherReviewsComponent";
import { deleteReview, getReviews } from "../../utils/ReviewEndpoint";
import { getRatingStatistics } from "../../utils/RatingEndpoint";

import { createBookmark, removeBookmark} from "../../utils/BookmarkEndpoint";
import {getMyBookmarks} from "../../utils/UserEndpoints"

import CategoryComponent from "../addRecepiePage/Step1Components/CategoryCompinent";
import CuisineComponent from "../addRecepiePage/Step1Components/CuisineComponent";
import CookingMethodComponent from "../addRecepiePage/Step2Components/CookingMethodComponent";
import ToolEquipmentComponent from "../addRecepiePage/Step2Components/ToolEquipmentComponent";

import Spinner from "../Spiner";

export default function RecipeDetailComponent() {

    const { recipeId } = useParams();
    const { token, logout, user } = useAuth();
    const [recipe, setRecipe] = useState();
    const [checked, setChecked] = useState({});
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const skiptReview = useRef(reviews.length);
    const [moreReviews, setMoreReviews] = useState(false);
    const commentsRef = useRef(null);
    const [edit, setEdit] = useState(false);
    const [refetchRecipe, setRefetchRecipe] = useState(false);

    const [editRecipeData, setEditRecipeData] = useState({
        recipeName: "",
        categories: [],
        cuisines: [],
        cookingMethods: [],
        tools: [],
        ingredients: [],
        instructions: [],
        preparationTime: "",
        cookingTime: "",
        nutrition: {

            calories: "",
            protein: "",
            carbohydrates: "",
            fat: "",
            saturatedFat: "",
            unsaturatedFat: "",
            fiber: "",
            sugar: "",
            cholesterol: "",
            sodium: ""

        },
        imageUrl: "",
        visibility: "",
    });

    const [errMessageRecipeName, setErrMessageRecipeName] = useState("");
    const [errMessagePreparationTime, setErrMessagePreparationTime] = useState("");
    const [errMessageCookingTime, setErrMessageCookingTime] = useState("");
    const [errMessageIngredients, setErrMessageIngredients] = useState([]);
    const [errMessageInstructions, setErrMessageInstructions] = useState([]);
    const [errMessageNutrition, setErrMessageNutrition] = useState({});
    const [errMessageCategory, setErrMessageCategory] = useState("");
    const [errMessageCuisine, setErrMessageCuisine] = useState("");
    const [errMessageImageUrl, setErrMessageImageUrl] = useState("");
    const [errMessageCookingMethod, setErrMessageCookingMethod] = useState("");
    const [errMessageTools, setErrMessageTools] = useState("");


    
 
    const [selectedRatingFilter, setSelectedRatingFilter] = useState(0);
    const [ratingStatistics, setRatingStatistics] = useState({
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
        all: 0
    });

    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState("");

    const [isBookmarked, setIsBookmarked] = useState(false);

    const [deleting, setDeleting] = useState(false);

    const nutritionUnits = {
        calories: "kcal",
        protein: "g",
        carbohydrates: "g",
        fat: "g",
        saturatedFat: "g",
        unsaturatedFat: "g",
        fiber: "g",
        sugar: "g",
        cholesterol: "mg",
        sodium: "mg"
    };

    function formatNutritionForSave(nutrition) {

        const formatted = {};

        for (const key in nutritionUnits) {

            const value = nutrition[key];

            formatted[key] =
                value !== "" && value !== undefined && value !== null
                    ? `${value} ${nutritionUnits[key]}`
                    : "";
        }

        return formatted;
    }


    const toggleChecked = (index) => {

        setChecked((prev) => ({

            ...prev,
            [index]: !prev[index]

        }));
    };

    const ingredientsListRef = useRef(null);

    function validateIngredient(index, field, value) {

        setErrMessageIngredients(prev => {

            const errors = [...prev];

            if (!errors[index]) {
                errors[index] = {};
            }

            if (value.trim() === "") {
                errors[index][field] = `${field} is required`;
            } else {
                errors[index][field] = "";
            }

            return errors;
        });
    }

    function addIngredient() {
        setEditRecipeData(prev => ({
            ...prev,
            ingredients: [
                ...prev.ingredients,
                {
                    ingredient: "",
                    quantity: "",
                    unit: "",
                    misc: ""
                }
            ]
        }));
    }


    function updateIngredient(index, field, value) {

        setEditRecipeData(prev => {

            const ingredients = [...prev.ingredients];

            ingredients[index] = {

                ...ingredients[index],

                [field]: value

            };

            return {

                ...prev,

                ingredients

            };

        });

        validateIngredient(index, field, value);

    }


    function removeIngredient(index) {

        setEditRecipeData(prev => {

            if (prev.ingredients.length <= 1) {

                return prev;

            }

            return {

                ...prev,

                ingredients: prev.ingredients.filter(
                    (_, i) => i !== index
                )

            };

        });

        setErrMessageIngredients(prev =>
            prev.filter((_, i) => i !== index)
        );

    }


    function handleQuantityChange(index, value) {

        // Dozvoli slobodno vnesuvanje - brojki, bukvi, razmaci, kosa crta itn.
        updateIngredient(
            index,
            "quantity",
            value
        );

    }


    function handleTextChange(index, field, value) {

        if (/\d/.test(value)) {

            return;

        }

        updateIngredient(
            index,
            field,
            value
        );

    }



    function handleNutritionChange(e) {

        const { name, value } = e.target;

        if (
            value !== "" &&
            !/^\d+(\.\d+)?$/.test(value)
        ) {

            return;

        }

        setEditRecipeData(prev => ({

            ...prev,

            nutrition: {

                ...prev.nutrition,

                [name]: value

            }

        }));

        setErrMessageNutrition(prev => ({
            ...prev,
            [name]:
                value.trim() === ""
                    ? `${name} is required`
                    : ""
        }));

    }

    function getNutritionNumber(value) {
        if (value === undefined || value === null) {
            return "";
        }

        const match = String(value).match(/\d+(\.\d+)?/);

        return match ? match[0] : "";
    }


    function validateImageUrl(value) {

        if (value.trim() === "") {
            return "image URL is required";
        }

        return "";
    }

   function handleImageUrlChange(e) {

        const { value } = e.target;

        setEditRecipeData(prev => ({
            ...prev,
            imageUrl: value
        }));

        setErrMessageImageUrl(validateImageUrl(value));

    }


    const instructionsListRef = useRef(null);

    function addInstruction() {

        setEditRecipeData(prev => ({

            ...prev,

            instructions: [

                ...prev.instructions,

                ""

            ]

        }));

        setTimeout(() => {

            instructionsListRef.current?.scrollTo({

                top: instructionsListRef.current.scrollHeight,

                behavior: "smooth"

            });

        }, 0);

    }


   function validateInstruction(index, value) {

        setErrMessageInstructions(prev => {

            const errors = [...prev];

            if (value.trim() === "") {
                errors[index] = "instruction is required";
            } else {
                errors[index] = "";
            }

            return errors;
        });
    }


    function updateInstruction(index, value) {

        setEditRecipeData(prev => {

            const instructions = [

                ...prev.instructions

            ];

            instructions[index] = value;

            return {

                ...prev,

                instructions

            };

        });

        validateInstruction(index, value);

    }


    function removeInstruction(index) {

        setEditRecipeData(prev => {

            if (prev.instructions.length <= 1) {

                return prev;

            }

            return {

                ...prev,

                instructions: prev.instructions.filter(

                    (_, i) => i !== index

                )

            };

        });

        setErrMessageInstructions(prev =>
            prev.filter((_, i) => i !== index)
        );

    }


    function validateRecipeName(value) {

        const trimmedValue = value.trim();

        if (trimmedValue.length === 0) {
            return "recipe name is required";
        }

        if (trimmedValue.length < 3) {
            return "name must be at least 3 characters";
        }

        if (trimmedValue.length > 50) {
            return "name can't be more than 50 characters";
        }

        return "";
    }

    function validatePrepTime(value) {

        if (value === "" || Number(value) < 0) {
            return "Prep time is required";
        }

        return "";
    }

    function validateCookTime(value) {

        if (value === "" || Number(value) < 0) {
            return "Cook time is required";
        }

        return "";
    }



    async function fetchRatingStatistics(recipeId) {

        const data = await getRatingStatistics(token, recipeId);
        console.log(data);

        if(data.succ === true){

            setRatingStatistics(data.ratings);

        }
        else if(data.status === 401){

            logout();
            alert("Your token has expired please login again.");
            navigate("/login");

        }
        else if(data.status === 404){

            navigate("/pageNotFound");

        }
        else if(data.status === 500){

            navigate("/internalServerError");

        }
    }



    async function handleCreateBookmark() {
        setIsBookmarked(true);
        setRecipe(prev => ({
                ...prev,
                numberBookmarks: prev.numberBookmarks + 1
            }));
        const data = await createBookmark(token, recipeId);

        if(data.succ === true){
            return
        }
        else if(data.status === 401){
            logout();
            alert("Your token has expired please login again.");
            navigate("/login");
        }
        else if(data.status === 404){
            navigate("/pageNotFound");
        }
        else if(data.status === 500){
            setIsBookmarked(false);
            setRecipe(prev => ({
                ...prev,
                numberBookmarks: prev.numberBookmarks - 1
            }));
            navigate("/internalServerError");
        }
    }


    async function handleRemoveBookmark() {
        setIsBookmarked(false);
            setRecipe(prev => ({
                ...prev,
                numberBookmarks: prev.numberBookmarks - 1
            }));
        const data = await removeBookmark(token, recipeId);

        if(data.succ === true){
            return
        }
        else if(data.status === 401){
            logout();
            alert("Your token has expired please login again.");
            navigate("/login");
        }
        else if(data.status === 404){
            navigate("/pageNotFound");
        }
        else if(data.status === 500){
            setIsBookmarked(true);
            setRecipe(prev => ({
                ...prev,
                numberBookmarks: prev.numberBookmarks + 1
            }));
            navigate("/internalServerError");
        }
    }

    async function handleDeleteClick() {

        setDeleting(true);

        const data = await removeRecipe(
            token,
            recipeId
        );

        if(data.succ === true){

            navigate("/");

        }
        else if(data.status === 401){

            logout();
            alert("Your token has expired please login again.");
            navigate("/login");

        }
        else if(data.status === 404){

            navigate("/pageNotFound");

        }
        else if(data.status === 500){

            navigate("/internalServerError");

        }
        setDeleting(false);
    }


    function handleEditClick(){
        setEdit(true);
    }

    function hasValidationErrors() {
        if (errMessageRecipeName) return true;
        if (errMessagePreparationTime) return true;
        if (errMessageCookingTime) return true;
        if (errMessageCategory) return true;
        if (errMessageCuisine) return true;
        if (errMessageImageUrl) return true;
        if (errMessageCookingMethod) return true;
        if (errMessageTools) return true;

        if (errMessageIngredients.some(error =>
            error && Object.values(error).some(message => message)
        )) {
            return true;
        }

        if (errMessageInstructions.some(error => error)) {
            return true;
        }

        if (Object.values(errMessageNutrition).some(error => error)) {
            return true;
        }

        return false;
    }

    async function handleSaveClick(){

        const result = await editRecepie(
            token,
            recipe._id,
            {
                name: editRecipeData.recipeName,
                preparationTime: editRecipeData.preparationTime,
                cookingTime: editRecipeData.cookingTime,
                category: editRecipeData.categories,
                cuisine: editRecipeData.cuisines,
                ingredients: editRecipeData.ingredients,
                instructions: editRecipeData.instructions,
                cookingMethods: editRecipeData.cookingMethods,
                tools: editRecipeData.tools,
                nutrition: formatNutritionForSave (editRecipeData.nutrition),
                imageUrl: editRecipeData.imageUrl,
                visibility: editRecipeData.visibility
            }
        );

        if(result.succ){
            setEdit(false);
            setRefetchRecipe(prev => !prev);
        }
    }



    async function fetchRecipe(recipeId) {
        
        const data = await getRecepie(token, recipeId);

        if(data.succ === true){

            setRecipe(data.recepie);

            setEditRecipeData({
                recipeName: data.recepie.name,
                categories: data.recepie.category,
                cuisines: data.recepie.cuisine,
                cookingMethods: data.recepie.cookingMethods,
                tools: data.recepie.tools,
                ingredients: data.recepie.ingredients,
                instructions: data.recepie.instructions,
                preparationTime: data.recepie.preparationTime.$numberDecimal,
                cookingTime: data.recepie.cookingTime.$numberDecimal,
                nutrition: {
                    calories: getNutritionNumber(data.recepie.nutrition.calories),
                    protein: getNutritionNumber(data.recepie.nutrition.protein),
                    carbohydrates: getNutritionNumber(data.recepie.nutrition.carbohydrates),
                    fat: getNutritionNumber(data.recepie.nutrition.fat),
                    saturatedFat: getNutritionNumber(data.recepie.nutrition.saturatedFat),
                    unsaturatedFat: getNutritionNumber(data.recepie.nutrition.unsaturatedFat),
                    fiber: getNutritionNumber(data.recepie.nutrition.fiber),
                    sugar: getNutritionNumber(data.recepie.nutrition.sugar),
                    cholesterol: getNutritionNumber(data.recepie.nutrition.cholesterol),
                    sodium: getNutritionNumber(data.recepie.nutrition.sodium)
                },
                imageUrl: data.recepie.imageUrl,
                visibility: data.recepie.visibility,
            });

            const bookmarksData = await getMyBookmarks(
                token,
                1,
                "",
                "",
                "",
                "all",
                "all"
            );

            if(bookmarksData.succ === true){

                const bookmarked = bookmarksData.bookmarks.recepies.some(
                    bookmark =>
                        bookmark.recepie?._id?.toString() === recipeId.toString()
                );

                setIsBookmarked(bookmarked);
            }
        }
        else if(data.status === 401){
            logout();
            alert("Your token has expired please login again.");
            navigate("/login");
        }
        else if(data.status === 404){
            navigate("/pageNotFound");
        }
        else if(data.status === 500){
            navigate("/internalServerError");
        }
    }

    async function fetchMoreReviews(reset) {

        const skip = reset ? 0 : skiptReview.current;

        const data = await getReviews(
            token,
            recipeId,
            skip,
            selectedRatingFilter
        );

        if(data.succ === true){

            if(reset){
                setReviews(data.reviews);
                skiptReview.current = data.reviews.length;
            }
            else{
                setReviews(prev => [
                    ...prev,
                    ...data.reviews
                ]);

                skiptReview.current =
                    skiptReview.current + data.reviews.length;
            }

            setMoreReviews(data.moreAvailable);
        }

        else if(data.status === 401){
            logout();
            alert("Your token has expired please login again.");
            navigate("/login");
        }
        else if(data.status === 404){
            navigate("/pageNotFound");
        }
        else if(data.status === 500){
            navigate("/internalServerError");
        }
    }
    

    useEffect(() => {
        fetchRecipe(recipeId);
        fetchRatingStatistics(recipeId);
    }, [refetchRecipe]);

    useEffect(()=>{
        fetchMoreReviews(true);
    },[selectedRatingFilter])

    if (!recipe) {
        return null;
    }


    const totalTime =
        Number(recipe.preparationTime.$numberDecimal) +
        Number(recipe.cookingTime.$numberDecimal);




    function handleRatingFilter(rating) {
        setSelectedRatingFilter(rating);
        console.log("Filter reviews by:", rating, "stars");
    }

    return (

        <div className="recipe-detail-component">


            {/* =====================================================
                TOP BAR
            ===================================================== */}

            <div className="recipe-detail-topbar">

                <button className="back-to-recipes-button" onClick={()=>{navigate(-1)}}>

                    <i className="fa-solid fa-arrow-left"></i>

                    <span>
                        Go Back
                    </span>

                </button>


                <div className="recipe-detail-actions">

                    {isBookmarked ? (

                        <button
                            className="unbookmark-button"
                            onClick={handleRemoveBookmark}
                        >

                            {recipe.numberBookmarks}

                            <i className="fa-solid fa-bookmark"></i>

                            <span>
                                Unbookmark
                            </span>

                        </button>

                    ) : (

                        <button
                            className="bookmark-button"
                            onClick={handleCreateBookmark}
                        >

                            {recipe.numberBookmarks}

                            <i className="fa-regular fa-bookmark"></i>

                            <span>
                                Bookmark
                            </span>

                        </button>

                    )}

                    {/* EDITABLE FALE I LOGIKATA ZA EDITRIRANJE*/}
                    {(user._id === recipe.creator?._id && edit === false) && (

                        <button
                            className="edit-button"
                            onClick={handleEditClick}
                        >

                            <i className="fa-solid fa-pen"></i>

                            <span>
                                Edit
                            </span>

                        </button>

                    )}

                    {(user._id === recipe.creator?._id && edit === true) && (

                        <button
                            className="edit-button"
                            onClick={handleSaveClick}
                            disabled={hasValidationErrors()}
                        >

                            <i className="fa-solid fa-check"></i>

                            <span>
                                Save
                            </span>

                        </button>

                    )}
                

                    {(user.role.roleName === "admin" ||
                        user.role.roleName === "contentManager" ||
                        user._id === recipe.creator?._id) && ( 
                            deleting ? (
                                <div className="recipe-detail-loading">
                                    <Spinner
                                        w={20}
                                        h={20}
                                    />
                                </div>
                            ):  
                        (
                        <button
                            className="delete-button"
                            onClick={handleDeleteClick}
                        >

                            <i className="fa-solid fa-trash"></i>

                            <span>
                                Delete
                            </span>

                        </button>)
                   )}

                </div>

            </div>


            {/* =====================================================
                HEADER
            ===================================================== */}

            <header className="recipe-detail-header">

                {edit ? (

                    <div className="recipe-edit-name">

                        <label>
                            Name:
                        </label>

                        <div className="recipe-edit-name-input">

                            <input
                                type="text"
                                className="recipe-detail-name-edit"
                                value={editRecipeData.recipeName}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setEditRecipeData(prev => ({
                                        ...prev,
                                        recipeName: value
                                    }));
                                    setErrMessageRecipeName(validateRecipeName(value));
                                }}
                            />

                            <div className="form-error">
                                {errMessageRecipeName}
                            </div>

                        </div>

                    </div>

                ) : (

                    <h1 className="recipe-detail-name">
                        {recipe.name}
                    </h1>

                )}

                <div className="heart-divider">
                    <span className="heart-line2"></span>

                    <i className="fa-regular fa-heart"></i>

                    <span className="heart-line1"></span>
                </div>


                <div className="recipe-detail-creator-rating">

                    <div className="recipe-detail-creator">

                        <span>
                            by
                        </span>

                        <strong onClick={()=>{navigate(`/profile/${recipe.creator._id}`)}}>
                            {recipe.creator?.name || "Anonimus"}
                        </strong>

                    </div>


                    <div className="recipe-detail-rating">

                        <i className="fa-solid fa-star"></i>

                        <span className="recipe-rating-value">
                            {recipe.rating.$numberDecimal}
                        </span>

                        <span className="recipe-rating-separator">
                            •
                        </span>

                        <span>
                            {recipe.numberReviews} reviews
                        </span>

                    </div>

                </div>


               {edit ? (
                   <div className="recipe-edit-tags">

                        <div>
                            <CategoryComponent
                                recipeData={editRecipeData}
                                setRecipeData={setEditRecipeData}
                                setErrMessageCategory={setErrMessageCategory}
                            />

                            <div className="form-error">
                                {errMessageCategory}
                            </div>
                        </div>

                        <div>
                            <CuisineComponent
                                recipeData={editRecipeData}
                                setRecipeData={setEditRecipeData}
                                setErrMessageCuisine={setErrMessageCuisine}
                            />

                            <div className="form-error">
                                {errMessageCuisine}
                            </div>
                        </div>

                    </div>

                ) : (

                    <div className="recipe-tags">

                        {recipe.category.map((category, index) => (

                            <span
                                className="recipe-tag category-tag"
                                key={`category-${index}`}
                            >
                                {category}
                            </span>

                        ))}


                        {recipe.cuisine.map((cuisine, index) => (

                            <span
                                className="recipe-tag cuisine-tag"
                                key={`cuisine-${index}`}
                            >
                                #{cuisine}
                            </span>

                        ))}

                    </div>
                )}

            </header>


            {/* =====================================================
                IMAGE
            ===================================================== */}

            <div className="recipe-image-container">

                {edit ? (

                    <div className="recipe-edit-image-section">

                        {/* IMAGE URL */}

                        <div className="recipe-edit-image-card">

                            <div className="recipe-edit-image-title">

                                <i className="fa-solid fa-image"></i>

                                <span>
                                    Recipe Image
                                </span>

                            </div>

                            <p className="recipe-edit-image-description">
                                Add the URL of an image that represents your recipe.
                            </p>

                            <div className="recipe-edit-image-field">

                                <label>
                                    Recipe image URL
                                </label>

                                <input
                                    type="url"
                                    value={editRecipeData.imageUrl}
                                    onChange={handleImageUrlChange}
                                    placeholder="https://example.com/recipe-image.jpg"
                                />
                                <div className="form-error">
                                    {errMessageImageUrl}
                                </div>

                            </div>

                        </div>


                        {/* VISIBILITY */}

                        <div className="recipe-edit-visibility-card">

                            <div className="recipe-edit-image-title">

                                <i className="fa-solid fa-eye"></i>

                                <span>
                                    Recipe Visibility
                                </span>

                            </div>

                            <p className="recipe-edit-image-description">
                                Choose who can see your recipe.
                            </p>


                            <div className="recipe-edit-visibility-options">

                                {/* PUBLIC */}

                                <label
                                    className={`recipe-edit-visibility-option ${
                                        editRecipeData.visibility === "public"
                                            ? "selected"
                                            : ""
                                    }`}
                                >

                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="public"
                                        checked={
                                            editRecipeData.visibility === "public"
                                        }
                                        onChange={(e) =>
                                            setEditRecipeData(prev => ({
                                                ...prev,
                                                visibility: e.target.value
                                            }))
                                        }
                                    />

                                    <div className="recipe-edit-visibility-icon">

                                        <i className="fa-solid fa-earth-americas"></i>

                                    </div>

                                    <div className="recipe-edit-visibility-text">

                                        <strong>
                                            Public
                                        </strong>

                                        <span>
                                            Anyone can see this recipe.
                                        </span>

                                    </div>

                                    <div className="recipe-edit-radio">

                                        <span></span>

                                    </div>

                                </label>


                                {/* PRIVATE */}

                                <label
                                    className={`recipe-edit-visibility-option ${
                                        editRecipeData.visibility === "private"
                                            ? "selected"
                                            : ""
                                    }`}
                                >

                                    <input
                                        type="radio"
                                        name="visibility"
                                        value="private"
                                        checked={
                                            editRecipeData.visibility === "private"
                                        }
                                        onChange={(e) =>
                                            setEditRecipeData(prev => ({
                                                ...prev,
                                                visibility: e.target.value
                                            }))
                                        }
                                    />

                                    <div className="recipe-edit-visibility-icon">

                                        <i className="fa-solid fa-lock"></i>

                                    </div>

                                    <div className="recipe-edit-visibility-text">

                                        <strong>
                                            Private
                                        </strong>

                                        <span>
                                            Only you can see this recipe.
                                        </span>

                                    </div>

                                    <div className="recipe-edit-radio">

                                        <span></span>

                                    </div>

                                </label>

                            </div>

                        </div>

                    </div>

                ) : (

                    <>
                        {recipe.imageUrl ? (

                            <img
                                className="recipe-detail-image"
                                src={recipe.imageUrl}
                                alt={recipe.name}
                                onError={(e) => {
                                    e.currentTarget.src = "https://imgs.search.brave.com/0LcoNeVoMi9UGquyOMvqqdzDA7k3gC0E2C49J7rD81g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/bWFnbmlmaWMuY29t/L3ByZW1pdW0tdmVj/dG9yLzQwNC1wYWdl/LWZvdW5kLXNlYXJj/aC1lcnJvci13ZWIt/aWxsdXN0cmF0aW9u/XzU4NTAyNC00NTku/anBnP3NlbXQ9YWlz/X2h5YnJpZCZ3PTc0/MCZxPTgw";
                                }}
                            />

                        ) : (

                            <div className="recipe-image-placeholder">

                                <i className="fa-regular fa-image"></i>

                                <span>
                                    No recipe image
                                </span>

                            </div>

                        )}
                    </>

                )}

            </div>


            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <div className="recipe-content-grid">


                {/* =================================================
                    LEFT COLUMN
                ================================================= */}

                <div className="recipe-detail-left-column">


                    {/* =================================================
                        INGREDIENTS
                    ================================================= */}

                    <section className="ingredients-panel">

                        <div className="section-header">

                            <div className="section-title">

                                <i className="fa-solid fa-carrot"></i>

                                <h2>
                                    Ingredients
                                </h2>

                            </div>


                            <span className="section-count">

                                {edit
                                    ? editRecipeData.ingredients.length
                                    : recipe.ingredients.length
                                } items

                            </span>

                        </div>


                        {edit ? (

                            <div className="recipe-edit-ingredients">

                                <div className="recipe-edit-ingredients-table">

                                    {/* HEADER */}

                                    <div className="recipe-edit-ingredient-row recipe-edit-ingredient-header">

                                        <span>
                                            Ingredient
                                        </span>

                                        <span>
                                            Quantity
                                        </span>

                                        <span>
                                            Unit
                                        </span>

                                        <span>
                                            Misc
                                        </span>

                                        <span></span>

                                    </div>


                                    {/* INGREDIENTS */}

                                    <div
                                        className="recipe-edit-ingredients-list"
                                        ref={ingredientsListRef}
                                    >

                                        {editRecipeData.ingredients.map(
                                            (item, index) => (

                                                <div
                                                    className="recipe-edit-ingredient-row"
                                                    key={index}
                                                >

                                                    {/* INGREDIENT */}

                                                    <div className="recipe-edit-ingredient-field">

                                                        <input
                                                            type="text"
                                                            value={item.ingredient}
                                                            placeholder="Ingredient"
                                                            onChange={(e) =>
                                                                handleTextChange(
                                                                    index,
                                                                    "ingredient",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        <div className="form-error">
                                                            {errMessageIngredients[index]?.ingredient}
                                                        </div>

                                                    </div>


                                                    {/* QUANTITY */}

                                                    <div className="recipe-edit-ingredient-field">

                                                        <input
                                                            type="text"
                                                            value={item.quantity}
                                                            placeholder="Quantity"
                                                            onChange={(e) =>
                                                                handleQuantityChange(
                                                                    index,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        <div className="form-error">
                                                            {errMessageIngredients[index]?.quantity}
                                                        </div>

                                                    </div>


                                                    {/* UNIT */}

                                                    <div className="recipe-edit-ingredient-field">

                                                        <input
                                                            type="text"
                                                            value={item.unit}
                                                            placeholder="Unit"
                                                            onChange={(e) =>
                                                                handleTextChange(
                                                                    index,
                                                                    "unit",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        <div className="form-error">
                                                            {errMessageIngredients[index]?.unit}
                                                        </div>

                                                    </div>


                                                    {/* MISC */}

                                                    <div className="recipe-edit-ingredient-field">

                                                        <input
                                                            type="text"
                                                            value={item.misc}
                                                            placeholder="Misc"
                                                            onChange={(e) =>
                                                                handleTextChange(
                                                                    index,
                                                                    "misc",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        <div className="form-error">
                                                            {errMessageIngredients[index]?.misc}
                                                        </div>

                                                    </div>


                                                    {/* DELETE */}

                                                    <button
                                                        type="button"
                                                        className="recipe-edit-remove-ingredient-button"
                                                        onClick={() =>
                                                            removeIngredient(index)
                                                        }
                                                        title="Remove ingredient"
                                                    >

                                                        <i className="fa-solid fa-trash"></i>

                                                    </button>

                                                </div>

                                            )
                                        )}

                                    </div>

                                </div>


                                {/* ADD INGREDIENT */}

                                <button
                                    type="button"
                                    className="recipe-edit-add-ingredient-button"
                                    onClick={addIngredient}
                                >

                                    <i className="fa-solid fa-plus"></i>

                                    Add ingredient

                                </button>
                            </div>
                        ) : (
                            <ul className="ingredients-list">

                                {recipe.ingredients.map((item, index) => (

                                    <li
                                        className="ingredient-item"
                                        key={`ingredient-${index}`}
                                    >

                                        <label className="ingredient-checkbox">

                                            <input
                                                type="checkbox"
                                                checked={!!checked[index]}
                                                onChange={() =>
                                                    toggleChecked(index)
                                                }
                                            />

                                            <span className="custom-checkbox"></span>

                                        </label>


                                        <span
                                            className={
                                                checked[index]
                                                    ? "ingredient-text ingredient-checked"
                                                    : "ingredient-text"
                                            }
                                        >

                                            {item.quantity && (

                                                <span className="ingredient-quantity">
                                                    {item.quantity}
                                                </span>

                                            )}


                                            {item.unit && (

                                                <span className="ingredient-unit">
                                                    {" "}{item.unit}
                                                </span>

                                            )}


                                            {" "}

                                            {item.ingredient}


                                            {item.misc && (

                                                <span className="ingredient-misc">
                                                    {" "}({item.misc})
                                                </span>

                                            )}

                                        </span>

                                    </li>

                                ))}

                            </ul>

                        )}

                    </section>


                    {/* =================================================
                        COOKING METHODS
                    ================================================= */}

                    <section className="extra-panel">

                        <div className="extra-panel-header">

                            <i className="fa-solid fa-fire-burner"></i>

                            <h3>
                                Cooking Methods
                            </h3>

                        </div>


                        {edit ? (
                            <div className="recipe-edit-dropdown-wrapper">
                                <CookingMethodComponent
                                    recipeData={editRecipeData}
                                    setRecipeData={setEditRecipeData}
                                    setErrMessageCookingMethod={setErrMessageCookingMethod}
                                />

                                <div className="form-error">
                                    {errMessageCookingMethod}
                                </div>
                            </div>

                        ) : (

                            <div className="extra-tags">

                                {recipe.cookingMethods.map(
                                    (method, index) => (

                                        <span
                                            className="extra-tag"
                                            key={`method-${index}`}
                                        >
                                            {method}
                                        </span>

                                    )
                                )}

                            </div>

                        )}

                    </section>


                    {/* =================================================
                        TOOLS
                    ================================================= */}

                    <section className="extra-panel">

                        <div className="extra-panel-header">

                            <i className="fa-solid fa-kitchen-set"></i>

                            <h3>
                                Tools
                            </h3>

                        </div>


                        {edit ? (
                            <div className="recipe-edit-dropdown-wrapper">
                                <ToolEquipmentComponent
                                    recipeData={editRecipeData}
                                    setRecipeData={setEditRecipeData}
                                    setErrMessageTools={setErrMessageTools}
                                />

                                <div className="form-error">
                                    {errMessageTools}
                                </div>
                            </div>

                        ) : (

                            <div className="extra-tags">

                                {recipe.tools.map(
                                    (tool, index) => (

                                        <span
                                            className="extra-tag"
                                            key={`tool-${index}`}
                                        >
                                            {tool}
                                        </span>

                                    )
                                )}

                            </div>

                        )}

                    </section>
                </div>


                {/* =================================================
                    RIGHT COLUMN
                ================================================= */}

                <div className="recipe-detail-right-column">


                    {/* =================================================
                        INSTRUCTIONS
                    ================================================= */}

                    <section className="instructions-panel">

                        <div className="section-header">

                            <div className="section-title">

                                <i className="fa-solid fa-list-ol"></i>

                                <h2>
                                    Instructions
                                </h2>

                            </div>

                            <span className="section-count">

                                {edit
                                    ? editRecipeData.instructions.length
                                    : recipe.instructions.length
                                } steps

                            </span>

                        </div>


                        {edit ? (

                            <div className="recipe-edit-instructions">

                                <div className="recipe-edit-instructions-table">

                                    <div
                                        className="recipe-edit-instructions-list"
                                        ref={instructionsListRef}
                                    >

                                        {editRecipeData.instructions.map(
                                            (instruction, index) => (

                                                <div
                                                    className="recipe-edit-instruction-row"
                                                    key={index}
                                                >

                                                    {/* STEP NUMBER */}

                                                    <div className="recipe-edit-instruction-number">

                                                        {index + 1}

                                                    </div>


                                                    {/* INSTRUCTION */}

                                                    <div className="recipe-edit-instruction-field">

                                                        <textarea
                                                            value={instruction}
                                                            placeholder="Describe this step..."
                                                            onChange={(e) =>
                                                                updateInstruction(
                                                                    index,
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                        <div className="form-error">
                                                            {errMessageInstructions[index]}
                                                        </div>

                                                    </div>


                                                    {/* DELETE */}

                                                    <button
                                                        type="button"
                                                        className="recipe-edit-remove-instruction-button"
                                                        onClick={() =>
                                                            removeInstruction(index)
                                                        }
                                                        title="Remove instruction"
                                                    >

                                                        <i className="fa-solid fa-trash"></i>

                                                    </button>

                                                </div>

                                            )
                                        )}

                                    </div>

                                </div>


                                {/* ADD INSTRUCTION */}

                                <button
                                    type="button"
                                    className="recipe-edit-add-instruction-button"
                                    onClick={addInstruction}
                                >

                                    <i className="fa-solid fa-plus"></i>

                                    Add instruction

                                </button>

                            </div>

                        ) : (

                            <ol className="instructions-list">

                                {recipe.instructions.map(
                                    (instruction, index) => (

                                        <li
                                            className="instruction-item"
                                            key={`instruction-${index}`}
                                        >

                                            <span className="instruction-number">

                                                {index + 1}

                                            </span>

                                            <p>
                                                {instruction}
                                            </p>

                                        </li>

                                    )
                                )}

                            </ol>

                        )}

                    </section>


                    {/* =================================================
                        TIME
                    ================================================= */}
                    <section className="extra-panel">

                        <div className="extra-panel-header">

                            <i className="fa-regular fa-clock"></i>

                            <h3>
                                Time
                            </h3>

                        </div>

                        {edit ? (

                            <div className="recipe-edit-time">

                                <div className="recipe-edit-time-field">

                                    <label>
                                        Preparation time
                                    </label>

                                    <div className="recipe-edit-time-input">

                                        <input
                                            type="number"
                                            min="0"
                                            value={editRecipeData.preparationTime}
                                             onChange={(e) => {
                                                const value = e.target.value;
                                                setEditRecipeData(prev => ({
                                                    ...prev,
                                                    preparationTime: value
                                                }));
                                                setErrMessagePreparationTime(validatePrepTime(value));
                                            }}
                                        />
                                        <span>
                                            min
                                        </span>
                                    </div>
                                    <div className="form-error">
                                        {errMessagePreparationTime}
                                    </div>

                                </div>

                                <div className="recipe-edit-time-field">

                                    <label>
                                        Cooking time
                                    </label>

                                    <div className="recipe-edit-time-input">

                                        <input
                                            type="number"
                                            min="0"
                                            value={editRecipeData.cookingTime}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setEditRecipeData(prev => ({
                                                    ...prev,
                                                    cookingTime: value
                                                }));
                                                setErrMessageCookingTime(validateCookTime(value));
                                            }}
                                        />
                                        <span>
                                            min
                                        </span>
                                    </div>

                                     <div className="form-error">
                                        {errMessageCookingTime}
                                    </div>
                                </div>

                            </div>

                        ) : (

                            <div className="recipe-info-bar">

                                <div className="recipe-info-item">

                                    <i className="fa-regular fa-clock"></i>

                                    <div>

                                        <span className="recipe-info-label">
                                            PREP TIME
                                        </span>

                                        <strong>
                                            {recipe.preparationTime.$numberDecimal} min
                                        </strong>

                                    </div>

                                </div>

                                <div className="recipe-info-divider"></div>

                                <div className="recipe-info-item">

                                    <i className="fa-solid fa-fire-burner"></i>

                                    <div>

                                        <span className="recipe-info-label">
                                            COOK TIME
                                        </span>

                                        <strong>
                                            {recipe.cookingTime.$numberDecimal} min
                                        </strong>

                                    </div>

                                </div>

                                <div className="recipe-info-divider"></div>

                                <div className="recipe-info-item">

                                    <i className="fa-solid fa-hourglass-half"></i>

                                    <div>

                                        <span className="recipe-info-label">
                                            TOTAL TIME
                                        </span>

                                        <strong>
                                            {totalTime} min
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        )}

                    </section>

                    {/* =================================================
                        NUTRITION
                    ================================================= */}

                    <section className="nutrition-panel">

                        <div className="section-header">

                            <div className="section-title">

                                <i className="fa-solid fa-chart-pie"></i>

                                <h2>
                                    Nutrition
                                </h2>

                            </div>

                        </div>
                        {edit ? (

                            <div className="recipe-edit-nutrition">

                                <div className="recipe-edit-nutrition-grid">

                                    {/* CALORIES */}

                                    <div className="recipe-edit-nutrition-field">

                                        <label>
                                            Calories
                                        </label>

                                        <div className="recipe-edit-nutrition-content">

                                            <div className="recipe-edit-nutrition-input">

                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="calories"
                                                    value={editRecipeData.nutrition.calories}
                                                    onChange={handleNutritionChange}
                                                    placeholder="250"
                                                />
                                                <span>
                                                    kcal
                                                </span>
                                            </div>
                                            <div className="form-error">
                                                {errMessageNutrition.calories}
                                            </div>
                                        </div>

                                    </div>


                                    {/* PROTEIN */}

                                    <div className="recipe-edit-nutrition-field">

                                        <label>
                                            Protein
                                        </label>

                                        <div className="recipe-edit-nutrition-content">

                                            <div className="recipe-edit-nutrition-input">

                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="protein"
                                                    value={editRecipeData.nutrition.protein}
                                                    onChange={handleNutritionChange}
                                                    placeholder="12"
                                                />
                                                <span>
                                                    g
                                                </span>
                                            </div>
                                            <div className="form-error">
                                                {errMessageNutrition.protein}
                                            </div>
                                        </div>

                                    </div>


                                    {/* CARBOHYDRATES */}

                                    <div className="recipe-edit-nutrition-field">

                                        <label>
                                            Carbohydrates
                                        </label>

                                        <div className="recipe-edit-nutrition-content">

                                            <div className="recipe-edit-nutrition-input">

                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="carbohydrates"
                                                    value={editRecipeData.nutrition.carbohydrates}
                                                    onChange={handleNutritionChange}
                                                    placeholder="30"
                                                />
                                                <span>
                                                    g
                                                </span>
                                            </div>
                                            <div className="form-error">
                                                {errMessageNutrition.carbohydrates}
                                            </div>
                                        </div>

                                    </div>


                                    {/* FAT */}

                                    <div className="recipe-edit-nutrition-field">

                                        <label>
                                            Fat
                                        </label>

                                        <div className="recipe-edit-nutrition-content">

                                            <div className="recipe-edit-nutrition-input">

                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="fat"
                                                    value={editRecipeData.nutrition.fat}
                                                    onChange={handleNutritionChange}
                                                    placeholder="8"
                                                />

                                                <span>
                                                    g
                                                </span>

                                            </div>
                                            <div className="form-error">
                                                    {errMessageNutrition.fat}
                                            </div>

                                        </div>
                                    </div>


                                    {/* SATURATED FAT */}

                                    <div className="recipe-edit-nutrition-field">

                                        <label>
                                            Saturated fat
                                        </label>

                                        <div className="recipe-edit-nutrition-content">

                                            <div className="recipe-edit-nutrition-input">

                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="saturatedFat"
                                                    value={editRecipeData.nutrition.saturatedFat}
                                                    onChange={handleNutritionChange}
                                                    placeholder="3"
                                                />
                                                <span>
                                                    g
                                                </span>  

                                            </div>
                                            <div className="form-error">
                                                    {errMessageNutrition.saturatedFat}
                                                </div>

                                        </div>

                                    </div>


                                    {/* UNSATURATED FAT */}

                                    <div className="recipe-edit-nutrition-field">

                                        <label>
                                            Unsaturated fat
                                        </label>

                                        <div className="recipe-edit-nutrition-content">

                                            <div className="recipe-edit-nutrition-input">

                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="unsaturatedFat"
                                                    value={editRecipeData.nutrition.unsaturatedFat}
                                                    onChange={handleNutritionChange}
                                                    placeholder="5"
                                                />

                                                <span>
                                                    g
                                                </span>

                                            </div>
                                            <div className="form-error">
                                                    {errMessageNutrition.unsaturatedFat}
                                            </div>

                                        </div>

                                    </div>


                                    {/* FIBER */}

                                    <div className="recipe-edit-nutrition-field">

                                        <label>
                                            Fiber
                                        </label>

                                        <div className="recipe-edit-nutrition-content">

                                            <div className="recipe-edit-nutrition-input">

                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="fiber"
                                                    value={editRecipeData.nutrition.fiber}
                                                    onChange={handleNutritionChange}
                                                    placeholder="4"
                                                />

                                                <span>
                                                    g
                                                </span>

                                            </div>
                                            <div className="form-error">
                                                    {errMessageNutrition.fiber}
                                            </div>

                                        </div>

                                    </div>


                                    {/* SUGAR */}

                                    <div className="recipe-edit-nutrition-field">

                                        <label>
                                            Sugar
                                        </label>

                                        <div className="recipe-edit-nutrition-content">

                                            <div className="recipe-edit-nutrition-input">

                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="sugar"
                                                    value={editRecipeData.nutrition.sugar}
                                                    onChange={handleNutritionChange}
                                                    placeholder="10"
                                                />

                                                <span>
                                                    g
                                                </span>
                                            </div>
                                            <div className="form-error">
                                                    {errMessageNutrition.sugar}
                                            </div>

                                        </div>

                                    </div>


                                    {/* CHOLESTEROL */}

                                    <div className="recipe-edit-nutrition-field">

                                        <label>
                                            Cholesterol
                                        </label>

                                        <div className="recipe-edit-nutrition-content">

                                            <div className="recipe-edit-nutrition-input">

                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="cholesterol"
                                                    value={editRecipeData.nutrition.cholesterol}
                                                    onChange={handleNutritionChange}
                                                    placeholder="20"
                                                />

                                                <span>
                                                    mg
                                                </span>
                                            </div>
                                                <div className="form-error">
                                                    {errMessageNutrition.cholesterol}
                                                </div>

                                        </div>

                                    </div>


                                    {/* SODIUM */}

                                    <div className="recipe-edit-nutrition-field">

                                        <label>
                                            Sodium
                                        </label>

                                        <div className="recipe-edit-nutrition-content">

                                            <div className="recipe-edit-nutrition-input">

                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    name="sodium"
                                                    value={editRecipeData.nutrition.sodium}
                                                    onChange={handleNutritionChange}
                                                    placeholder="200"
                                                />

                                                <span>
                                                    mg
                                                </span>                                      
                                            </div>
                                            <div className="form-error">
                                                    {errMessageNutrition.sodium}
                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ) : (

                            <div className="nutrition-list">

                                <div className="nutrition-row">

                                    <span>
                                        Calories:
                                    </span>

                                    <strong>
                                        {recipe.nutrition.calories}
                                    </strong>

                                    <span>
                                        Protein:
                                    </span>

                                    <strong>
                                        {recipe.nutrition.protein}
                                    </strong>

                                </div>

                                <div className="nutrition-row">

                                    <span>
                                        Carbohydrates:
                                    </span>

                                    <strong>
                                        {recipe.nutrition.carbohydrates}
                                    </strong>

                                    <span>
                                        Fiber:
                                    </span>

                                    <strong>
                                        {recipe.nutrition.fiber}
                                    </strong>

                                </div>

                                <div className="nutrition-row">

                                    <span>
                                        Fat:
                                    </span>

                                    <strong>
                                        {recipe.nutrition.fat}
                                    </strong>

                                    <span>
                                        Saturated Fat:
                                    </span>

                                    <strong>
                                        {recipe.nutrition.saturatedFat}
                                    </strong>

                                </div>

                                <div className="nutrition-row">

                                    <span>
                                        Cholesterol:
                                    </span>

                                    <strong>
                                        {recipe.nutrition.cholesterol}
                                    </strong>

                                    <span>
                                        Sodium:
                                    </span>

                                    <strong>
                                        {recipe.nutrition.sodium}
                                    </strong>

                                </div>

                                <div className="nutrition-row">

                                    <span>
                                        Sugar:
                                    </span>

                                    <strong>
                                        {recipe.nutrition.sugar}
                                    </strong>

                                    <span>
                                        Unsaturated Fat:
                                    </span>

                                    <strong>
                                        {recipe.nutrition.unsaturatedFat}
                                    </strong>

                                </div>

                            </div>

                        )}

                    </section>

                </div>
            </div>

            {!edit && (  
                <div className="review-content">

                    <ReviewComponent recipe={recipe} setRefetchRecipe={setRefetchRecipe}/>

                    {/* =====================================================
                        ALL RATINGS
                    ===================================================== */}

                    <div className="all-ratings-section">   

                        <div className="ratings-divider"></div>


                        <div className="ratings-summary">

                            <div className="ratings-average">

                                <div className="ratings-average-stars">

                                    {[1, 2, 3, 4, 5].map((star) => (

                                        <i
                                            key={star}
                                            className={
                                                star <= Math.round(
                                                    Number(recipe.rating.$numberDecimal)
                                                )
                                                    ? "fa-solid fa-star"
                                                    : "fa-regular fa-star"
                                            }
                                        ></i>

                                    ))}

                                </div>


                                <div className="ratings-average-number">
                                    {recipe.rating.$numberDecimal} out of 5
                                </div>


                                <div className="ratings-total">
                                    {ratingStatistics.all} ratings
                                </div>

                            </div>


                            <div className="ratings-breakdown">

                                {[5, 4, 3, 2, 1, 0].map((star) => {

                                    const count = star === 0
                                        ? ratingStatistics.all
                                        : ratingStatistics[star];

                                    const percentage = ratingStatistics.all > 0
                                        ? (count / ratingStatistics.all) * 100
                                        : 0;

                                    return (
                                        <button
                                            type="button"
                                            className={
                                                selectedRatingFilter === star
                                                    ? "rating-breakdown-row active"
                                                    : "rating-breakdown-row"
                                            }
                                            key={star}
                                            onClick={() => {
                                                handleRatingFilter(star);

                                                setTimeout(() => {
                                                    commentsRef.current?.scrollIntoView({
                                                        behavior: "smooth",
                                                        block: "end"
                                                    });
                                                }, 1000);
                                            }}
                                        >

                                            <span className="rating-breakdown-label">
                                                {star === 0 ? "All" : star}
                                            </span>

                                            <i className="fa-solid fa-star"></i>

                                            <div className="rating-progress">

                                                <div
                                                    className="rating-progress-fill"
                                                    style={{
                                                        width: `${percentage}%`
                                                    }}
                                                ></div>

                                            </div>

                                            <span className="rating-breakdown-count">
                                                {count}
                                            </span>

                                        </button>
                                    );

                                })}

                            </div>

                        </div>



                    </div>

                </div>
            )}

            {!edit && (
                <div ref={commentsRef} className="recipe-reviews-content">

                    {/* 
                        Тука подоцна ќе се прикажуваат
                        сите reviews како comments.
                    */}
                    <OtherReviewsComponent reviews={reviews} setReviews={setReviews} recipe={recipe}/>
                    {moreReviews && (<div  className="review-button-div"> <button className="show-comments-button" onClick={()=>{fetchMoreReviews(false)}}>Show more reviews</button></div>)}

                </div>
            )}

        </div>

    );

}