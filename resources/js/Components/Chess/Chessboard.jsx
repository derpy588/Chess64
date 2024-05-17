import { Ox88, 
    toAlgebraic, 
    Chessboard, 
    PAWN,
    DEFAULT_POSITION,
    isNumber,
    isUpperCase
} from '@/Pages/Chess'
import Piece from '@/Components/Chess/Piece'
import { DndProvider, useDrag } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Square from '@/Components/Chess/Square'
import { useState } from 'react';

export default function Board({ board_colors=['#779952', '#edeed1'], onMove, board=DEFAULT_POSITION }) {
    
    const [ selectedPiece, setSelectedPiece ] = useState(-1)

    function isSquareEmpty(sq) {
        let square = 0
        const b = board.split(/\s+/)[0]

        for (let i = 0; i<b.length; i++) {
            const piece = b[i]

            if (isNumber(piece)) {

                if (square <= sq && (square+parseInt(piece)-1) >= sq) {
                    return true
                }

                square+=parseInt(piece)
            } else if ('kqrbnp'.indexOf(piece.toLowerCase()) !== -1) {
                const color = isUpperCase(piece) ? 'w' : 'b'
                if (sq == square) {
                    return false
                }
                square++
            }
        }
        return true
    }

    function getPiece(square) {
        let sq = 0
        const b = board.split(/\s+/)[0]

        for (let i = 0; i<b.length; i++) {
            const piece = b[i]

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
    function getColor(square) {
        let sq = 0
        const b = board.split(/\s+/)[0]

        for (let i = 0; i<b.length; i++) {
            const piece = b[i]

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

    // onPieceClicked
    function onPieceClick(square) {
        if (isSquareEmpty(square)) return

        if (selectedPiece === -1) {
            setSelectedPiece(square)
            return
        }

        if (selectedPiece == square) {
            setSelectedPiece(-1)
            return
        }

        if (getColor(square) === getColor(selectedPiece)) {
            setSelectedPiece(square)
            return
        }

        onMove(selectedPiece, square)
        setSelectedPiece(-1)
        return
    }

    function onEmptySquareClick(square) {
        if (!isSquareEmpty(square)) return

        if (selectedPiece !== -1) {
            onMove(selectedPiece, square)
            setSelectedPiece(-1)
            return
        }
    }
    
    // Generating board
    let squares = [];

    for (let i = 0; i<64; i++) {
        const x = (i%8)
        const y = Math.floor(i/8)
        const c = (i+Math.floor(i/8))%2 == 0 ? board_colors[0] : board_colors[1]
        const ac = (i+Math.floor(i/8))%2 == 0 ? board_colors[1] : board_colors[0]
        squares.push(<Square color={c} altColor={ac} x={x} y={y} onEmptySquareClick={() => onEmptySquareClick(i)} />)
    }

    // Generating Pieces

    function renderPieces() {
        let pieces = []

        // TEMP Vars
        const pieceString = board.split(/\s+/)[0]
        let square = 0

        for (let i = 0; i<pieceString.length; i++) {
            const piece = pieceString[i]

            if (isNumber(piece)) {
                square+=parseInt(piece)
            } else if ('kqrbnp'.indexOf(piece.toLowerCase()) !== -1) {
                const color = isUpperCase(piece) ? 'w' : 'b'
                const p = piece.toLowerCase()
                const s = square
                
                pieces.push(<Piece color={color} piece={p} square={s} onPieceClick={() => onPieceClick(s)} />)

                square++
            }
        }
        return pieces
    }

    function renderSelectedSquare() {
        if (selectedPiece === -1) return

        const translateX = (selectedPiece%8) * 100
        const translateY = Math.floor(selectedPiece/8) * 100
        return [<div style={{transform: 'translate('+translateX+'%, '+translateY+'%)'}} className=" bg-yellow-400/[.6] absolute aspect-square w-1/8"></div>]
    }

    function renderPossibleMoves() {
        if (selectedPiece === -1) return

        let sqrs = []



        return sqrs
    }

    return (
        <div className={'flex flex-col overflow-hidden relative aspect-square size-2/5 h-fit ma bg-gray-300 rounded '}>
            {squares}

            {renderSelectedSquare()}
            {renderPieces()}
            
        </div>
    );
}