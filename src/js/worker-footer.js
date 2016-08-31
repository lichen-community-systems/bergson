/*global fluid, self*/
(function () {
    "use strict";

    // TODO: This should all be refactored to ultimately
    // support a Nexus-like interaction between universes.
    // At the moment, we only support a single postMessageListener
    // component for the entire Worker scope.

    self.addEventListener("message", function (e) {
        if (e.data.type === "create") {
            if (self.activeComponent) {
                self.activeComponent.destroy();
            }

            self.activeComponent = fluid.invokeGlobalFunction(e.data.args[0], [e.data.args[1]]);
            e.stopPropagation();
        }
    }, true);
})();
