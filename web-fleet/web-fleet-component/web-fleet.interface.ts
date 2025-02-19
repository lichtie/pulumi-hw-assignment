interface OperatingSystem {
  os: "ubuntu" | "amazonlinux";
  size: "small" | "medium" | "large";
  count: number;
}

export interface WebServerFleetParameters {
  subnets: string[];
  machines: OperatingSystem[];
}
