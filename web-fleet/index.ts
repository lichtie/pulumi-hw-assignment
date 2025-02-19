import * as pulumi from "@pulumi/pulumi";
import { WebServerFleet } from "./web-fleet-component/web-fleet-component";

//**This is the sample input to test with */
new WebServerFleet("Elisabeth-fleet", {
  subnets: ["subnet-abc123", "subnet-abc123"],
  machines: [
    { os: "ubuntu", size: "small", count: 3 },
    { os: "amazonlinux", size: "medium", count: 2 },
  ],
});
