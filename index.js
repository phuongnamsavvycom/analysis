var axios = require("axios");

function getTime(date) {
    date = new Date(date);
    let nowUTC = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
    );
    return nowUTC;
}

const processStatistics = async (startDate, endDate) => {
    let data;
    try {
        let response = await axios.get(
            "https://bitbucket.org/!api/2.0/snippets/tawkto/aA8zqE/4f62624a75da6d1b8dd7f70e53af8d36a1603910/files/webstats.json"
        );
        data = response.data;
    } catch (err) {
        console.error(err);
    }

    if (!startDate && !endDate) {
        const result = data.reduce((acc, curr) => {
            const { websiteId, chats, missedChats } = curr;
            const { chats: accChats, missedChats: accMissedChats } = acc[websiteId] || { chats: 0, missedChats: 0 };
            acc[websiteId] = {
                websiteId: websiteId,
                chats: accChats + chats,
                missedChats: accMissedChats + missedChats,
            };
            return acc;
        }, []);
        return Object.values(result);
    } else {
        const result = data.reduce((acc, curr) => {
            const { websiteId, chats, missedChats } = curr;
            const { chats: accChats, missedChats: accMissedChats } = acc[websiteId] || { chats: 0, missedChats: 0 };
            if (
                getTime(curr.date) >= getTime(startDate) &&
                getTime(curr.date) <= getTime(endDate)
            ) {
                acc[websiteId] = {
                    websiteId: websiteId,
                    chats: accChats + chats,
                    missedChats: accMissedChats + missedChats,
                };
            }
            return acc;
        }, []);
        return Object.values(result);
    }
};

processStatistics(new Date(2019, 3, 1), new Date(2019, 3, 2)).then((ans) => {
    console.log(ans);
});
