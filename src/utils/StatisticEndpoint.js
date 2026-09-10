const path = 'http://localhost:55555/api/statistic';

export const getSummaryStatistics = async (token) => {

    const result = await fetch(`${path}/summary`,
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
            summary: data.summary
        };
    }

    return {
        succ: false,
        status: result.status
    };
};



export const getRatingStatistics = async ( token, topN, period) => {

    const result = await fetch(
        `${path}/rating?topN=${topN}&period=${period}`,
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
            statistics: data.statistics
        };
    }

    return {
        succ: false,
        status: result.status
    };
};


export const getBookmarkStatistics = async ( token, topN, period) => {

    const result = await fetch(
        `${path}/bookmark?topN=${topN}&period=${period}`,
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
            statistics: data.statistics
        };
    }

    return {
        succ: false,
        status: result.status
    };

};


export const getCategoryStatistic = async (token, topN, period) => {

    const result = await fetch(
        `${path}/category?topN=${topN}&period=${period}`,
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
            statistics: data.categories
        };
    }

    return {
        succ: false,
        status: result.status
    };
};