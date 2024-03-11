import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Chessboard,
         DEFAULT_POSITION,  
         WHITE, 
         BLACK,
         BIT_FLAGS
        } from './Chess';
import Board  from '@/Components/Chess/Chessboard';
import Piece from '@/Components/Chess/Piece'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export default function Dashboard({ auth }) {


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
    }

    useEffect(() => {
        
    }, [])
    

    function play() {
        
    }


    return (
        
        <AuthenticatedLayout>

            <div className="flex flex-row mx-auto h-auto w-fit justify-center place-items-center">
                
                <Board board={fen} onMove={onMove} />
                <div className='flex flex-col h-fit w-full ml-3 bg-tuna pt-6 rounded'>
                    <button onClick={play} className='rounded bg-chess-green text-white w-full h-fit'>PLAY</button>
                </div>
            </div>
            
        </AuthenticatedLayout>

    );
}
