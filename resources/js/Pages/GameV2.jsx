import { useState } from 'react';
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import $ from "jquery";
import Echo from 'laravel-echo';

export default function GameV2({ auth, currentGame }) {

    const g = new Chess()
    if (currentGame.state == "playing") g.loadPgn(currentGame.board.pgn)

    const [gameData,  setGameData] = useState(currentGame);
    const [gameState, setGameState] = useState(currentGame.state);
    const [game, setGame] = useState(g);

    function onDrop(fromSqr, toSqr, piece) {
        
        const gameCopy = new Chess()
        gameCopy.loadPgn(game.pgn())
        const move = gameCopy.move({
        from: fromSqr,
        to: toSqr,
        promotion: piece[1].toLowerCase() ?? "q",
        });
        
        
        if (gameState == "playing") {
            setGame(gameCopy)
            $.ajax({
                type: 'GET',
                url: ('move/' + move.san),
                async: true,
                success: function(data) {
                    console.log(move.san)
                    
                    $.ajax({
                        type: 'GET',
                        url: ('v2/game'),
                        async: true,
                        success: function(data2) {
                            const g = new Chess()
                            g.loadPgn(data2.board.pgn)
                            setGame(g)

                            setGameData(data2)
                        }
                    })
                }
            })

            return move;
        }
        
        setGameState(gameCopy)
        return move;
    }

    function findGame() {

        $.ajax({
            type: 'GET',
            url: 'find-match',
            async: true, 
            success: function(data) {
                
                $.ajax({
                    type: 'GET',
                    url: 'v2/state',
                    async: true, 
                    success: function(data2) {
                        setGameState(data2.state)
                        
                    }
                })
            }
        })
    }

    function playButton() {
        return (
            <button onClick={findGame} class="w-full h-10 text-slate-100 mt-4 hover:bg-charcoal-gray hover:drop-shadow-2xl drop-shadow-lg bg-tuna rounded-lg">PLAY</button>
        )
    }

    function findingGame() {
        return (
            <p className="text-slate-100 mt-4  w-full bg-charcoal-gray w-1/3 h-fit p-2 rounded-lg text-center">Searching For Game...</p>
        )
    }

    function opponentBlock() {
        return (
            <div class="flex flex-col w-full h-12 rounded-lg bg-charcoal-gray my-2">
                <p className={"ml-2 mr-auto rounded-lg text-center " + (gameData.current_team != gameData.board_orientation ? "text-amber-300" : "text-slate-100")}>{gameData.opponent.username}</p>
                <p className="text-slate-100 ml-2 mr-auto rounded-lg text-center">ELO: {gameData.opponent.elo}</p>
            </div>
        )
    }

    function selfBlock() {
        return (
            <div class="flex flex-col w-full h-12 rounded-lg bg-charcoal-gray my-2">
                <p className={"ml-2 mr-auto rounded-lg text-center " + (gameData.current_team == gameData.board_orientation ? "text-amber-300" : "text-slate-100")}>{auth.user.username}</p>
                <p className="text-slate-100 ml-2 mr-auto rounded-lg text-center">ELO: {auth.user.elo}</p>
            </div>
        )
    }


    var mathcmakingChannel = window.Echo.private(`matchmaking.${auth.user.id}`);
    mathcmakingChannel.listen('UserMatched', function(data) {
        
        $.ajax({
            type: 'GET',
            url: 'v2/game',
            async: true, 
            success: function(data) {
                setGameState(data.state)
                setGameData(data)
                const g = new Chess()
                g.loadPgn(data.board.pgn)
                setGame(g)
            }
        })

        
    });

    var gameChannel = window.Echo.private(`game.${auth.user.id}`);
    gameChannel.listen('OpponentMoved', function(data) {
        

        $.ajax({
            type: 'GET',
            url: ('v2/game'),
            async: true,
            success: function(data2) {
                const g = new Chess()
                g.loadPgn(data2.board.pgn)
                setGame(g)

                setGameData(data2)
                
            }
        })
        
    });



    return (
    <div class="flex h-screen w-screen bg-gunmetal">

            
            <div class="w-4/12 m-auto">
                { gameState == "playing" ? opponentBlock() : null }
                <Chessboard 
                id="playing" 
                boardOrientation={ gameData.state == "playing" ? gameData.board_orientation : "white"}
                position={game.fen()} 
                onPieceDrop={onDrop} 
                customDarkSquareStyle={{ backgroundColor: "#779952" }}
                customLightSquareStyle={{ backgroundColor: "#edeed1" }}

                />
                { gameState == "playing" ? selfBlock() : null }

                { gameState == "none" ? playButton() : null}
                { gameState == "finding" ? findingGame() : null}
            </div>
            
    </div>
    );
}