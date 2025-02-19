import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

import { WebServerFleetParameters } from "./web-fleet.interface";

///////////////////////////////////

const sizeMapping = {
  small: "t2.medium",
  medium: "t2.large",
  large: "t2.2xlarge",
};

const osMapping = {
  amazonlinux: "ami-053a45fff0a704a47",
  ubuntu: "ami-04b4f1a9cf54c11d0",
};

///////////////////////////////////

export class WebServerFleet extends pulumi.ComponentResource {
  constructor(name: string, args: WebServerFleetParameters) {
    super("WebServerFleet", name, args);

    for (const subnet of args.subnets) {
      console.log(subnet);

      for (const os of args.machines) {
        for (let i = 0; i < os.count; i++) {
          const virtualMachine = new aws.ec2.Instance(
            `${subnet}-${os.os}-${os.size}-${i}`,
            {
              instanceType: sizeMapping[os.size],
              ami: osMapping[os.os],
              subnetId: subnet,
            }
          );
        }
      }
    }
  }
}
