import { useEffect, useState } from "react";
import { getAllRecepies } from "../../utils/RecepieEndpoint";
import { useAuth } from "../../context/useAuth";
import { PAGE_SIZE } from "../../utils/enum";
import { useNavigate } from "react-router-dom";
import ElectricBorder from "../ElectricBorder";

import RecipeCardComponent from "./RecipeCardComponent";

import Spinner from "../Spiner";
import "./dashboardComponent.css";
import { getRecommendations } from "../../utils/RecommendationEndpoint";


export default function DashboardComponent({ filters, typeRecipes }) {

    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const [recepies, setRecepies] = useState([]);
    const [refresh, setRefresh] = useState(1);
    const [loading, setLoading] = useState(false);

    const [pageNumber, setPageNumber] = useState(1);

    const [pagination, setPagination] = useState({
        numRecepies: 0,
        totalPages: 0,
        pageNumber: 1,
        pageSize: PAGE_SIZE
    });

   
    const fetchRecepies = async () => {

        setLoading(true);
        let response;
        if(typeRecipes === "recipes"){
                response = await getAllRecepies(
                    token,
                    pageNumber,
                    filters.name,
                    filters.creator,
                    filters.ingredients,
                    filters.category,
                    filters.cuisine
                );
        }
        else{
            response = await getRecommendations(
                    token,
                    pageNumber,
                    filters.name,
                    filters.creator,
                    filters.ingredients,
                    filters.category,
                    filters.cuisine
                );
        }
        setLoading(false);
        console.log(response)

        if (response.succ) {
            if (response.pagination.totalPages > 0 && pageNumber > response.pagination.totalPages
            ) {

                setPageNumber(response.pagination.totalPages);

                setLoading(false);
                console.log(response);
                return;
            }
            setRecepies(response.recepies);

            setPagination(response.pagination);


        }

        if (response.status === 401) {

            logout();

            alert(
                "Your token has expired please login again."
            );

            navigate("/login");
        }

    };


    // Load recipes when page or filters change
    useEffect(() => {

        fetchRecepies();

    }, [
        token,
        pageNumber,
        filters,
        refresh,
        typeRecipes,
    ]);


    // When search filters change, return to first page
    useEffect(() => {

        setPageNumber(1);

    }, [
        filters.name,
        filters.creator,
        filters.ingredients,
        filters.category,
        filters.cuisine,
        typeRecipes,
    ]);


    const handlePrevious = () => {

        if (pageNumber > 1) {

            setPageNumber(
                prev => prev - 1
            );

        }

    };


    const handleNext = () => {

        if (pageNumber < pagination.totalPages) {

            setPageNumber(
                prev => prev + 1
            );

        }

    };


    return (

        <div className="dashboard-component">

            <div className="list-recepies">


                {loading ? (

                    <div className="recipes-spinner">

                        <Spinner
                            w={500}
                            h={500}
                        />

                    </div>

                ) : (

                    <div className="recipes-grid">

                    {recepies.length > 0 ? (
                        recepies.map(recipe => (
                            <ElectricBorder
                                key={recipe._id}
                                color={typeRecipes === "recipes" ? "#fdaa2d": "#f35438"}
                                speed={0.1}
                                chaos={0.01}
                                thickness={20}
                            >
                                 <div className="recommended-card">
                                    {typeRecipes !== "recipes" &&(
                                        <div className="recommended-badge">
                                            <i className="fa-solid fa-star"></i>
                                            <span>Recommended</span>
                                        </div>)}

                                        <RecipeCardComponent
                                            recipe={recipe}
                                            setRecepies={setRecepies}
                                            setRefresh={setRefresh}
                                        />

                                </div>
                            </ElectricBorder>
                        ))
                    ) : (

                            <div className="no-recipes-found">
                                <i className="fa-solid fa-utensils"></i>

                                <div className="no-recipes-title">
                                    {typeRecipes === "recipes"? "No recipes found" : "No recommendations"}
                                </div>
                            </div>
                    )}

                </div>
                )}

            </div>


            {!loading && pagination.totalPages > 0 && (

                <div className="recipes-pagination">

                    <button
                        type="button"
                        onClick={handlePrevious}
                        disabled={pageNumber === 1}
                    >

                        <i className="fa-solid fa-chevron-left"></i>

                        Previous

                    </button>


                    <span>

                        Page {pageNumber} of {pagination.totalPages}

                    </span>


                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={
                            pageNumber === pagination.totalPages
                        }
                    >

                        Next

                        <i className="fa-solid fa-chevron-right"></i>

                    </button>

                </div>

            )}

        </div>

    );

}