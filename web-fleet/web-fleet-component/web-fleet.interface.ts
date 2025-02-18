interface OperatingSystem {
    os: "ubuntu" | "amazonlinux",
    size: "small" | "medium" | "large",
    count: Number
}

export interface WebServerFleetParameters {
    subnets: string[],
    machines: OperatingSystem[]
}