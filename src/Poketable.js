import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import {
  sortIntStrings,
  typeIndicatedString,
  getMove,
  rankedStat,
  multiSorter,
  pokeBlock
} from "./Utils";

export const SELECT_NONE = 0;
export const SELECT_ALL = 1;
export const SELECT_SOME = 2;

export const idCol = {
  Header: "ID",
  accessor: "pokeid",
  sortMethod: sortIntStrings,
  width: 50,
  className: "center"
};

export const nameCol = {
  Header: "Name",
  width: 110,
  accessor: "name",
  filterAll: true,
  filterMethod: multiSorter(["name"])
};

export function typeCol(name, accessor) {
  return {
    Header: name,
    accessor: accessor,
    width: 80,
    filterAll: true,
    filterMethod: multiSorter(["type1", "type2"]),
    Cell: row =>
      row.value !== "NULL" && typeIndicatedString(row.value, row.value)
  };
}

export function statCol(name, accessor, data) {
  return {
    Header: name,
    accessor: accessor,
    sortMethod: sortIntStrings,
    width: 80,
    className: "center",
    Cell: row => rankedStat(accessor, row.value, data)
  };
}

export class PokeTable extends React.Component {
  constructor(props) {
    super(props);
    let checkedPokemon = {};
    if (props.selectAll) {
      props.data.forEach(p => (checkedPokemon[p.pokeid] = true));
    }
    this.state = {
      selectAll: props.selectAll ? SELECT_ALL : SELECT_NONE,
      checkedPokemon: checkedPokemon,
      clickedPokemon: null
    };
    this._toggleRow = this._toggleRow.bind(this);
    this._toggleSelectAll = this._toggleSelectAll.bind(this);
    this._checkCol = this._checkCol.bind(this);
    this._checkHeader = this._checkHeader.bind(this);
  }

  _moveCol(name, accessor) {
    return {
      Header: name,
      accessor: accessor,
      filterAll: true,
      filterMethod: multiSorter(["move1", "move2", "move3", "move4"]),
      Cell: row =>
        row.value !== "" &&
        typeIndicatedString(getMove(row.value).type, row.value)
    };
  }

  _toggleRow(id) {
    let newChecked = this.state.checkedPokemon;
    newChecked[id] = !newChecked[id];
    this.props.updateSelected(newChecked);
    this.setState({
      selectAll: SELECT_SOME,
      checkedPokemon: newChecked
    });
  }

  _toggleSelectAll() {
    let newChecked = {};
    if (this.state.selectAll === SELECT_NONE) {
      this.props.data.forEach(p => {
        newChecked[p.pokeid] = true;
      });
    }
    this.props.updateSelected(newChecked);
    this.setState({
      checkedPokemon: newChecked,
      selectAll: this.state.selectAll === SELECT_NONE ? SELECT_ALL : SELECT_NONE
    });
  }

  _checkHeader() {
    const checked = this.state.selectAll === SELECT_ALL;
    return (
      <input
        type="checkbox"
        className="checkbox"
        checked={checked}
        ref={input => {
          if (input === null) {
            return;
          } else if (!checked && this.state.selectAll !== null) {
            input.indeterminate = this.state.selectAll === SELECT_SOME;
          }
        }}
        onChange={() => this._toggleSelectAll()}
      />
    );
  }

  _checkCol() {
    return {
      id: "checkbox",
      className: "center",
      accessor: "",
      width: 50,
      sortable: false,
      filterable: false,
      Header: x => {
        return this._checkHeader();
      },
      Cell: ({ original }) => {
        return (
          <input
            type="checkbox"
            className="checkbox"
            checked={this.state.checkedPokemon[original.pokeid] === true}
            onChange={() => this._toggleRow(original.pokeid)}
          />
        );
      }
    };
  }
  /*
  <button
          onClick={() => [3, 65, 143, 200, 230, 248].map(this._toggleRow)}
        >
          Best Team
        </button>
        */
  render() {
    const { data } = this.props;
    return (
      <div>
        <ReactTable
          filterable
          data={data}
          defaultPageSize={10}
          className="-striped -highlight"
          getTdProps={(state, row, col, instance) => ({
            onClick: (event, cb) => {
              const clickedPokemon = data.filter(
                p => p.pokeid === row.original.pokeid
              )[0];
              this.props.onPokemonClick(clickedPokemon);
              this.setState({ clickedPokemon: clickedPokemon });
              cb();
            }
          })}
          columns={[
            {
              Header: "Team",
              columns: [this._checkCol()]
            },
            {
              Header: "Name",
              columns: [idCol, nameCol]
            },
            {
              Header: "Type",
              columns: [typeCol("Type 1", "type1"), typeCol("Type 2", "type2")]
            },
            {
              Header: "Stats",
              columns: [
                statCol("HP", "hp", data),
                statCol("Atk", "atk", data),
                statCol("Def", "def", data),
                statCol("SpAtk", "spatk", data),
                statCol("SpDef", "spdef", data),
                statCol("Speed", "speed", data)
              ]
            },
            {
              Header: "Moves",
              columns: [
                this._moveCol("Move 1", "move1"),
                this._moveCol("Move 2", "move2"),
                this._moveCol("Move 3", "move3"),
                this._moveCol("Move 4", "move4")
              ]
            }
          ]}
        />
        <br />
        {this.state.clickedPokemon !== null &&
          pokeBlock(this.state.clickedPokemon)}
        <br />
      </div>
    );
  }
}
