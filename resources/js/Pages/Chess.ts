export const WHITE = 'w'
export const BLACK = 'b'

export const PAWN       = 'p'
export const KNIGHT     = 'n'
export const BISHOP     = 'b'
export const ROOK       = 'r'
export const QUEEN      = 'q'
export const KING       = 'k'

export type Color = 'w' | 'b'
export type PieceChar = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'

export const DEFAULT_POSITION =
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

// prettier-ignore
export type Square =
    'a8' | 'b8' | 'c8' | 'd8' | 'e8' | 'f8' | 'g8' | 'h8' |
    'a7' | 'b7' | 'c7' | 'd7' | 'e7' | 'f7' | 'g7' | 'h7' |
    'a6' | 'b6' | 'c6' | 'd6' | 'e6' | 'f6' | 'g6' | 'h6' |
    'a5' | 'b5' | 'c5' | 'd5' | 'e5' | 'f5' | 'g5' | 'h5' |
    'a4' | 'b4' | 'c4' | 'd4' | 'e4' | 'f4' | 'g4' | 'h4' |
    'a3' | 'b3' | 'c3' | 'd3' | 'e3' | 'f3' | 'g3' | 'h3' |
    'a2' | 'b2' | 'c2' | 'd2' | 'e2' | 'f2' | 'g2' | 'h2' |
    'a1' | 'b1' | 'c1' | 'd1' | 'e1' | 'f1' | 'g1' | 'h1'

export type Piece = {
    color: Color
    type: PieceChar
}

export type InternalMove = {
    color: Color
    from: number
    to: number
    piece: PieceChar
    captured?: PieceChar
    promotion?: PieceChar
    flags: number
}

const EMPTY = -1

export type Move = {
    color: Color
    from: number
    to: number
    captured?: PieceChar
    piece: PieceChar
    promotion?: PieceChar
    epSquare: number
    halfMovesClock: number
    moveNumber: number
    kings: Record<Color, number>
    castling: Record<Color, number>
    flags: string
}

export const Flags: Record<string, string> = {
    NORMAL: 'n',
    CAPTURE: 'c',
    EP_CAPTURE: 'e',
    PROMOTION: 'p',
    KSIDE_CASTLE: 'k',
    QSIDE_CASTLE: 'q',
    DOUBLE_PAWN: 'd'
}

export const BIT_FLAGS: Record<string, number> = {
    NORMAL: 1,
    CAPTURE: 2,
    EP_CAPTURE: 4,
    PROMOTION: 8,
    KSIDE_CASTLE: 16,
    QSIDE_CASTLE: 32,
    DOUBLE_PAWN: 64
}

/*
*   ********************************************
*   I am using 0x88 board representation
*   ********************************************
*/

// prettier-ignore
export const Ox88: Record<Square, number> = {
    a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
    a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
    a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
    a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
    a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
    a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
    a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
    a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
}


// Format(Relative to side): up 1, up 2, take right, take left
const PAWN_OFFSETS = {
    b: [16, 32, 15, 17],
    w: [-16, -32, -15, -17]
}
// Format depends on how many possible moves the pice can make
const PIECE_OFFSETS = {
    n: [18, 33, 31, 14, -18, -33, -31, -14],
    b: [17, 15, -17, -15],
    r: [16, 1, -16, -1],
    q: [17, 15, 16, 1, -17, -15, -16, -1],
    k: [17, 15, 16, 1, -17, -15, -16, -1]
}

const PIECE_MASKS = { p: 0x1, n: 0x2, b: 0x4, r: 0x8, q: 0x10, k: 0x20 }


const ATTACK_BOARD = [
    20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20, 0,
    0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
    0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
    0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
    0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
    24,24,24,24,24,24,56,  0, 56,24,24,24,24,24,24, 0,
    0, 0, 0, 0, 0, 2,53, 56, 53, 2, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,20, 2, 24,  2,20, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0,20, 0, 0, 24,  0, 0,20, 0, 0, 0, 0, 0,
    0, 0, 0,20, 0, 0, 0, 24,  0, 0, 0,20, 0, 0, 0, 0,
    0, 0,20, 0, 0, 0, 0, 24,  0, 0, 0, 0,20, 0, 0, 0,
    0,20, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0,20, 0, 0,
    20, 0, 0, 0, 0, 0, 0, 24,  0, 0, 0, 0, 0, 0,20
];
  

