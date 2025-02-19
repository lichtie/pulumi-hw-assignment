import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

import { WebServerFleet } from "./web-fleet-component/web-fleet-component";

const vpc = new aws.ec2.Vpc("fleet-deployment-vpc", {
  cidrBlock: "10.0.0.0/24",
});

const internetGateway = new aws.ec2.InternetGateway("fleet-igw", {
  vpcId: vpc.id,
});

const subnet1 = new aws.ec2.Subnet("fleet-deployment-subnet-1", {
  vpcId: vpc.id,
  cidrBlock: "10.0.0.0/28",
  availabilityZone: "us-east-1a",
  mapPublicIpOnLaunch: true,
});

const publicRouteTable1 = new aws.ec2.RouteTable("fleet-rt1", {
  vpcId: vpc.id,
  routes: [
    // { cidrBlock: "10.0.0.0/28", gatewayId: "local" },
    { cidrBlock: "0.0.0.0/0", gatewayId: internetGateway.id },
  ],
});

const publicRouteTableAssoc = new aws.ec2.RouteTableAssociation(
  "fleet-rt-assoc",
  {
    routeTableId: publicRouteTable1.id,
    subnetId: subnet1.id,
  }
);

const securityGroup = new aws.ec2.DefaultSecurityGroup("allow-me-to-access", {
  vpcId: vpc.id,
});

const AllowUserAccess = new aws.vpc.SecurityGroupIngressRule(
  "allow_user_access",
  {
    securityGroupId: securityGroup.id,
    cidrIpv4: "71.34.12.166/32",
    ipProtocol: "-1",
  }
);

const AllowInternal = new aws.vpc.SecurityGroupIngressRule(
  "allow_internal_access",
  {
    securityGroupId: securityGroup.id,
    referencedSecurityGroupId: securityGroup.id,
    ipProtocol: "-1",
  }
);

const AllowOutbound = new aws.vpc.SecurityGroupEgressRule(
  "allow_outbound_traffic",
  {
    securityGroupId: securityGroup.id,
    ipProtocol: "-1",
    cidrIpv4: "0.0.0.0/0",
  }
);

const subnet2 = new aws.ec2.Subnet("fleet-deployment-subnet-2", {
  vpcId: vpc.id,
  cidrBlock: "10.0.0.32/28",
  availabilityZone: "us-east-1b",
  mapPublicIpOnLaunch: true,
});

const publicRouteTableAssoc2 = new aws.ec2.RouteTableAssociation(
  "fleet-rt-assoc2",
  {
    routeTableId: publicRouteTable1.id,
    subnetId: subnet2.id,
  }
);

//**This is the sample input to test with */
new WebServerFleet("Elisabeth-fleet", {
  subnets: [subnet1.id, subnet2.id],
  machines: [
    { os: "ubuntu", size: "small", count: 3 },
    { os: "amazonlinux", size: "medium", count: 2 },
  ],
});
