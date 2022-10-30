import { io } from "socket.io-client";
import "./style.css";

const container = document.querySelector(".message-container");
const form = document.querySelector(".form-container");
const input = document.querySelector(".input-message");

let name = prompt("Enter your name");
if (!name) name = "Anonymous";
const socket = io("http://localhost:5000");

socket.on("connect", () => {
  displayMessage("You joined");
  socket.emit("new-user", name);
});

socket.on("user-connected", (name) => {
  displayMessage(`${name} joined`);
});

socket.on("chat-message", (data) => {
  displayMessage(`${data.name}: ${data.message}`);
});

socket.on("user-disconnected", (name) => {
  displayMessage(`${name} disconnected`);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = input.value;
  displayMessage(`You: ${message}`);
  socket.emit("send-chat-message", message);

  input.value = "";
});

function displayMessage(message) {
  const div = document.createElement("div");
  div.textContent = message;
  container.appendChild(div);
}