const RAY_BOARD = [
    17,  0,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0,  0, 15, 0,
    0, 17,  0,  0,  0,  0,  0, 16,  0,  0,  0,  0,  0, 15,  0, 0,
    0,  0, 17,  0,  0,  0,  0, 16,  0,  0,  0,  0, 15,  0,  0, 0,
    0,  0,  0, 17,  0,  0,  0, 16,  0,  0,  0, 15,  0,  0,  0, 0,
    0,  0,  0,  0, 17,  0,  0, 16,  0,  0, 15,  0,  0,  0,  0, 0,
    0,  0,  0,  0,  0, 17,  0, 16,  0, 15,  0,  0,  0,  0,  0, 0,
    0,  0,  0,  0,  0,  0, 17, 16, 15,  0,  0,  0,  0,  0,  0, 0,
    1,  1,  1,  1,  1,  1,  1,  0, -1, -1,  -1,-1, -1, -1, -1, 0,
    0,  0,  0,  0,  0,  0,-15,-16,-17,  0,  0,  0,  0,  0,  0, 0,
    0,  0,  0,  0,  0,-15,  0,-16,  0,-17,  0,  0,  0,  0,  0, 0,
    0,  0,  0,  0,-15,  0,  0,-16,  0,  0,-17,  0,  0,  0,  0, 0,
    0,  0,  0,-15,  0,  0,  0,-16,  0,  0,  0,-17,  0,  0,  0, 0,
    0,  0,-15,  0,  0,  0,  0,-16,  0,  0,  0,  0,-17,  0,  0, 0,
    0,-15,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,-17,  0, 0,
    -15,  0,  0,  0,  0,  0,  0,-16,  0,  0,  0,  0,  0,  0,-17
];

const SYMBOLS = 'pnbrqkPNBRQK'

const PROMOTIONS: PieceChar[] = [KNIGHT, BISHOP, ROOK, QUEEN]

const RANK_1 = 7
const RANK_2 = 6
const RANK_3 = 5
const RANK_4 = 4
const RANK_5 = 3
const RANK_6 = 2
const RANK_7 = 1
const RANK_8 = 0

const PAWN_RANKS = { w: RANK_2, b: RANK_7 }
const PAWN_END_RANKS = { w: RANK_8, b: RANK_1 }



function rank(square: number): number {
    return square >> 4
}

function file(square: number): number {
    return square & 0xf
}

function swapColor(color: Color): Color {
    return color === WHITE ? BLACK : WHITE
}

export function toAlgebraic(square: number): Square {
    const f = file(square)
    const r = rank(square)

    return ('abcdefgh'.substring(f, f+1) + '87654321'. substring(r, r+1)) as Square
}

// Checks if FEN string is valid and can be used
function isFenValid(fen: string) {
    const tokens = fen.split(/\s+/)

    // 1) Check length to make sure 6 different fields
    if (tokens.length !== 6) {
        return {
            valid: false,
            error: 'Invalid FEN: Does not caontain 6 fields.'
        }
    }

    // 2) Check if halfmove clock is >= 0
    const halfMoveClock = parseInt(tokens[4])
    if (isNaN(halfMoveClock) || halfMoveClock < 0) {
        return {
            valid: false,
            error: 'Invalid FEN: Half move clock should be a positive integer'
        }
    }

    // 3) Check if current move field is > 0
    const moveNum = parseInt(tokens[5])
    if (isNaN(moveNum) || moveNum <= 0) {
        return {
            valid: false,
            error: 'Invalid FEN: Current move number is invalid.'
        }
    }

    // 4) Check if valid en passant square
    if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
        return {
            valid: false,
            error: 'Invalid FEN: Incorrect En Passant square.'
        }
    }

    // 5) Check if valid castling field
    if (!/^[-QKqk]{1,4}$/.test(tokens[2])) {
        return {
            valid: false,
            error: 'Invalid FEN: Castling field is incorrect.'
        }
    }

    // 6) Check if 2nd field is 'w' or 'b' to math white or black
    if (!/^(w|b)$/.test(tokens[1])) {
        return {
            valid: false,
            error: 'Invalid FEN: 2nd field should be w or b'
        }
    }

    // 7) Check if 1st field has 8 rows
    const rows = tokens[0].split('/')
    if (rows.length !== 8) {
        return {
            valid: false,
            error: 'Invalid FEN: 1st field does not have 8 rows'
        }
    }

    // 8) Check if the rows are valid
    for (let i = 0; i<rows.length; i++) {
        let rowSum = 0
        let prevWasNum = false

        for (let j = 0; j<rows[i].length; j++) {
            // Check if character is a valid character
            if (!/^[1-8pnbrqkPNBRQK]$/.test(rows[i][j])) {
                return {
                    valid: false,
                    error: 'Invalid FEN: Invalid 1st field character'
                }
            }
            // Check if previous char was num
            if (/^[1-8]$/.test(rows[i][j])) {
                if (prevWasNum) {
                    return {
                        valid: false,
                        error: 'Invalid FEN: 1st field invalid (Consecutive numbers)'
                    }
                }
                rowSum += parseInt(rows[i][j])
                prevWasNum = true
            } else {
                rowSum += 1
                prevWasNum = false
            }
        }
        if (rowSum !== 8) {
            return {
                valid: false,
                error: 'Invalid FEN: Row sum is not 8'
            }
        }
    }

    // 9) check if en passant square is legal
    if ((tokens[3][1] == '3' && tokens[1] == 'w') || (tokens[3][1] == '6' && tokens[1] == 'b')) {
        return {
            valid: false,
            error: 'Invalid FEN: Illegal en passant square'
        }
    }

    // 10) check if there is 1 king for both colors
    const kingsRegex = [
        { color: 'white', regex: /K/g},
        { color: 'black', regex: /k/g}
    ]

    for (const {color, regex} of kingsRegex) {
        if ((tokens[0].match(regex) || []).length != 1) {
            return {
                valid: false,
                error: `Invalid FEN: Invalid amount of ${color} king(s)`
            }
        }
    }
    return {valid: true, errors: null}
}

