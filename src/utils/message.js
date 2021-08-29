

const generateMessage = (message, username) => {
    return {
        username: username,
        text: message,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage
}