import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import WelcomeComponent from "../components/homePage/WelcomeComponent";
import DashboardComponent from "../components/homePage/DashboardComponent";
import MenuComponent from "../components/MenuComponent";

import "./homePage.css";

export default function HomePage() {

    const [searchParams, setSearchParams] = useSearchParams();

    const isFirstFilterRender = useRef(true);


    /* =========================
       FILTERS (init from URL)
    ========================= */

    const [filters, setFilters] = useState({
        name: searchParams.get("name") || "",
        creator: searchParams.get("creator") || "",
        creatorName: searchParams.get("creatorName") || "",
        ingredients: searchParams.get("ingredients") || "",
        category: searchParams.get("category") || "all",
        cuisine: searchParams.get("cuisine") || "all"
    });


    /* =========================
       TYPE (init from URL)
    ========================= */

    const [typeRecipes, setTypeRecipes] = useState(
        searchParams.get("type") || "recipes"
    );


    /* =========================
       PAGE (init from URL)
    ========================= */

    const [pageNumber, setPageNumber] = useState(
        Number(searchParams.get("page")) || 1
    );


    /* =========================
       RESET PAGE WHEN FILTERS / TYPE CHANGE
       (ne pri prv render, za da ne go izbrise
        page-ot dojden od URL)
    ========================= */

    useEffect(() => {

        if (isFirstFilterRender.current) {

            isFirstFilterRender.current = false;

            return;
        }

        setPageNumber(1);

    }, [
        filters.name,
        filters.creator,
        filters.ingredients,
        filters.category,
        filters.cuisine,
        typeRecipes
    ]);


    /* =========================
       SYNC STATE -> URL
    ========================= */

    useEffect(() => {

        const params = {};

        if (filters.name) params.name = filters.name;
        if (filters.creator) params.creator = filters.creator;
        if (filters.creatorName) params.creatorName = filters.creatorName;
        if (filters.ingredients) params.ingredients = filters.ingredients;
        if (filters.category && filters.category !== "all") params.category = filters.category;
        if (filters.cuisine && filters.cuisine !== "all") params.cuisine = filters.cuisine;
        if (typeRecipes && typeRecipes !== "recipes") params.type = typeRecipes;
        if (pageNumber && pageNumber !== 1) params.page = pageNumber;

        setSearchParams(params, { replace: true });

    }, [filters, typeRecipes, pageNumber]);


    return (
        <div className="dashboard-page">

            <MenuComponent path="home" />

            <div className="left-side-div">

                <WelcomeComponent
                    filters={filters}
                    setFilters={setFilters}
                    typeRecipes={typeRecipes}
                    setTypeRecipes={setTypeRecipes}
                />


                <DashboardComponent
                    filters={filters}
                    typeRecipes={typeRecipes}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                />

            </div>

        </div>
    );
}