export function isNumber(x: string): boolean {
    return '0123456789'.indexOf(x) !== -1
}

export function isUpperCase(x: string): boolean {
    return /^[A-Z]*$/.test(x)
}

function addMove(moves: InternalMove[], color: Color, from: number, to: number, piece: PieceChar, captured: PieceChar | undefined = undefined, flags: number = BIT_FLAGS.NORMAL) {
    if (piece === PAWN && rank(to) === PAWN_END_RANKS[color]) {
        for (let i = 0; i<PROMOTIONS.length;i++) {
            moves.push({
                color: color,
                from: from,
                to: to,
                piece: piece,
                captured: captured,
                promotion: PROMOTIONS[i],
                flags: flags+BIT_FLAGS.PROMOTION
            })
        }
    } else {
        moves.push({
            color,
            from,
            to,
            piece,
            captured,
            flags
        })
    }
}


export class Chessboard {
    private _board = new Array<Piece>(128)
    private _kings: Record<Color, number> = { w: EMPTY, b: EMPTY }
    private _turn: Color = WHITE
    private _epSquare = EMPTY
    private _halfMovesClock = 0
    private _moveNumber = 1
    private _history: Move[] = []
    private _castling: Record<Color, number> = { w: 0, b: 0 }

    constructor(fen = DEFAULT_POSITION) {
        this.loadFEN(fen)
    }

    clear() {
        this._board = new Array<Piece>(128)
        this._kings = { w: EMPTY, b: EMPTY }
        this._turn = WHITE
        this._epSquare = EMPTY
        this._halfMovesClock = 0
        this._moveNumber = 1
        this._history = []
        this._castling = { w: 0, b: 0 }
    }

    loadFEN(fen: string) {
        let tokens = fen.split(/\s+/)

        const { valid, error } = isFenValid(fen)

        if (!valid) {
            return error // may change this to throw error msg
        }

        this.clear()

        // Putting pieces and stuff
        const boardPos = tokens[0]
        let square = 0


        for (let i = 0; i< boardPos.length; i++) {
            const piece = boardPos[i]

            if (piece == '/') {
                square += 8
            } else if (isNumber(piece)) {
                square += parseInt(piece)
            } else {
                const color = isUpperCase(piece) ? WHITE : BLACK

                this.put({ type: piece.toLowerCase() as PieceChar, color: color, square: toAlgebraic(square) })

                square++
            }
        }

        // piece turn
        this._turn = tokens[1] as Color

        // set castling
        if (tokens[2].indexOf('K') > -1) {
            this._castling.w |= BIT_FLAGS.KSIDE_CASTLE
        }
        if (tokens[2].indexOf('Q') > -1) {
            this._castling.w |= BIT_FLAGS.QSIDE_CASTLE
        }
        if (tokens[2].indexOf('k') > -1) {
            this._castling.b |= BIT_FLAGS.KSIDE_CASTLE
        }
        if (tokens[2].indexOf('q') > -1) {
            this._castling.b |= BIT_FLAGS.QSIDE_CASTLE
        }

        // En Passant target
        this._epSquare = tokens[3] === '-' ? EMPTY : Ox88[tokens[3] as Square]
        // Half move clock
        this._halfMovesClock = parseInt(tokens[4])
        // current turn
        this._moveNumber = parseInt(tokens[5])
    }

