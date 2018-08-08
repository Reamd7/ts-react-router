import * as React from "react";
import { createMemoryHistory as createHistory } from "history";
import Router from "./Router";
import * as H from "history"

// export interface MemoryRouterProps {
//   initialEntries?: H.LocationDescriptor[];
//   initialIndex?: number;
//   getUserConfirmation?: ((message: string, callback: (result: boolean) => void) =>void);
//   keyLength?: number;
// }

export type MemoryRouterProps = H.MemoryHistoryBuildOptions
/**
 * The public API for a <Router> that stores location in memory.
 */
class MemoryRouter extends React.Component<MemoryRouterProps, any> {

  public history = createHistory(this.props);

  // componentWillMount() {
  //   warning(
  //     !this.props.history,
  //     "<MemoryRouter> ignores the history prop. To use a custom history, " +
  //       "use `import { Router }` instead of `import { MemoryRouter as Router }`."
  //   );
  // }

  render() {
    return <Router history={this.history} children={this.props.children} />;
  }
}

export default MemoryRouter;
