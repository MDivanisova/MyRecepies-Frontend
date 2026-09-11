const path = 'http://localhost:55555/api/review';


export const createReview = async ( token, recipeId, text) => {

        const response = await fetch(`${path}/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                },
                body: JSON.stringify({
                    reviewed: recipeId,
                    text: text
                })
            }
        );


        const data = await response.json();
        console.log(data);
        console.log("Review created.");
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

export const likeReview = async(token, reviewId)=>{
       const response = await fetch(`${path}/like/${reviewId}`,
            {
                method: "PUT",
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

export const dislikeReview = async(token, reviewId)=>{
       const response = await fetch(`${path}/dislike/${reviewId}`,
            {
                method: "PUT",
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


export const editReview = async ( token, text, reviewId ) => {


        const response = await fetch(`${path}/${reviewId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                },

                body: JSON.stringify({
                    text: text
                })
            }
        );


      const data = await response.json();

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

export const getReviews = async (token, recipeId, skip, ratingFilter, limit=2) =>{
    const response = await fetch(`${path}/${recipeId}?skip=${skip}&limit=${limit}&ratingFilter=${ratingFilter}`,{
        method:"GET",
        headers: {
                    "Content-Type": "application/json",
                    "authorization": token
        },
    })

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

export const deleteReview = async (token, reviewId) =>{
        const response = await fetch(`${path}/${reviewId}`, {
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