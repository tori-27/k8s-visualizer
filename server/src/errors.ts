export enum AppErrorCode {
  // Cluster
  CLUSTER_NOT_CONNECTED = "CLUSTER_NOT_CONNECTED",
  CLUSTER_CONNECTION_FAILED = "CLUSTER_CONNECTION_FAILED",
  CLUSTER_AUTH_FAILED = "CLUSTER_AUTH_FAILED",

  // K8s API
  K8S_NOT_FOUND = "K8S_NOT_FOUND",
  K8S_FORBIDDEN = "K8S_FORBIDDEN",
  K8S_TIMEOUT = "K8S_TIMEOUT",

  // Validation
  INVALID_KUBECONFIG = "INVALID_KUBECONFIG",
  INVALID_NAMESPACE = "INVALID_NAMESPACE",
}

export class AppError extends Error {
  constructor(
    public code: AppErrorCode,
    message: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = "AppError";
  }
}
