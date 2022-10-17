const readdir = require("fs/promises").readdir;
const { exec } = require("child_process");
const { stdout } = require("process");

function parseArgumetns() {
  let args = require("yargs/yargs")(process.argv.slice(2))
    .alias("w", "watch")
    .describe("w", "Recompile when files change")
    .default("w", false)
    .alias("m", "mode")
    .describe("m", "Build mode")
    .describe("m", "Build mode")
    .choices("m", ["dev", "prod"])
    .nargs("m", 1)
    .demandOption(["m"])
    .describe("d", "debug logs")
    .boolean(["d", "w"])
    .help("h")
    .alias("h", "help").argv;

  if (args.d) {
    console.log(args);
  }

  return { watch: args.w, mode: args.m, apps: args._, debug: !!args.d };
}

var settings;
async function run() {
  settings = parseArgumetns();

  if (settings.debug) {
    console.debug({ settings });
  }

  let commands = await getCommands();

  if (settings.debug) {
    console.debug({ commands });
  }

  executeCommands(commands);
}

async function getCommands() {
  if (settings.apps?.length > 0) {
    return createCommands(settings.apps);
  } else {
    let aplications = await getDirectories("apps");
    aplications.push("main");

    return createCommands(aplications);
  }
}

function createCommands(aplications) {
  console.log("starting build for aplication: " + aplications.join(", "));

  if (settings.debug) {
    console.debug({ aplications });
  }

  return aplications.map((name) => createCommand(name));
}

function createCommand(name) {
  let script;

  if (name === "main") {
    script = ` vite build --mode ${settings.mode} --config main.vite.config.js `;
  } else {
    script = `cross-env SVELTE_APP=${name} vite build --mode ${settings.mode} --config apps.vite.config.js`;
  }

  if (settings.watch) {
    script += " --watch";
  }

  return { name, cmd: script };
}

async function executeCommands(scripts) {
  scripts.map(async (command) => executeCommand(command));
}

function executeCommand(script) {
  console.log("starting process for " + script.name);
  let process = exec(script.cmd);
  //stream output from process to console
  process.stdout.on("data", (data) => passToStdout(script.name, data));

  process.stderr.on("data", (data) => passToStdout(script.name, data));
}

function passToStdout(name, data, err) {
  let withoutLastEnter = data.replace(/\n+$/, "");

  let formattedData = withoutLastEnter.replace(/^/gm, putAppName(name, err));

  stdout.write(formattedData + "\n");
}

function putAppName(name, err) {
  const Reset = "\u001b[0m";
  const Gray = "\u001b[38;5;239m";
  const Red = "\u001b[31m";

  let ansiColor = err ? Red : Gray;

  return `${ansiColor}[${name}]${Reset} `;
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