    getFEN() {
        let empty = 0
        let fen = ''

        for (let i = Ox88.a8; i <= Ox88.h1; i++) {
            if (this._board[i]) {
                if (empty > 0) {
                    fen+=empty
                    empty = 0
                }
                const { color, type: piece } = this._board[i]

                fen += color === WHITE ? piece.toUpperCase() : piece.toLowerCase()
            }else {
                empty++
            }

            if (((i + 1) & 0x88) !== 0) {
                if (empty > 0) {
                    fen+=empty
                }

                if (i !== Ox88.h1) {
                    fen+='/'
                }

                empty = 0
                i+=8
            }
        }
        // current turn
        fen += ' ' + this._turn

        // castling
        let castling = ''
        castling += this._castling[WHITE] & BIT_FLAGS.KSIDE_CASTLE ? 'K' : ''
        castling += this._castling[WHITE] & BIT_FLAGS.QSIDE_CASTLE ? 'Q' : ''
        castling += this._castling[BLACK] & BIT_FLAGS.KSIDE_CASTLE ? 'k' : ''
        castling += this._castling[BLACK] & BIT_FLAGS.QSIDE_CASTLE ? 'q' : ''

        fen += ' '
        fen += castling || '-'

        // en passant 
        fen += this._epSquare === EMPTY ? ' -' : ' ' + toAlgebraic(this._epSquare)

        // half move clock
        fen += ' ' + this._halfMovesClock
        fen += ' ' + this._moveNumber

        return fen
    }

    put({ type, color, square }: { type: PieceChar; color: Color; square: Square }) {
        // Check if type is valid peice
        if (SYMBOLS.indexOf(type) === -1) {
            return false
        }

        // check if square is valid
        if (!(square in Ox88)) {
            return false
        }

        const sq = Ox88[square]

        // check if dupelicate kings
        if (type === KING && !(this._kings[color] == EMPTY || this._kings[color] == sq)) {
            return false
        }

        // Set square on board
        this._board[sq] = { type: type as PieceChar, color: color as Color } as Piece

        if (type === KING) {
            this._kings[color] = sq
        }

        this.updateCastling()
        this.updateEnPassant()

        return true

    }

    get(square: Square) {
        return this._board[Ox88[square]] || false
    }

    reset() {
        this.loadFEN(DEFAULT_POSITION)
    }

    remove(square: Square) {
        const piece = this.get(square)
        delete this._board[Ox88[square]]

        if (piece && piece.type === KING) {
            this._kings[piece.color] = EMPTY
        }

        this.updateCastling()
        this.updateEnPassant()

        return piece
    }

    updateCastling() {
        const isWhiteKingInPlace = (this._board[Ox88.e1] && this._board[Ox88.e1].type === KING && this._board[Ox88.e1].color === WHITE)
        const isBlackKingInPlace = (this._board[Ox88.e1] && this._board[Ox88.e8].type === KING && this._board[Ox88.e8].color === BLACK)

        if (!isWhiteKingInPlace || this._board[Ox88.a1]?.type !== ROOK || this._board[Ox88.a1].color !== WHITE) {
            this._castling.w &= ~BIT_FLAGS.QSIDE_CASTLE
        }
        if (!isWhiteKingInPlace || this._board[Ox88.h1]?.type !== ROOK || this._board[Ox88.h1].color !== WHITE) {
            this._castling.w &= ~BIT_FLAGS.KSIDE_CASTLE
        }
        if (!isBlackKingInPlace || this._board[Ox88.a8]?.type !== ROOK || this._board[Ox88.a8].color !== BLACK) {
            this._castling.b &= ~BIT_FLAGS.QSIDE_CASTLE
        }
        if (!isBlackKingInPlace || this._board[Ox88.h8]?.type !== ROOK || this._board[Ox88.h8].color !== BLACK) {
            this._castling.b &= ~BIT_FLAGS.KSIDE_CASTLE
        }
    }

