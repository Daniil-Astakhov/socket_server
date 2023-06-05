let users = [];
const { trimStr } = require("./utils");

const findeUser = (user) => {
    const userName = trimStr(user.name);
    const userRoom = trimStr(user.room);
    return users.find((u) => trimStr(u.name) === userName && trimStr(u.room) === userRoom);
};


const addUsers = (user) => {
 
    const isExist = findeUser(user)

    !isExist && users.push(user);
    const currentUser = isExist || user;

    return { isExist: !!isExist, user: currentUser };
};

const getRoomUsers = (room) => users.filter((u) => u.room = room);
const removeUser = (user) => {
    const foundUser = findeUser(user);
    if (foundUser) {
        users = users.filter(
          ({ room, name }) => room === foundUser.room && name !== foundUser.name
        );
      }
    return foundUser;
};

module.exports = { addUsers, findeUser, getRoomUsers, removeUser };