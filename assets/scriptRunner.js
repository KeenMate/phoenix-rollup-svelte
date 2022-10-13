const readdir = require("fs/promises").readdir;
const { exec } = require("child_process");
const { stdout } = require("process");
var settings;
async function run() {
  let args = process.argv;

  let mode = args[2] ?? "prod";

  let watch = shouldWatch(args);

  settings = { watch, mode };
  console.log(settings);

  let app = args[4];

  let commands;

  if (app) {
    if (app == "main") {
      commands = [createMainCommand()];
    } else {
      commands = [createCommand(app)];
    }
  } else {
    let aplications = await getDirectories("apps");

    commands = createCommands(aplications);
  }

  console.log(commands);

  executeCommands(commands);
}

function createCommands(aplications) {
  let commands = aplications.map((name) => createCommand(name));

  commands.push(createMainCommand());

  return commands;
}

function createCommand(name) {
  let script = `cross-env SVELTE_APP=${name} vite build --mode ${settings.mode} --config apps.vite.config.js`;

  if (settings.watch) {
    script += " --watch";
  }

  return { name, cmd: script };
}

function createMainCommand(mode, watch) {
  let script = ` vite build --mode ${settings.mode} --config main.vite.config.js `;

  if (settings.watch) {
    script += " --watch";
  }

  return { name: "main", cmd: script };
}

function executeCommands(scripts) {
  scripts.map(async (command) => executeCommand(command));
}

function executeCommand(script) {
  let process = exec(script.cmd);
  //stream output from process to console
  process.stdout.on("data", (data) => PassToStdout(script.name, data));
}

function PassToStdout(name, data) {
  const Reset = "\u001b[0m";
  const Gray = "\u001b[38;5;239m";

  stdout.write(`${Gray}[${name}]${Reset}  ${data}`);
}

function shouldWatch(args) {
  if (args.length < 4) return false;
  if (args[3] == "watch") return true;

  return false;
}

async function getDirectories(file) {
  let fullPath = require("path").resolve(__dirname, file);

  let directories = (
    await readdir(fullPath, {
      withFileTypes: true,
    })
  ).filter((dirent) => dirent.isDirectory());

  return directories.map((dirent) => dirent.name);
}

run();
