interface Task {
  img: string;
  is_letter: boolean;
  resolve: (param: string | PromiseLike<string>) => void;
  reject: (reason?: any) => void;
}

export { Task };