    updateEnPassant() {
        if (this._epSquare === EMPTY) {
            return
        }

        const targetSqr = this._epSquare + (this._turn === WHITE ? -16 : 16)
        const currentSqr = this._epSquare + (this._turn === WHITE ? 16 : -16)
        const attackSqrs = [targetSqr+1, targetSqr-1]

        if (this._board[targetSqr] || 
            this._board[this._epSquare] !== null || 
            this._board[currentSqr]?.color !== swapColor(this._turn) || 
            this._board[currentSqr]?.type !== PAWN) {
                this._epSquare = EMPTY
                return
        }

        const canCapture1 = !((attackSqrs[0] & 0x88) === 0) && this._board[attackSqrs[0]]?.color === this._turn && this._board[attackSqrs[0]]?.type === PAWN;
        const canCapture2 = !((attackSqrs[1] & 0x88) === 0) && this._board[attackSqrs[1]]?.color === this._turn && this._board[attackSqrs[1]]?.type === PAWN;

        if (!(canCapture1 || canCapture2)) {
            this._epSquare = EMPTY
        }
        
    }

    isAttacked(attackedBy: Color, sqaure: number) {

        for (let i = Ox88.a8; i<=Ox88.h1; i++) {
            // Check if out of bounds
            if ((i & 0x88) !== 0) {
                i+=7
                continue
            }

            // check if empty or incorrect color
            if (this._board[i] === undefined || this._board[i]?.color !== attackedBy) {
                continue
            }

            const piece = this._board[i]
            const diff = i-sqaure

            // if they are the on same square
            if (diff === 0) {
                continue
            }

            const idx = diff+119

            if (ATTACK_BOARD[idx] & PIECE_MASKS[piece.type]) {
                // check if pawn
                if (piece.type === PAWN) {
                    // make sure pawns moving right way
                    if (diff > 0) {
                        if (piece.color === WHITE) return true
                    } else {
                        if (piece.color === BLACK) return true
                    }
                    continue
                }

                // if knight or king
                if (piece.type === KNIGHT || piece.type === KING) return true

                // if other piece
                const offset = RAY_BOARD[idx]

                let blocked = false
                for (let j = i+offset; j !== sqaure; j+=offset) {
                    if (this._board[j] !== null) {
                        blocked = true
                        break
                    }
                }

                if (!blocked) return true
            }
        }

        return false
    }

    isKingAttacked(color: Color) {
        const sqr = this._kings[color]
        return (sqr !== EMPTY && this.isAttacked(swapColor(color), sqr))
    }

    inCheck() {
        return this.isKingAttacked(this._turn)
    }

    inCheckmate() {

        return this.inCheck() && this.allMoves({ color: this._turn }).length === 0
        
    }

    inStalemate() {

    }

    isInsuffcientMaterial() {

    }

    isThreeTimesRepetition() {

    }

    isDraw() {

    }

    isGameOver() {

    }

    moves({ legal=true, square, color=undefined }: { legal?: boolean, square: Square, color?: Color }) {

        // This move function is for single square generation

        const moves: InternalMove[] = []
        const us = color ? color : this._turn
        const them = swapColor(us)

        const from = Ox88[square]
        const piece: PieceChar = this._board[from].type

        // make sure a piece is on that square
        if (!piece) {
            return
        }
        

        let to: number
        if (piece === PAWN) {


            // Single Square move , no capture
            to = from + PAWN_OFFSETS[us][0]
            if (!this._board[to]) {
                addMove(moves, us, from, to, PAWN)

                // double pawn move
                to = from + PAWN_OFFSETS[us][1]
                if (rank(from) === PAWN_RANKS[us] && !this._board[to]) {
                    addMove(moves, us, from, to, PAWN, undefined, BIT_FLAGS.DOUBLE_PAWN)
                }
            }

            // pawn captures
            
            for (let i = 2; i<4;i++) {

                // Regular left and right pawn captures
                to = from + PAWN_OFFSETS[us][i]
                if (this._board[to]?.color === them) {
                    addMove(moves, us, from, to, PAWN, this._board[to].type, BIT_FLAGS.CAPTURE)
                }
                else if (to === this._epSquare) { // En Passant capture

                    addMove(moves, us, from, to, PAWN, this._board[to+PAWN_OFFSETS[them][0]].type, BIT_FLAGS.EP_CAPTURE)
                }
            }


            
            
        } else {

            
            for (let i = 0; i< PIECE_OFFSETS[piece].length; i++) {
                const offset = PIECE_OFFSETS[piece][i]
                to = from+offset

                
                while ((to & 0x88) === 0) {
                    

                    // check if sqaure has friendly piece
                    if (this._board[to] && this._board[to]?.color === us) break

                    // if empty square
                    if (!this._board[to]) {
                        addMove(moves, us, from, to, piece)
                    }

                    // if opponent piece
                    if (this._board[to] && this._board[to]?.color === them) {
                        addMove(moves, us, from, to, piece, this._board[to].type, BIT_FLAGS.CAPTURE)
                        break
                    }

                    // if piece is king or knight only run once
                    if (piece === KING || piece === KNIGHT) break

                    to+=offset
                }
                

            }
            

            // check for castling
            if (piece === KING) {
                // king side
                if (this._castling[us] & BIT_FLAGS.KSIDE_CASTLE) {
                    const to = from+2

                    if (!this._board[from+1] && !this._board[to] && !this.isAttacked(them, from) && !this.isAttacked(them, from+1) && !this.isAttacked(them, to)) {
                        addMove(moves, us, from, to, KING, undefined, BIT_FLAGS.KSIDE_CASTLE)
                    }
                }
    
                // queen side
                if (this._castling[us] & BIT_FLAGS.QSIDE_CASTLE) {
                    const to = from-2

                    if (!this._board[from-1] && !this._board[to] && !this._board[from-3] && !this.isAttacked(them, from) && !this.isAttacked(them, from-1) && !this.isAttacked(them, to)) {
                        addMove(moves, us, from, to, KING, undefined, BIT_FLAGS.QSIDE_CASTLE)
                    }
                }
            }
        }

        if (!legal) {
            return moves
        }

        // Check if Psuedo-legal moves are legal
        const legalMoves = []

        for (let i = 0; i<moves.length; i++) {
            // TODO code for checking legal moves
        }

    }

