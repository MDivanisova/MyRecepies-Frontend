const path = 'http://localhost:55555/api/bookmark';
const PAGESIZE = 8;

export async function createBookmark(token, recepie) {

    const result = await fetch(`${path}/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": token 
        },
        body:  JSON.stringify({
            recepie: recepie
        }),
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


export async function removeBookmark(token, recepie) {
   
    const result = await fetch(`${path}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "authorization": token 
        },
        body:  JSON.stringify({
            recepie: recepie
        }),
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