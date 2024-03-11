import React from "react";
import { useDrop } from 'react-dnd'

export default function Square({ color, altColor, x, y, onEmptySquareClick }) {

    const translateX = x*100
    const translateY = y*100

    /*
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'piece',
        drop: () => onPieceDrop(selPiece, (y*8)+x),
        collect: monitor => ({
            isOver:  !!monitor.isOver()
        })
    }), [x, y]) */

    function renderCharacter() {
        const chars = []

        if (x == 0) {
            chars.push(<text x='4' y='25' font-size='25' fill={altColor} className='font-mono font-bold'>{8-y}</text>)
        }

        if (y == 7) {
            chars.push(<text x='83' y='95' font-size='25' fill={altColor} className='font-mono font-bold'>{String.fromCharCode(x+65).toLowerCase()}</text>)
        }

        return chars
    }

    return (
        <>
            <div onClick={onEmptySquareClick} style={{transform: 'translate('+translateX+'%, '+translateY+'%)', backgroundColor: color}} className='absolute aspect-square w-1/8'>
                <svg viewBox='0 0 100 100' className='absolute top-0 left-0'>
                    {renderCharacter()}
                </svg>

            </div>
        </>
    )
}