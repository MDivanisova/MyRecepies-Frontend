const path = 'http://localhost:55555/api/recommendation';
const PAGESIZE = 8;


export async function getRecommendations(token, pageNumber, recepieName, creator, ingredient, category, cuisine){

     const response = await fetch(`${path}?pageSize=${PAGESIZE}&pageNumber=${pageNumber}&creator=${creator}&name=${recepieName}&ingredient=${ingredient}&category=${category}&cuisine=${cuisine}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "authorization": token 
        }
    });
    const data = await response.json();

    if(response.status === 200){
        return {
            succ: true,
            ...data.result
        }
    }
    return {
        ...data,
        status: response.status,
    }
}