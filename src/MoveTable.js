import React from "react";
import ReactTable from "react-table";
import { PokeTable, nameCol, typeCol, statCol } from "./Poketable";
const Moves = require("./moves.json");
const Pokemon = require("./pokemon.json");

export default class MoveTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredPokemon: [],
      clickedMove: null
    };
  }

  _pokemonsByMove(moveName) {
    if (moveName !== null) {
      return Pokemon.filter(p => {
        const movesStr = [p.move1, p.move2, p.move3, p.move4].join(";");
        const re = new RegExp(`.*${moveName}.*`);
        return movesStr.match(re) !== null;
      });
    }
  }

  render() {
    return (
      <div>
        <ReactTable
          filterable
          data={Moves}
          defaultPageSize={10}
          className="-striped -highlight"
          getTdProps={(state, row, col, instance) => ({
            onClick: (event, cb) => {
              const clickedMove = Moves.filter(
                p => p.name === row.original.name
              )[0];
              this.setState({
                filteredPokemon: this._pokemonsByMove(clickedMove.name),
                clickedMove: clickedMove
              });
              cb();
            }
          })}
          columns={[
            {
              Header: "Name",
              columns: [nameCol]
            },
            {
              Header: "Type",
              columns: [
                typeCol("Type", "type"),
                {
                  Header: "Category",
                  width: 80,
                  accessor: "category"
                }
              ]
            },
            {
              Header: "Stats",
              columns: [
                statCol("Pow", "pow", Moves),
                statCol("Acc", "acc", Moves),
                statCol("PP", "pp", Moves)
              ]
            },
            {
              Header: "Effect",
              columns: [
                {
                  Header: "Effect",
                  accessor: "effect"
                }
              ]
            }
          ]}
        />
        {this.state.clickedMove !== null && (
          <div>
            <p>
              Pokemon with {this.state.clickedMove.name} (
              {this.state.filteredPokemon.length}):
            </p>
            <PokeTable
              data={this.state.filteredPokemon}
              updateSelected={this.props.updateSelected}
              onPokemonClick={this.props.onPokemonClick}
            />
          </div>
        )}
      </div>
    );
  }
}
