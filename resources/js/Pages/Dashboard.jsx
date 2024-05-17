import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import { useEffect } from 'react';
import { Chessboard,
         DEFAULT_POSITION,  
         WHITE, 
         BLACK,
         BIT_FLAGS,
         Ox88,
        } from './Chess';
import Board  from '@/Components/Chess/Chessboard';
import { router } from '@inertiajs/react'
import $ from "jquery";
import Echo from 'laravel-echo';
//import { Chessboard } from "react-chessboard";

export default function Dashboard({ auth, isMatchmaking, isPlayingGame }) {

    const [gameStarted, setGameStarted] = useState(isPlayingGame)
    const [gameData, setGameData] = useState(null)
    const [opponent, setOpponent] = useState(null)

    function getPiece(board, square) {
        let sq = 0

        for (let i = 0; i<board.length; i++) {
            const piece = board[i]

            if (isNumber(piece)) {

                sq+=parseInt(piece)
            } else if ('kqrbnp'.indexOf(piece.toLowerCase()) !== -1) {
                const color = isUpperCase(piece) ? 'w' : 'b'
                if (sq == square) {
                    return piece.toLowerCase()
                }
                sq++
            }
        }
        return false
    }
    function getColor(board, square) {
        let sq = 0

        for (let i = 0; i<board.length; i++) {
            const piece = board[i]

            if (isNumber(piece)) {

                sq+=parseInt(piece)
            } else if ('kqrbnp'.indexOf(piece.toLowerCase()) !== -1) {
                const color = isUpperCase(piece) ? 'w' : 'b'
                if (sq == square) {
                    return color
                }
                sq++
            }
        }
        return false
    }

    const [ gameClient, setGameClient ] = useState(new Chessboard())
    const [ fen, setFen ] = useState(gameClient.getFEN())

    function onMove(from, to) {
        
        let copy = gameClient.createDeepCopy()
        copy.moveBy64({ legal: false, validTurn: true, from: from, to: to })
        
        setFen(copy.getFEN())
        setGameClient(copy)
        
        if (gameStarted) {
            console.log('test')
            $.ajax({
                url: 'game/move',
                type: 'GET',
                
            })
        }
    }

    useEffect(() => {
        $.ajax({
            type: 'GET',
            url: 'game/state',
            async: false, // NOTE: Look above same thing
            success: function(data) {
                isMatchmaking = data.isMatchmaking
                isPlayingGame = data.isPlayingGame
                setGameStarted(isPlayingGame)
            }
        })

        $.ajax({
            type: 'GET',
            url: 'game/current',
            async: false, // NOTE: Look above same thing
            success: function(data) {
                setGameData(data)
                var wt = data["white_team"]
                var bt = data["black_team"]

                if (auth.user.id == wt) {
                    setOpponent(bt)
                } else {
                    setOpponent(wt)
                }
            }
        })


    }, [])
    

    function play() {
        $.ajax({
            type: 'GET',
            url: 'game/find-match',
            async: false, // NOTE: Synchrounous is risky because it could lock up the browser
        })

        $.ajax({
            type: 'GET',
            url: 'game/state',
            async: false, // NOTE: Look above same thing
            success: function(data) {
                isMatchmaking = data["isMatchmaking"]
                isPlayingGame = data["isPlayingGame"]
            }
        })

        router.reload()
    }

    function playingInfo() {
        if (isMatchmaking == false && isPlayingGame == false) {
            return ((<div className="flex flex-col mx-auto h-full w-full justify-center place-items-center">
                        <Board board={fen} onMove={onMove} />
                        <button onClick={play} className="w-1/3 h-10 text-slate-100 mt-4 hover:bg-charcoal-gray hover:drop-shadow-2xl drop-shadow-lg bg-tuna rounded-lg">PLAY</button>
                    </div>))
        } else if (isMatchmaking == true && isPlayingGame == false) {
            return ((<div className="flex flex-col mx-auto h-full w-full justify-center place-items-center">
                        <Board board={fen} onMove={onMove} />
                        <p className="text-slate-100 mt-4 bg-charcoal-gray w-1/3 h-fit p-2 rounded-lg text-center">Searching For Game...</p>
                    </div>)) // TODO: add cancel button
        }else {
            return ((<div className="flex flex-col mx-auto h-full w-full justify-center place-items-center">
                        <Board board={fen} onMove={onMove} />
                        <p className="text-slate-100 mt-4">Something Went Wrong!</p>
                    </div>))
        }
    }



    var mathcmakingChannel = window.Echo.private(`matchmaking.${auth.user.id}`);
    mathcmakingChannel.listen('UserMatched', function(data) {
        console.log("test")
        $.ajax({
            type: 'GET',
            url: 'game/state',
            async: false, // NOTE: Look above same thing
            success: function(data) {
                isMatchmaking = data.isMatchmaking
                isPlayingGame = data.isPlayingGame
                setGameStarted(isPlayingGame)
            }
        })

        $.ajax({
            type: 'GET',
            url: 'game/current',
            async: false, // NOTE: Look above same thing
            success: function(data) {
                setGameData(data)
                var wt = data["white_team"]
                var bt = data["black_team"]

                if (auth.user.id == wt) {
                    setOpponent(bt)
                } else {
                    setOpponent(wt)
                }
            }
        })
    });

    var gameChannel = window.Echo.private(`game.${auth.user.id}`);
    gameChannel.listen('OpponentMoved', function(data) {
        console.log(data)

        let copy = gameClient.createDeepCopy()
        copy.moveBy64({ legal: false, validTurn: true, from: Ox88[data["from"]], to: Ox88[data["to"]] })
        setFen(data["newBoard"])
        setGameClient(copy);
        
    });

    function playingLayout() {
        return (
            <div className="flex flex-row mx-auto h-full w-full justify-center place-items-center">
                <div className="flex flex-row h-4/12 w-4/5 justify-center place-items-center">
                    <Board board={fen} onMove={onMove} />
                    <div className="flex flex-col rounded-lg bg-tuna h-2/5 w-1/5 ml-3">

                    </div>
                </div>
            </div>
        )
    }

    return (
        
        <AuthenticatedLayout>

            {gameStarted ? playingLayout() : playingInfo()}
            
            
            
            
            
            
        </AuthenticatedLayout>

    );
}
