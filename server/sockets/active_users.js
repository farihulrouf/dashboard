const activeUsers = [];

const addActiveUser = (id, name , room) => {
    const activeUser = {id, name, room};
    activeUsers.push(activeUser);

    return activeUser;
}

const removeActiveUser = (id) => {
    const index = activeUsers.findIndex((activeUser) => activeUser.id === id);

    if(index != -1) {
        return activeUsers.splice(index, 1)[0];
    }
}

const getActiveUser = (id) => {
    return activeUsers.find((activeUser) => activeUser.id === id); 
}

const getActiveUsersInRoom = () => {
    return  activeUsers.filter((activeUser) => activeUser.room === room)
}

const getActiveUsersByName = (name) => {
    return  activeUsers.filter((activeUser) => activeUser.name === name)
}

const getAllActiveUsers = () => activeUsers

module.exports = {addActiveUser, removeActiveUser, getActiveUser, getActiveUsersInRoom, getActiveUsersByName, getAllActiveUsers}