    allMoves({ legal=true, color }: { legal?: boolean, color: Color }) {
        // This is generation for every square
        const movesA = []
        
        for (let i = Ox88.a8 ; i<=Ox88.h1; i++) {
            if ((i & 0x88) !== 0) {
                i+=7
            }

            if (!(this._board[i] === undefined) && this._board[i].color === color) {
                let square = toAlgebraic(i) 
                const movesB = this.moves({ legal: legal, square: square, color: color })
                
                
                if (movesB){
                    for (let k = 0; k<movesB.length; k++) {
                        movesA.push(movesB[k])
                    }
                }
            }
        }
        

        return movesA
    }

    move({ legal=true, validTurn=true, move }: { legal?: boolean, validTurn?: boolean, move: InternalMove }) {
        const moves = this.allMoves({ legal: legal, color: move.color })
        
        let moveExists = false
        for (let i = 0; i<moves.length; i++) {
            if (moves[i].from === move.from && moves[i].to === move.to && moves[i].piece === move.piece && moves[i].color === move.color) {
                moveExists = true
            }

        }

        if (!moveExists) {
            return false
        }


        if (validTurn && move.color !== this._turn) {
            return false
        }

        const from = move.from
        const to = move.to
        const color = move.color

        const promotion = (move.flags & BIT_FLAGS.PROMOTION) !== 0

        if (from === to) {
            return false
        }


        
        if ((move.flags & BIT_FLAGS.NORMAL) !== 0) {
            
            this._board[from] = undefined
            this._board[to] = { type: promotion ? move.promotion : move.piece, color: color } as Piece

            this.updateEnPassant()
            this.updateCastling()
            

            // set king stuff for normal move
            if (move.piece === KING) {
                this._kings[color] = to
                this._castling[color] = EMPTY
            }

            if (move.piece !== PAWN) {
                this._halfMovesClock+=1
            } else if (move.piece === PAWN) {
                this._halfMovesClock = 0
            }

            if (promotion && move.piece === PAWN) {
                const hist: Move = {
                    color: color,
                    from: from,
                    to: to,
                    piece: move.piece,
                    promotion: move.promotion,
                    epSquare: this._epSquare,
                    halfMovesClock: this._halfMovesClock,
                    moveNumber: this._moveNumber,
                    kings: this._kings,
                    castling: this._castling,
                    flags: Flags.NORMAL + Flags.PROMOTION
                }
                this._history.push(hist)
            } else {
                const hist: Move = {
                    color: color,
                    from: from,
                    to: to,
                    piece: move.piece,
                    epSquare: this._epSquare,
                    halfMovesClock: this._halfMovesClock,
                    moveNumber: this._moveNumber,
                    kings: this._kings,
                    castling: this._castling,
                    flags: Flags.NORMAL
                }
                this._history.push(hist)
            }

            if (validTurn && color === BLACK) {
                this._moveNumber++
            }
            if (validTurn) this._turn = swapColor(color)

            return
        }

        if ((move.flags & BIT_FLAGS.CAPTURE) !== 0 && move.captured) {
            const capt = this._board[to].type

            this._board[from] = undefined
            this._board[to] = { type: promotion ? move.promotion : move.piece, color: color } as Piece

            this.updateEnPassant()
            this.updateCastling()

            // set king stuff for normal move
            if (move.piece === KING) {
                this._kings[color] = to
                this._castling[color] = EMPTY
            }

            this._halfMovesClock = 0

            if (promotion && move.piece === PAWN) {
                const hist: Move = {
                    color: color,
                    from: from,
                    to: to,
                    captured: capt,
                    piece: move.piece,
                    promotion: move.promotion,
                    epSquare: this._epSquare,
                    halfMovesClock: this._halfMovesClock,
                    moveNumber: this._moveNumber,
                    kings: this._kings,
                    castling: this._castling,
                    flags: Flags.CAPTURE + Flags.PROMOTION
                }
    
                this._history.push(hist)
            } else {
                const hist: Move = {
                    color: color,
                    from: from,
                    to: to,
                    captured: capt,
                    piece: move.piece,
                    epSquare: this._epSquare,
                    halfMovesClock: this._halfMovesClock,
                    moveNumber: this._moveNumber,
                    kings: this._kings,
                    castling: this._castling,
                    flags: Flags.CAPTURE
                }
    
                this._history.push(hist)
            }
            const hist: Move = {
                color: color,
                from: from,
                to: to,
                captured: capt,
                piece: move.piece,
                epSquare: this._epSquare,
                halfMovesClock: this._halfMovesClock,
                moveNumber: this._moveNumber,
                kings: this._kings,
                castling: this._castling,
                flags: Flags.CAPTURE
            }

            this._history.push(hist)

            if (validTurn && color === BLACK) {
                this._moveNumber++
            }
            if (validTurn) this._turn = swapColor(color)
            
            return
        }

        if ((move.flags & BIT_FLAGS.EP_CAPTURE) !== 0) {
            const capt = this._board[to+PAWN_OFFSETS[swapColor(color)][0]].type

            this._board[from] = undefined
            this._board[to] = { type: move.piece, color: color } as Piece
            this._board[to+PAWN_OFFSETS[swapColor(color)][0]] = undefined

            this.updateEnPassant()
            this.updateCastling()

            this._halfMovesClock = 0

            const hist: Move = {
                color: color,
                from: from,
                to: to,
                captured: capt,
                piece: move.piece,
                epSquare: this._epSquare,
                halfMovesClock: this._halfMovesClock,
                moveNumber: this._moveNumber,
                kings: this._kings,
                castling: this._castling,
                flags: Flags.EP_CAPTURE
            }

            this._history.push(hist)

            if (validTurn && color === BLACK) {
                this._moveNumber++
            }
            if (validTurn) this._turn = swapColor(color)

            return
        }

        

        if ((move.flags & BIT_FLAGS.KSIDE_CASTLE) !== 0 && move.piece === KING) {
            this.updateCastling()
            this.updateEnPassant()

            // Move King
            this._board[from] = undefined
            this._board[to] = { type: move.piece, color: color } as Piece

            // Move Rook
            this._board[to+1] = undefined
            this._board[to-1] = { type: ROOK, color: color } as Piece

            this._halfMovesClock++

            this._kings[color] = to
            this._castling[color] -= BIT_FLAGS.KSIDE_CASTLE

            const hist: Move = {
                color: color,
                from: from,
                to: to,
                piece: move.piece,
                epSquare: this._epSquare,
                halfMovesClock: this._halfMovesClock,
                moveNumber: this._moveNumber,
                kings: this._kings,
                castling: this._castling,
                flags: Flags.KSIDE_CASTLE
            }

            this._history.push(hist)

            if (validTurn && color === BLACK) {
                this._moveNumber++
            }
            if (validTurn) this._turn = swapColor(color)

            return
        }

        if ((move.flags & BIT_FLAGS.QSIDE_CASTLE) !== 0 && move.piece === KING) {
            this.updateCastling()
            this.updateEnPassant()

            // Move King
            this._board[from] = undefined
            this._board[to] = { type: move.piece, color: color } as Piece

            // Move Rook
            this._board[to-2] = undefined
            this._board[to+1] = { type: ROOK, color: color } as Piece

            this._halfMovesClock++

            this._kings[color] = to
            this._castling[color] -= BIT_FLAGS.QSIDE_CASTLE

            const hist: Move = {
                color: color,
                from: from,
                to: to,
                piece: move.piece,
                epSquare: this._epSquare,
                halfMovesClock: this._halfMovesClock,
                moveNumber: this._moveNumber,
                kings: this._kings,
                castling: this._castling,
                flags: Flags.QSIDE_CASTLE
            }

            this._history.push(hist)

            if (validTurn && color === BLACK) {
                this._moveNumber++
            }
            if (validTurn) this._turn = swapColor(color)

            return
        }

        if ((move.flags & BIT_FLAGS.DOUBLE_PAWN) !== 0) {

            this._board[from] = undefined
            this._board[to] = { type: move.piece, color: color } as Piece

            
            this.updateCastling()
            this.updateEnPassant()

            this._epSquare = to + (color===WHITE ? 16 : -16)

            const hist: Move = {
                color: color,
                from: from,
                to: to,
                piece: move.piece,
                epSquare: this._epSquare,
                halfMovesClock: this._halfMovesClock,
                moveNumber: this._moveNumber,
                kings: this._kings,
                castling: this._castling,
                flags: Flags.DOUBLE_PAWN
            }

            this._history.push(hist)

            if (validTurn && color === BLACK) {
                this._moveNumber++
            }
            if (validTurn) this._turn = swapColor(color)

            return
        }

        return false
    }

