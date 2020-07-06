import React from "react";
import { render } from "react-dom";
import { makeData, pokeBlock } from "./Utils";
import { PokeTable } from "./Poketable";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { ResistTable } from "./ResistTable";
import { AttackTable } from "./AttackTable";
import MoveTable from "./MoveTable";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: makeData(),
      clickedPokemon: null,
      comparePokemon: []
    };
    this._updateSelected = this._updateSelected.bind(this);
    this._onPokemonClick = this._onPokemonClick.bind(this);
  }

  _updateSelected(newChecked) {
    let newComparePokemon = makeData();
    newComparePokemon = newComparePokemon.filter(p => newChecked[p.pokeid]);
    this.setState({ comparePokemon: newComparePokemon });
  }

  _onPokemonClick(pokemon) {
    this.setState({ clickedPokemon: pokemon });
  }

  render() {
    const { data, comparePokemon } = this.state;
    return (
      <div>
        <p>
          The numbers in grey are the percent of stats in that column that are
          higher. 0% is the best, 99% is the worst
        </p>
        <Tabs>
          <TabList>
            <Tab>Pokemon</Tab>
            <Tab>Moves</Tab>
            <Tab>Team ({this.state.comparePokemon.length})</Tab>
            <Tab>Resistances ({this.state.comparePokemon.length})</Tab>
            <Tab>
              Damage{" "}
              {this.state.clickedPokemon !== null &&
                `(${this.state.clickedPokemon.name})`}
            </Tab>
          </TabList>
          <TabPanel>
            <PokeTable
              data={data}
              updateSelected={this._updateSelected}
              onPokemonClick={this._onPokemonClick}
            />
          </TabPanel>
          <TabPanel>
            <MoveTable
              updateSelected={this._updateSelected}
              onPokemonClick={this._onPokemonClick}
            />
          </TabPanel>
          <TabPanel>
            <PokeTable
              selectAll
              data={comparePokemon}
              updateSelected={this._updateSelected}
              onPokemonClick={this._onPokemonClick}
            />
          </TabPanel>
          <TabPanel>
            <ResistTable pokemon={this.state.comparePokemon} />
          </TabPanel>
          <TabPanel>
            <AttackTable
              attacker={this.state.pokemon}
              data={
                this.state.comparePokemon.length > 0
                  ? this.state.comparePokemon
                  : data
              }
            />
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}
render(<App />, document.getElementById("root"));
