const path = 'http://localhost:55555/api/user';
import { PAGE_SIZE, PROFILE_RECIPE_PAGE_SIZE } from "./enum";

export  async function logIn(email, password){
    console.log("Login called")
    const result = await fetch(`${path}/login`,{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
    if(result.status == 200){
        const {_, token, user} = await result.json();
        return {
            succ: true,
            token: token,
            user: user
        }
    }
    const data = await result.json();
    console.log(data);

    return {
        ...data,
        status: result.status
    };
}

export async function register(name, email, password, gender){
    const result = await fetch(`${path}/register`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            gender: gender,
        })
    })
    if(result.status == 200){
        return true
    }

    const data = await result.json();
    return {
        ...data,
        status: result.status
    };
}


export async function verify(email, code){
    const result = await fetch(`${path}/verify`,{
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            code: code
        })
    })
    if(result.status == 200){
        return true 
    }

    const data = await result.json();
    return {
        ...data,
        status: result.status
    };
}

export async function resendCode(email){

    
    const result = await fetch(`${path}/resendCode`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email
        })
    });


    if (result.status === 200) {
        return true;
    }

    const data = await result.json();
    return {
        ...data,
        status: result.status
    };

}

export async function getMe(token){
    
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
            user: data.result
        }
    }
    
    return {
        ...data,
        status: result.status
    };
    
}

export async function getMyBookmarks(token, pageNumber, recepieName, creator, ingredient, category, cuisine){

    const result = await fetch(`${path}/bookmarks?pageSize=${PAGE_SIZE}&pageNumber=${pageNumber}&creator=${creator}&name=${recepieName}&ingredients=${ingredient}&category=${category}&cuisine=${cuisine}` , {
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
            bookmarks: data.result
        }
    }
    
    return {
        ...data,
        status: result.status
    };
}

export async function editUser(token, name, email, description, age, gender){
    
    const result = await fetch(`${path}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "authorization": token 
        },
        body:  JSON.stringify({
            name: name,
            email: email,
            description: description,
            age: age,
            gender: gender
        })
    });

    if (result.status === 201) {
        return true;
    }

    const data = await result.json();

    return {
        ...data,
        status: result.status
    };  


}

export async function getUsers(token, pageNumber, userName, email, role){
    
    const result = await fetch(`${path}/users?pageSize=${PAGE_SIZE}&pageNumber=${pageNumber}&name=${userName}&email=${email}&role=${role}`, {
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


export async function getUsersRecepies(token, pageNumber, name, visibility) {

    const result = await fetch(
        `${path}/recepies?pageSize=${PROFILE_RECIPE_PAGE_SIZE}&pageNumber=${pageNumber}&name=${name}&visibility=${visibility}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        }
    );

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


export async function deleteUser(token, userId) {

    const result = await fetch(`${path}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "authorization": token 
        },
        body: JSON.stringify({
            userId: userId
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
