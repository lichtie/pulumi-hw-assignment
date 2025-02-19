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

const userDataMapping = {
  amazonlinux: `#!/bin/bash
echo "Running userData script" > /var/log/user-data.log
sudo yum update -y
sudo yum install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
echo "NGINX Installation Complete" >> /var/log/user-data.log
`,
  ubuntu: `#!/bin/bash
sudo apt-get update
sudo apt-get install nginx -y`,
};

///////////////////////////////////

export class WebServerFleet extends pulumi.ComponentResource {
  constructor(
    name: string,
    args: WebServerFleetParameters,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super("WebServerFleet", name, args, opts);

    args.subnets.forEach((subnet, index) => {
      console.log(subnet);

      for (const os of args.machines) {
        for (let i = 0; i < os.count; i++) {
          const virtualMachine = new aws.ec2.Instance(
            `subnet-${index}-${os.os}-${os.size}-${i}`,
            {
              instanceType: sizeMapping[os.size],
              ami: osMapping[os.os],
              subnetId: subnet,
              userData: userDataMapping[os.os],
            }
          );
        }
      }
    });
  }
}
