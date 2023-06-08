import { Route, Switch } from "react-router-dom";

export const renderRoutes = (routers) => {
    return (
        <Switch>
            {
                routers.map(router => {
                    return (
                        <Route path={router.path} exact={router.exact} component={router.component} />
                    )
                })
            }
        </Switch>
    )
}