    moveBy64({ legal=true, validTurn=true, from, to }) {
        const realFrom = 16 * (Math.floor(from/8)) + (from%8)
        const realTo = 16 * (Math.floor(to/8)) + (to%8)

        const pieceF = this.get(toAlgebraic(realFrom))
        const pieceT = this.get(toAlgebraic(realTo))

        if (pieceF != false) {

            let f = 0
            let norm = true

            const lastRank = pieceF.color == WHITE ? RANK_8 : RANK_1
            const doublePawnOffset = pieceF.color == WHITE ? -32 : 32

            if (this._board[realTo]) {
                f+=BIT_FLAGS.CAPTURE
                norm = false
            } 
            if (pieceF.type == PAWN && lastRank == rank(realTo)) { // check if promotion

                f+=BIT_FLAGS.PROMOTION
                norm = false
            }

            if (realTo == this._epSquare && pieceF.type == PAWN) { // check if ep capture

                f+=BIT_FLAGS.EP_CAPTURE
                norm = false
            }

            if (pieceF.type == KING && (this._castling[pieceF.color] & BIT_FLAGS.KSIDE_CASTLE) != 0  && (realTo-realFrom) == 2) { // check if king side castle

                f+=BIT_FLAGS.KSIDE_CASTLE
                norm = false
            }

            if (pieceF.type == KING && (this._castling[pieceF.color] & BIT_FLAGS.QSIDE_CASTLE) != 0 && (realTo-realFrom) == -2) { // check if queen side castle

                f+=BIT_FLAGS.QSIDE_CASTLE
                norm = false
            }

            if (pieceF.type == PAWN && (realTo-realFrom) == doublePawnOffset) { // check if double pawn

                f+=BIT_FLAGS.DOUBLE_PAWN
                norm = false
            }

            f+= norm ? BIT_FLAGS.NORMAL : 0

            const m: InternalMove = {
                color: pieceF.color,
                from: realFrom,
                to: realTo,
                piece: pieceF.type,
                captured: pieceT != false && (f&BIT_FLAGS.CAPTURE) != 0 ? pieceT.type : undefined,
                promotion: (f&BIT_FLAGS.PROMOTION) != 0 ? QUEEN : undefined,
                flags: f
            }

    
            this.move({ legal: legal, validTurn: validTurn, move: m })
        }

        return

    }

    undoMove() {

    }

    createDeepCopy() {
        let copy = new Chessboard(this.getFEN())


        // load history
        for (let i =0 ;i<this._history.length;i++) {
            const move: Move = {
                color: this._history[i].color,
                from: this._history[i].from,
                to: this._history[i].to,
                captured: this._history[i]?.captured,
                piece: this._history[i].piece,
                promotion: this._history[i]?.promotion,
                epSquare: this._history[i].epSquare,
                halfMovesClock: this._history[i].halfMovesClock,
                moveNumber: this._history[i].moveNumber,
                kings: this._history[i].kings,
                castling: this._history[i].castling,
                flags: this._history[i].flags,
            }


            copy._history[i] = move
        }
        
        return copy
    }
}