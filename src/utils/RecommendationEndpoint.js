const path = 'http://localhost:55555/api/recommendation';


export async function getRecommendations(token){

    const response = await fetch(`${path}/`,
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
}