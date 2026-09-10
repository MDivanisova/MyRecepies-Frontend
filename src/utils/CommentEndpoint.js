const path = 'http://localhost:55555/api/comment';

export const getComments = async (token, reviewId, skip, limit=2) =>{
     const response = await fetch(`${path}/${reviewId}?skip=${skip}&limit=${limit}`,
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

export const likeComment = async(token, commentId)=>{
       const response = await fetch(`${path}/like/${commentId}`,
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

export const dislikeComment = async(token, commentId)=>{
       const response = await fetch(`${path}/dislike/${commentId}`,
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

export const creatComment = async (token, reviewId, text) =>{
    
    const response = await fetch(`${path}/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                },
                body: JSON.stringify({
                    review: reviewId,
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
            succ: false,
            msg: data.msg,
            status: response.status
        };
}

export const deleteComment = async (token, commentId) =>{
        const response = await fetch(`${path}/${commentId}`, {
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