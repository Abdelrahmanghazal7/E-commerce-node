import express from "express";
import { initApp } from "./src/initApp.js";

const app = express();
// app.use("case sensitive routing", true)
initApp(app, express)