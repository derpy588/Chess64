import { useDrag, DragPreviewImage } from 'react-dnd'
import { PAWN } from '@/Pages/Chess'
import { getEmptyImage } from "react-dnd-html5-backend";
import { useEffect } from 'react';


export default function Piece({color, piece, square, onPieceClick}) {

    const translateX = (square%8) * 100
    const translateY = Math.floor(square/8) * 100


    /*
    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: 'piece',
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }))*/

    
    return (
        <>
            {/*<DragPreviewImage connect={preview} src={'storage/images/'+color+piece+'.svg.png'} />*/}
            <div onClick={onPieceClick} style={{transform: 'translate('+translateX+'%, '+translateY+'%)'}} className="absolute aspect-square w-1/8" /*ref={drag}*/>
                <svg viewBox='0 0 100 100' className='absolute top-0 left-0' /*style={{opacity: isDragging ? 0 : 1}}*/>
                    {/*isDragging ? setSelPiece(square) : null*/}
                    <image x='0' y='0' height='100%' width='100%' href={'storage/images/'+color+piece+'.svg.png'}></image>
                </svg>
            </div>
        </>
    );
}