interface OperatingSystem {
    os: string,
    size: string,
    count: Number
}

export interface WebServerFleetParameters {
    subnets: string[],
    machines: OperatingSystem[]
}