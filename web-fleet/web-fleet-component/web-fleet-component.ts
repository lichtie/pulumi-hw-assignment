import * as pulumi from "@pulumi/pulumi";
import { WebServerFleetParameters } from "./web-fleet.interface"

export class WebServerFleet extends pulumi.ComponentResource {
    constructor(name: string, args: WebServerFleetParameters) {
        super("WebServerFleet", name, args);
    }
}