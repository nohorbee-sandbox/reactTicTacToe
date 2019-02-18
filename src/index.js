import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {

  function highlight(should) {
    if (should)
      return {backgroundColor: "#FF0000"}
  }

  return(
    <button
      className="square"
      onClick={props.onClick}
      style={highlight(props.highlight)}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        key={i}
        highlight={this.props.highlight && this.props.highlight.includes(i)}
        value={this.props.squares[i]}
        onClick={()=>this.props.onClick(i)}
      />
    );
  }

  render() {

    const SIZE = 3;

    var rows = [];
    let squares = [];

    for (var i=0; i<SIZE; i++) {
      for (var j=i*SIZE; j<i*SIZE+SIZE;j++) {
        squares.push(this.renderSquare(j));
      }
      rows.push(<div className="board-row" key={i}>{squares}</div>);
      squares = [];
    }

    return (

      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        rowCol: [null, null],
      }],
      xIsNext: true,
      stepNumber: 0,
      ascHistorySort: true,
    }
  }

  styleWeight(shouldBold) {
    if (shouldBold)
      return {fontWeight: 'bold'};
  }

  sortHistory() {
    let moves = this.state.history.slice();
    moves.reverse();
    this.setState({ascHistorySort : !this.state.ascHistorySort});


    this.setState(
       {history: moves}
    );

  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const highlight = (winner.winner ? winner.squares : null);

    const moves = history.map((step, move) => {
      const desc =
        (((move && this.state.ascHistorySort) || (!this.state.ascHistorySort && move !== this.state.history.length-1)) ?
        'Go to move #' + (move + (this.state.ascHistorySort ? 0 : 1)) + (step.rowCol[0] ? '('+ step.rowCol[0] + ', ' + step.rowCol[1] + ')' : '') :
        'Go to game start');
      return (
        <li key={move}>
          <button style={this.styleWeight(move === this.state.stepNumber)} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });


    let status;
    if (winner.winner) {
      status = "Winner: " + winner.winner;
    } else if(winner.complete) {
      status = "Game complete - No winners";
    }
    else {
      status = "Next player: " + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            highlight={highlight}
            squares={current.squares}
            onClick={(i)=>this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <div><button onClick={()=>this.sortHistory()}>Toggle sorting</button></div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const rowCol = current.rowCol.slice();
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    let tempRowCol = calculateRowCol(i);
    rowCol[0] = tempRowCol[0];
    rowCol[1] = tempRowCol[1];
    this.setState({
      history: history.concat([{
        squares: squares,
        rowCol: rowCol,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,

    });

  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

}


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateRowCol(i) {
  let oneBasedPosition = i;
  let row = Math.floor((oneBasedPosition / 3) + 1);
  let col = oneBasedPosition % 3 + 1;

  return [row, col];
}

function calculateWinner(squares) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];

  let complete = true;

  for (let i = 0; i < lines.length; i++) {
    const [a,b,c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner:squares[a], squares: lines[i]  };
    }
    if(!squares[a] || !squares[b] || !squares[c]) {
      complete = false;
    }
  }
  return { winner: false, complete: complete };
}
