interface Task {
  img: string;
  resolve: (param: string | PromiseLike<string>) => void;
  reject: (reason?: any) => void;
}

export { Task };
