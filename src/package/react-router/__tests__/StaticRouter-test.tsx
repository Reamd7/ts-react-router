import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactDOMServer from "react-dom/server";
import StaticRouter from "../StaticRouter";
import Redirect from "../Redirect";
import Route, { IRouteComponentProps } from "../Route";
import Prompt from "../Prompt";
import { IRouteContext, Context } from '../context';
import { IStaticRouterContext } from '../StaticRouter';
describe("A <StaticRouter>", () => {
  it("provides context.router.staticContext in props.staticContext", () => {
    const ContextChecker = (props:IRouteComponentProps<any>) => {
      return (
        <Context.Consumer>
          {(context:IRouteContext)=>{
            const reactContext = context.data
            expect(typeof reactContext.router).toBe("object");
            expect(reactContext.router.staticContext).toBe(props.staticContext);
            return null
          }}
        </Context.Consumer>
      )
    };
    const context = {};

    ReactDOMServer.renderToStaticMarkup(
      <StaticRouter context={context}>
        <Route component={ContextChecker} />
      </StaticRouter>
    );
  });

  it("context.router.staticContext persists inside of a <Route>", () => {
    const ContextChecker = (props:IRouteComponentProps<any>) => {
      return (
        <Context.Consumer>
          {(context:IRouteContext)=>{
            const reactContext = context.data
            expect(typeof reactContext.router).toBe("object");
            expect(reactContext.router.staticContext).toBe(props.staticContext);
            return null
          }}
        </Context.Consumer>
      )
    };

    const context = {};

    ReactDOMServer.renderToStaticMarkup(
      <StaticRouter context={context}>
        <Route component={ContextChecker} />
      </StaticRouter>
    );
  });

  it("provides context.router.history", () => {

    const ContextChecker = (props:IRouteComponentProps<any>) => {
      return (
        <Context.Consumer>
          {(context:IRouteContext)=>{
            const reactContext = context.data
            expect(typeof reactContext.router.history).toBe("object");
            return null
          }}
        </Context.Consumer>
      )
    };

    const context = {};

    ReactDOMServer.renderToStaticMarkup(
      <StaticRouter context={context}>
        <ContextChecker />
      </StaticRouter>
    );
  });

  // it("warns when passed a history prop", () => {
  //   const context = {};
  //   const history = {};
  //   const node = document.createElement("div");

  //   spyOn(console, "error");

  //   ReactDOM.render(<StaticRouter context={context} history={history} />, node); // 借助typescipt 将这种可能性删除

  //   expect(console.error).toHaveBeenCalledTimes(1);
  //   expect(console.error).toHaveBeenCalledWith(
  //     expect.stringContaining("<StaticRouter> ignores the history prop")
  //   );
  // });

  it("reports PUSH actions on the context object", () => {
    const context:IStaticRouterContext = {};

    ReactDOMServer.renderToStaticMarkup(
      <StaticRouter context={context}>
        <Redirect push={true} to="/somewhere-else" />
      </StaticRouter>
    );

    expect(context.action).toBe("PUSH");
    expect(context.url).toBe("/somewhere-else");
  });

  it("reports REPLACE actions on the context object", () => {
    const context:IStaticRouterContext = {};

    ReactDOMServer.renderToStaticMarkup(
      <StaticRouter context={context}>
        <Redirect to="/somewhere-else" />
      </StaticRouter>
    );

    expect(context.action).toBe("REPLACE");
    expect(context.url).toBe("/somewhere-else");
  });

  describe("location", () => {
    it("knows how to parse raw URL string into an object", () => {
      const LocationChecker = (props:IRouteComponentProps<any>) => {
        expect(props.location).toMatchObject({
          pathname: "/the/path",
          search: "?the=query",
          hash: "#the-hash"
        });
        return null;
      };

      const context = {};

      ReactDOMServer.renderToStaticMarkup(
        <StaticRouter context={context} location="/the/path?the=query#the-hash">
          <Route component={LocationChecker} />
        </StaticRouter>
      );
    });

    it("adds missing properties to location object", () => {
      const LocationChecker = (props:IRouteComponentProps<any>) => {
        expect(props.location).toMatchObject({
          pathname: "/test",
          search: "",
          hash: ""
        });
        return null;
      };

      const context = {};

      ReactDOMServer.renderToStaticMarkup(
        <StaticRouter context={context} location={{ pathname: "/test" }}>
          <Route component={LocationChecker} />
        </StaticRouter>
      );
    });

    it("decodes an encoded pathname", () => {
      const LocationChecker = (props:IRouteComponentProps<any>) => {
        expect(props.location).toMatchObject({
          pathname: "/estático",
          search: "",
          hash: ""
        });
        expect(props.match!.params.type).toBe("estático"); // TODO
        return null;
      };

      const context = {};

      ReactDOMServer.renderToStaticMarkup(
        <StaticRouter
          context={context}
          location={{ pathname: "/est%C3%A1tico" }}
        >
          <Route path="/:type" component={LocationChecker} />
        </StaticRouter>
      );
    });

    it("knows how to serialize location objects", () => {
      const context:IStaticRouterContext = {};

      ReactDOMServer.renderToStaticMarkup(
        <StaticRouter context={context}>
          <Redirect to={{ pathname: "/somewhere-else" }} />
        </StaticRouter>
      );

      expect(context.action).toBe("REPLACE");
      expect(context.location!.pathname).toBe("/somewhere-else"); // TODO
      expect(context.location!.search).toBe("");// TODO
      expect(context.location!.hash).toBe("");// TODO
      expect(context.url).toBe("/somewhere-else");
    });

    describe("with a basename", () => {
      it("strips the basename from location pathnames", () => {
        const LocationChecker = (props:IRouteComponentProps<any>) => {
          expect(props.location).toMatchObject({
            pathname: "/path"
          });
          return null;
        };

        const context = {};

        ReactDOMServer.renderToStaticMarkup(
          <StaticRouter
            context={context}
            basename="/the-base"
            location="/the-base/path"
          >
            <Route component={LocationChecker} />
          </StaticRouter>
        );
      });

      it("reports PUSH actions on the context object", () => {
        const context:IStaticRouterContext = {};

        ReactDOMServer.renderToStaticMarkup(
          <StaticRouter context={context} basename="/the-base">
            <Redirect push={true} to="/somewhere-else" />
          </StaticRouter>
        );

        expect(context.action).toBe("PUSH");
        expect(context.url).toBe("/the-base/somewhere-else");
      });

      it("reports REPLACE actions on the context object", () => {
        const context:IStaticRouterContext = {};

        ReactDOMServer.renderToStaticMarkup(
          <StaticRouter context={context} basename="/the-base">
            <Redirect to="/somewhere-else" />
          </StaticRouter>
        );

        expect(context.action).toBe("REPLACE");
        expect(context.url).toBe("/the-base/somewhere-else");
      });
    });

    describe("no basename", () => {
      it("createHref does not append extra leading slash", () => {
        const context:IStaticRouterContext = {};
        const node = document.createElement("div");
        const pathname = "/test-path-please-ignore";

        const Link = ({to,children}:(React.Props<any> & {to:string})) => (
          <Route
            children={(props) => {
              const createHref = props.history!.createHref!;
              return (<a href={createHref(to as any)}>{children}</a>)    // TODO 此处to类型有重大问题
            }}
          />
        );

        ReactDOM.render(
          <StaticRouter context={context}>
            <Link to={pathname} />
          </StaticRouter>,
          node
        );

        const a = node.getElementsByTagName("a")[0];
        expect(a.getAttribute("href")).toEqual(pathname);
      });
    });
  });

  describe("render a <Prompt>", () => {
    it("does nothing", () => {
      const context = {};
      const node = document.createElement("div");

      expect(() => {
        ReactDOM.render(
          <StaticRouter context={context}>
            <Prompt message="this is only a test" />
          </StaticRouter>,
          node
        );
      }).not.toThrow();
    });
  });
});
