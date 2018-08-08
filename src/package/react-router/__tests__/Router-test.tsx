import * as React from "react";
import * as ReactDOM from "react-dom";
import Router from "../Router";
import { createMemoryHistory as createHistory } from "history";
import { IRouteContext , Context } from '../context';

describe("A <Router>", () => {
  const node = document.createElement("div");

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(node);
  });

  describe("when it has more than one child", () => {
    it("throws an error explaining a Router may have only one child", () => {
      spyOn(console, "error");

      expect(() => {
        ReactDOM.render(
          <Router history={createHistory()}>
            <p>Foo</p>
            <p>Bar</p>
          </Router>,
          node
        );
      }).toThrow(/A <Router> may have only one child element/);
    });
  });

  describe("with exactly one child", () => {
    it("does not throw an error", () => {
      expect(() => {
        ReactDOM.render(
          <Router history={createHistory()}>
            <p>Bar</p>
          </Router>,
          node
        );
      }).not.toThrow();
    });
  });

  describe("with no children", () => {
    it("does not throw an error", () => {
      expect(() => {
        ReactDOM.render(<Router history={createHistory()} />, node);
      }).not.toThrow();
    });
  });

  describe("context", () => {
    let rootContext!:IRouteContext | undefined; // TODO
    const ContextChecker = () => {
      return (<Context.Consumer>
        {(context:IRouteContext)=>{
          rootContext = context; 
          return null
        }}
      </Context.Consumer>);
    };
    // ContextChecker.contextTypes = {
    //   router: PropTypes.shape({
    //     history: PropTypes.object,
    //     route: PropTypes.object
    //   })
    // };

    afterEach(() => {
      rootContext = undefined;
    });

    it("puts history on context.history", () => {
      const history = createHistory();
      ReactDOM.render(
        <Router history={history}>
          <ContextChecker />
        </Router>,
        node
      );

      // expect(rootContext!.router.history).toBe(history); // TODO
    });

    it("sets context.router.route at the root", () => {
      const history = createHistory({
        initialEntries: ["/"]
      });

      ReactDOM.render(
        <Router history={history}>
          <ContextChecker />
        </Router>,
        node
      );
      const Data = rootContext!.data
      expect(Data.router.route.match.path).toEqual("/");// TODO
      expect(Data.router.route.match.url).toEqual("/");// TODO
      expect(Data.router.route.match.params).toEqual({});// TODO
      expect(Data.router.route.match.isExact).toEqual(true);// TODO
      expect(Data.router.route.location).toEqual(history.location);// TODO
    });

    it("updates context.router.route upon navigation", () => {
      const history = createHistory({
        initialEntries: ["/"]
      });
      let RouterRef!:Router

      ReactDOM.render(
        <Router ref={(ref:Router)=>{
          RouterRef = ref;
        }} history={history}>
          <ContextChecker />
        </Router>,
        node
      );

      expect(rootContext!.data.router.route.match.isExact).toBe(true);// TODO
      const newLocation = { pathname: "/new" };
      RouterRef.history.push(newLocation);  
      
      // 这里的实现了直接从外部属性修改了内部组件的props 并且因为违反props readonly 的 规定，使得代码容易不可控制。
      // 若希望能够 代理 history 对象进行修改的话，不如对所有Router 都内置history 修改的方法。
      // 而且我是真的想不到怎么能够实现不违背readonly 修改props 
      
      expect(rootContext!.data.router.route.match.isExact).toBe(false);// TODO
    });

    it("does not contain context.router.staticContext by default", () => {
      const history = createHistory({
        initialEntries: ["/"]
      });

      ReactDOM.render(
        <Router history={history}>
          <ContextChecker />
        </Router>,
        node
      );
      const Data = rootContext!.data
      expect(Data.router.staticContext).toBe(undefined);// TODO
    });
  });
});
