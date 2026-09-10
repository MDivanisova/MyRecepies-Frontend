const path = 'http://localhost:55555/api/recepie';
const PAGESIZE = 8;

export async function createRecepie(token, recepie) {

    const result = await fetch(`${path}/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": token 
        },
        body:  JSON.stringify({
            name: recepie.recipeName,
            preparationTime: Number(recepie.preparationTime),
            cookingTime: Number(recepie.cookingTime),
            category: recepie.categories,
            cuisine: recepie.cuisines,
            ingredients: recepie.ingredients,
            instructions: recepie.instructions,
            cookingMethods: recepie.cookingMethods,
            tools: recepie.tools,
            nutrition: recepie.nutrition,
            imageUrl: recepie.imageUrl,
            visibility: recepie.visibility
        }),
    })

    const data = await result.json();

    if(result.status === 200){
        return {
            succ: true,
            id: data.id
        }
    }
    return {
        ...data,
        status: result.status
    }
    
}

export const editRecepie = async (token, recipeId,recipeData) => 
    {
        const response = await fetch(`${path}/${recipeId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                },
                body: JSON.stringify({
                    name: recipeData.name,
                    preparationTime: Number(recipeData.preparationTime),
                    cookingTime: Number(recipeData.cookingTime),
                    category: recipeData.category,
                    cuisine: recipeData.cuisine,
                    ingredients: recipeData.ingredients,
                    instructions: recipeData.instructions,
                    cookingMethods: recipeData.cookingMethods,
                    tools: recipeData.tools,
                    nutrition: recipeData.nutrition,
                    imageUrl: recipeData.imageUrl,
                    visibility: recipeData.visibility
                })
            }
        );

        const data = await response.json();

        console.log("EDIT RECIPE RESPONSE:", data);
        console.log("EDIT RECIPE STATUS:", response.status);

        if(response.status === 200){
            return {
                succ: true,
                ...data
            }
        }

        return {
            succ: false,
            msg: data.msg,
            status: response.status
        };

    }


export async function getAllRecepies(token, pageNumber, recepieName, creator, ingredient, category, cuisine, numOfRecomended){

    const result = await fetch(`${path}/recepies?pageSize=${PAGESIZE}&pageNumber=${pageNumber}&creator=${creator}&name=${recepieName}&ingredient=${ingredient}&category=${category}&cuisine=${cuisine}&numOfRecomended=${numOfRecomended}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "authorization": token 
        }
    });

    const data = await result.json();
    
    if (result.status === 200) {
        return {
            succ: true,
            ...data.result
        };
    }

    return {
        ...data,
        status: result.status
    };  

}


export async function removeRecipe(token, recepieId) {

    const result = await fetch(`${path}/${recepieId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "authorization": token 
        }
    })

    const data = await result.json();

    if(result.status === 200){
        return {
            succ: true
        }
    }
    return {
        ...data,
        status: result.status
    }
    
}

export const getRecepie = async (token, recepieId) => {

    const response = await fetch(`${path}/${recepieId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        }
    );
    const data = await response.json();

    if(response.status === 200){
        return {
            succ: true,
            ...data
        }
    }
    return {
        ...data,
        status: response.status,
    }
};