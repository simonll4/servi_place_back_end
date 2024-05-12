import httpServer from "./app";

const PORT = process.env.PORT;

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


