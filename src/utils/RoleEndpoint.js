const path = 'http://localhost:55555/api/role';

export async function GetRole(token) {

    const result = await fetch(`${path}/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "authorization": token 
        }
    });

    const data = await result.json();

    if(result.status === 200){
        return {
            succ: true,
            roles: data.roles
        }
    }
    
    return {
        ...data,
        status: result.status
    };

    
}


export async function editUserRole(token, userId, role) {
    const result = await fetch(`${path}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "authorization": token 
        },
        body: JSON.stringify({
            userId: userId,
            role:role
        })
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