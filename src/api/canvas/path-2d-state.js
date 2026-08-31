const pathState = new WeakMap();

export function initializePath2D(path, commands = []) {
  pathState.set(path, commands.map(command => [...command]));
}

export function requirePath2D(path) {
  const commands = pathState.get(path);
  if (commands === undefined) throw new TypeError("Illegal invocation");
  return commands;
}

export function isPath2D(path) {
  return pathState.has(path);
}

export function appendPathCommand(path, name, values = []) {
  requirePath2D(path).push([name, ...values]);
}
