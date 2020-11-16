async function start() {
  return await Promise.resolve('async is working');
}

const unused = 42;

class Util {
  static id = Date.now();
}
