#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import { exec, execSync } from "child_process";
import { mkdirSync, writeFileSync } from "fs";
import path from "path";

const mainMenu = async () => {
  console.clear();
  console.log(chalk.bold.blue("Welcome to Project Generator CLI! 🚀\n"));

  const { framework } = await inquirer.prompt([
    {
      type: "list",
      name: "framework",
      message: "Select a framework for your project:",
      choices: [
        "Next.js",
        "React.js",
        "MERN Stack",
        "React Native",
        "Vanilla",
        "Node.js",
      ],
    },
  ]);

  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: `Enter your project name for ${framework}:`,
      validate: (input) => (input ? true : "Project name cannot be empty!"),
    },
  ]);

  generateProject(framework, projectName);
};

const generateProject = (framework, projectName) => {
  let command = "";

  switch (framework) {
    case "React.js":
      command = `npx create-react-app ${projectName}`;
      break;
    case "Next.js":
      command = `npx create-next-app@latest ${projectName}`;
      break;
    case "MERN Stack":
      createMERNProject(projectName);
      return;
    case "React Native":
      command = `npx create-expo-app --template blank ${projectName}`;
      break;
    case "Vanilla":
      createVanillaProject(projectName);
      return;
    case "Node.js":
      createNodeProject(projectName);
      return;
    default:
      console.log(chalk.red("Invalid choice!"));
      return;
  }

  console.log(
    chalk.green(`\nGenerating project: ${projectName} with ${framework}...\n`)
  );

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.log(chalk.red(`Error: ${err.message}`));
      return;
    }

    if (stderr) {
      console.log(chalk.yellow(`Warnings: ${stderr}`));
    }

    console.log(chalk.blue(`\n${stdout}`));
    console.log(
      chalk.bold.green(`\nProject ${projectName} created successfully! 🚀`)
    );
  });
};

const createMERNProject = async (projectName) => {
  console.log(chalk.green(`Creating MERN Stack project: ${projectName}\n`));

  const projectPath = path.join(process.cwd(), projectName);

  try {
    mkdirSync(projectPath);

    const serverPath = path.join(projectPath, "server");
    mkdirSync(serverPath);

    writeFileSync(
      path.join(serverPath, "server.js"),
      `const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Welcome to the MERN Stack server!');
});

app.listen(port, () => {
  console.log(\`Server is running on http://localhost:\${port}\`);
});`
    );

    const { selectedPackages } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "selectedPackages",
        message: "Select additional packages to add to the server:",
        choices: ["nodemon", "mongoose", "dotenv", "cors", "bcrypt"],
      },
    ]);

    const dependencies = { express: "^4.17.1" };
    selectedPackages.forEach((pkg) => {
      dependencies[pkg] = "latest";
    });

    const packageJson = {
      name: `${projectName}-server`,
      version: "1.0.0",
      main: "server.js",
      scripts: {
        start: "node server.js",
        dev: selectedPackages.includes("nodemon")
          ? "nodemon server.js"
          : "node server.js",
      },
      dependencies,
    };

    writeFileSync(
      path.join(serverPath, "package.json"),
      JSON.stringify(packageJson, null, 2)
    );

    console.log(chalk.green("\nInstalling server dependencies...\n"));
    execSync("npm install", { cwd: serverPath, stdio: "inherit" });

    console.log(chalk.green("\nCreating React frontend...\n"));
    exec(
      `npx create-react-app client`,
      { cwd: projectPath },
      (err, stdout, stderr) => {
        if (err) {
          console.error(chalk.red(`Error creating React app: ${err.message}`));
          return;
        }

        console.log(chalk.blue(`\n${stdout}`));
        console.log(
          chalk.bold.green(
            `\nMERN Stack project ${projectName} created successfully! 🚀`
          )
        );

        console.log(
          chalk.yellow(`\nNavigate to your project with: cd ${projectName}`)
        );
        console.log(
          chalk.bold.cyan(`\nAll selected packages have been installed! 🛠️`)
        );
      }
    );
  } catch (error) {
    console.error(chalk.red(`Error creating project: ${error.message}`));
  }
};

const createNodeProject = (projectName) => {
  console.log(chalk.green(`Creating Node.js project: ${projectName}\n`));

  const projectPath = path.join(process.cwd(), projectName);

  try {
    mkdirSync(projectPath);

    writeFileSync(
      path.join(projectPath, "server.js"),
      `const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Welcome to the Node.js server!');
});

app.listen(port, () => {
  console.log(\`Server is running on http://localhost:\${port}\`);
});`
    );

    const packageJson = {
      name: projectName,
      version: "1.0.0",
      main: "server.js",
      scripts: {
        start: "node server.js",
        dev: "nodemon server.js",
      },
      dependencies: {
        express: "^4.17.1",
      },
    };

    writeFileSync(
      path.join(projectPath, "package.json"),
      JSON.stringify(packageJson, null, 2)
    );

    console.log(chalk.green("\nInstalling dependencies...\n"));
    execSync("npm install", { cwd: projectPath, stdio: "inherit" });

    console.log(
      chalk.bold.green(
        `\nNode.js project ${projectName} created successfully! 🚀`
      )
    );
    console.log(
      chalk.yellow(`\nDon't forget to run the server with: npm start`)
    );
  } catch (error) {
    console.error(chalk.red(`Error creating project: ${error.message}`));
  }
};

const createVanillaProject = (projectName) => {
  console.log(
    chalk.green(`Creating Vanilla JavaScript project: ${projectName}\n`)
  );

  const projectPath = path.join(process.cwd(), projectName);

  try {
    mkdirSync(projectPath);
    writeFileSync(
      path.join(projectPath, "index.html"),
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Welcome to ${projectName}!</h1>
  <script src="app.js"></script>
</body>
</html>`
    );

    writeFileSync(
      path.join(projectPath, "style.css"),
      `body {
  font-family: Arial, sans-serif;
  text-align: center;
  padding: 50px;
}
h1 {
  color: #333;
}`
    );

    writeFileSync(
      path.join(projectPath, "app.js"),
      `console.log('Welcome to ${projectName}!');`
    );

    console.log(
      chalk.green(`\nVanilla project ${projectName} created successfully! 🚀`)
    );
  } catch (error) {
    console.error(chalk.red(`Error creating project: ${error.message}`));
  }
};

mainMenu();
