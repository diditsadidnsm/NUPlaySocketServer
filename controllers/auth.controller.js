module.exports = (io, socket) => {
    const signIn = (data, callback) => {
        // ...
    }

    const signUp = (data, callback) => {
        // ...
    }

    socket.on("auth:signIn", signIn);

    socket.on("auth:signUp", signUp);
}