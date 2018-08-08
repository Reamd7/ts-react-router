import * as React from "react";
import * as ReactDOM from "react-dom";
import MemoryRouter from "../MemoryRouter";
import { Context } from '../context/index';

describe("A <MemoryRouter>", () => {
  it("puts history on context.router", () => {
    let history;
    // const ContextChecker = (props) => {
    //   history = context.router.history;
    //   return null;
    // };

    // ContextChecker.contextTypes = {
    //   router: PropTypes.object.isRequired
    // };
    function ContextChecker(){
      return (<Context.Consumer>
        {(context)=>{
          history = context.data.router.history;
          return (null)
        }}
      </Context.Consumer>)
    }

    const node = document.createElement("div");

    ReactDOM.render(
      <MemoryRouter>
        <ContextChecker />
      </MemoryRouter>,
      node
    );

    expect(typeof history).toBe("object");
  });

  // Typescript 限制了history prop
  // it("warns when passed a history prop", () => {
  //   const history = {};
  //   const node = document.createElement("div");

  //   spyOn(console, "error");

  //   ReactDOM.render(<MemoryRouter history={history} />, node);

  //   expect(console.error).toHaveBeenCalledTimes(1);
  //   expect(console.error).toHaveBeenCalledWith(
  //     expect.stringContaining("<MemoryRouter> ignores the history prop")
  //   );
  // });
});
