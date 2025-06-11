import axios from "../../axiosInstance.js";

export const handleCreateGame = async (request) => {
    try {
        const res = await axios.post("/games/", request);
        return res.data;
    } catch(error) {
        console.error(error);
    }
}

export const handleLoadGame = async (gameId) => {
    try {
        const res = await axios.get(`/games/${gameId}/state`);
        return res.data;
    } catch(error) {
        console.error('Error loading game:', error);
        throw error;
    }
};

export const handleSaveGame = async (gameId, request) => {
    try {
        await axios.post(`/games/${gameId}/end`, request);
    } catch(error) {
        console.error(error);
    }
}

export const handleSaveGameAnalysis = async (gameId, request) => {
    try {
        await axios.post(`/games/${gameId}/game-analysis`, request);
    } catch(error) {
        console.error(error);
    }
}

export const handleSaveAiMove = async (gameId, request) => {
    try {
        await axios.post(`/games/${gameId}/ai-moves`, request);
    } catch(error) {
        console.error(error);
    }
}

export const handleSaveMove = async (gameId, request) => {
    try {
        console.log("request: "+ request.move.toSquare + "analysis: " +request.moveAnalysis.suggestion)
        await axios.post(`/games/${gameId}/moves`, request);
    } catch(error) {
        console.error(error);
    }
}