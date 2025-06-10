const ACTIONS = {
    JOIN: 'join',
    LEAVE: 'leave',
    ADD_PEER: 'add-peer',
    REMOVE_PEER: 'remove-peer',
    RELAY_SDP: 'relay-sdp',
    RELAY_ICE: 'relay-ice',
    ICE_CANDIDATE: 'ice-candidate',
    SESSION_DESCRIPTION: 'session-description',
    IS_TEACHER_ONLINE: 'is-teacher-online',
    TEACHER_ONLINE_STATUS: 'teacher-online-status',
    CHESS_MOVE: 'chess_move',
    CHESS_STATE: 'chess_state',
    CHESS_RESET: 'chess-set-position',
    CHESS_GAME_OVER: 'chess-game-over',
    CHESS_GO_TO_MOVE: 'chess-go-to-move'
};

export default ACTIONS;