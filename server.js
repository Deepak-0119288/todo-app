const http = require("http");
const fs = require("fs");
const path = require("path");

let gmail;

function readFile(filePath, contentType, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {  
      res.writeHead(500);
      res.end("Error reading file");
    } else {
      res.writeHead(200, { "Content-Type": contentType });  
      res.end(data);
    }
  });  
}  
      
function handleRequest(req, res) {
  console.log("Received request for URL:", req.url);
  const url = req.url.split("?")[0];

  if (req.method === "GET") {
    if (url === "/") {
      readFile(path.join(__dirname, "index.html"), "text/html", res);
    } else if (url === "/style.css") {
      readFile(path.join(__dirname, "style.css"), "text/css", res);
    } else if (url === "/script.js") {
      readFile(path.join(__dirname, "script.js"), "application/javascript", res);
    } else if (url === "/todo.html") {
      readFile(path.join(__dirname, "todo.html"), "text/html", res);
    } else if (url === "/todo.css") {
      readFile(path.join(__dirname, "todo.css"), "text/css", res);
    } else if (url === "/todo.js") {
      readFile(path.join(__dirname, "todo.js"), "application/javascript", res);
    } else if (url === "/getEmail") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(gmail || "No email available");
    } else if (url === "/getUserTasks") {
      const email = new URLSearchParams(req.url.split("?")[1]).get("email");
      getUserTasks(email, res);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  } 
  else if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const { action, name, password, email } = JSON.parse(body);
      if (action === "signup") {
        saveSignUpDetails(name, password, email, res);
      } else if (action === "signin") {
        verifyLoginDetails(email, password, res);
      } else if (action === "saveTasks") {
        const { gmail, tasks } = JSON.parse(body);
        saveUserTasks(gmail, tasks, res);
      } else {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Invalid action");
      }
    });
  } else {
    res.writeHead(405, { "Content-Type": "text/plain" });
    res.end("Method not allowed");
  }
}

function saveSignUpDetails(name, password, email, res) {
  const userDetails = { name, password, email };
  fs.readFile("signup.json", "utf8", (err, data) => {
    let users = [];
    if (!err && data) {
      users = JSON.parse(data);
    }

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("User already exists");
      return;
    }

    users.push(userDetails);

    fs.writeFile("signup.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error saving sign-up details");
      } else {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Sign-up successful");
      }
    });
  });
}

function verifyLoginDetails(email, password, res) {
  fs.readFile("signup.json", "utf8", (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error reading user data");
      return;
    }

    const users = JSON.parse(data);
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      gmail = email;
      const redirectUrl = `/todo.html`;
      console.log("Redirecting to:", redirectUrl);
      res.writeHead(302, { Location: redirectUrl });
      res.end();
    } else {
      res.writeHead(401, { "Content-Type": "text/plain" });
      res.end("Invalid Credentials !!!");
    }
  });
}

function saveUserTasks(email, tasks, res) {
  fs.readFile("signup.json", "utf8", (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error reading user data");
      return;
    }

    let users = JSON.parse(data);
    const userIndex = users.findIndex((user) => user.email === email);
    if (userIndex !== -1) {
      users[userIndex].tasks = tasks;
      fs.writeFile("signup.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Error saving tasks");
        } else {
          res.writeHead(200, { "Content-Type": "text/plain" });
          res.end("Tasks saved successfully");
        }
      });
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("User not found");
    }
  });
}

function getUserTasks(email, res) {
  fs.readFile("signup.json", "utf8", (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error reading user data");
      return;
    }

    const users = JSON.parse(data);
    const user = users.find((user) => user.email === email);

    if (user) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ tasks: user.tasks || [] }));
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("User not found");
    }
  });
}

const server = http.createServer(handleRequest);
const port = 4700;
server.listen(port, () => {
  console.log("Server is listening on port " + port);
});
