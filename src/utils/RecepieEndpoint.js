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


export async function getAllRecepies(token, pageNumber, recepieName, creator, ingredient, category, cuisine){

    const result = await fetch(`${path}/recepies?pageSize=${PAGESIZE}&pageNumber=${pageNumber}&creator=${creator}&name=${recepieName}&ingredient=${ingredient}&category=${category}&cuisine=${cuisine}`, {
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