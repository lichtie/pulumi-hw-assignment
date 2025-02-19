import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

import { WebServerFleet } from "./web-fleet-component/web-fleet-component";

const vpc = new aws.ec2.Vpc("fleet-deployment-vpc", {
  cidrBlock: "10.0.0.0/24",
});

const subnet1 = new aws.ec2.Subnet("fleet-deployment-subnet-1", {
  vpcId: vpc.id,
  cidrBlock: "10.0.0.0/28",
});

const subnet2 = new aws.ec2.Subnet("fleet-deployment-subnet-2", {
  vpcId: vpc.id,
  cidrBlock: "10.0.0.32/28",
});

//**This is the sample input to test with */
pulumi.all([subnet1.id, subnet2.id]).apply(([subnetId1, subnetId2]) => {
  new WebServerFleet("Elisabeth-fleet", {
    subnets: [subnetId1, subnetId2],
    machines: [
      { os: "ubuntu", size: "small", count: 1 },
      { os: "amazonlinux", size: "medium", count: 2 },
    ],
  });
});
