const path = 'http://localhost:55555/api/rating';

export const getRating = async (token, recipeId) =>{
     const response = await fetch(`${path}/${recipeId}`,
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
            msg: data.msg,
            status: response.status
        };
    
}

export const createRating = async ( token, rating, recipeId ) => {


        const response = await fetch(`${path}/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                },

                body: JSON.stringify({
                    rating: rating,
                    rated: recipeId
                })
            }
        );


      const data = await response.json();
      console.log("Rating created.");
        console.log(data);
        if(response.status === 200){
            return {
                succ: true
            }
        }

        return {
            succ: false,
            msg: data.msg,
            status: response.status
        };

};


export const editRating = async ( token, rating, ratingId ) => {


        const response = await fetch(`${path}/${ratingId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                },

                body: JSON.stringify({
                    rating: rating
                })
            }
        );


      const data = await response.json();
        console.log(data);
        if(response.status === 200){
            return {
                succ: true
            }
        }


        return {
            msg: data.msg,
            status: response.status
        };

};

export const deleteRating = async (token, ratingId) =>{
        const response = await fetch(`${path}/${ratingId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "authorization": token
        }
    });

    const data = await response.json();

    if (response.status === 200) {
        return {
            succ: true,
            msg: data.msg
        };
    }

    return {
        succ: false,
        msg: data.msg,
        status: response.status
    };

}


export const getRatingStatistics = async (token, recipeId) => {

    const response = await fetch(`${path}/statistics/${recipeId}`,
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
        succ: false,
        msg: data.msg,
        status: response.status
    };

}