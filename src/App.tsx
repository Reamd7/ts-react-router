import * as React from 'react';
import './App.css';
import $Context from "./context";
import logo from './logo.svg';

interface IContextType{
  title:string
}
class Context extends $Context<IContextType>({}){
  public changeTitle(name:string){
    this.data = {
      ...this.data,
      title:name
    }
  }
}
class App extends React.Component {
  public state = {
    title:"1"
  }
  public count = 1
  public ContextRef:Context;
  public click = ()=>{
    if (this.count > 10){
      console.log(this.ContextRef)
      this.ContextRef.changeTitle(String(this.count++));
    }else{
      this.setState({
        title:this.state.title + (++this.count)
      })
    }
  }
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <Context value={this.state}>
          <Context.Consumer>
            {(context)=>{
              this.ContextRef = this.ContextRef || context.ref as Context;
              /** this.state === context.data */
              return (
                <p className="App-intro" onClick={this.click}>
                  clickIn, {this.state.title}edit <code>src/{context.data.title}.tsx</code> and save to reload.
                </p>
              )
            }}
          </Context.Consumer>
        </Context>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
