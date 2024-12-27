import express from "express";
import { db, Camp, SignUp, Member } from "./db.js";
import cors from "cors";
import config from "./config.json" assert { type: "json" };
import { EmbedBuilder, WebhookClient } from "discord.js";
import Stripe from "stripe";

const app = express();
const stripe = new Stripe(
  "stripekey"
);
const PORT = 3000;

app.use(cors());

app.use(express.json());
app.use("/static", express.static("public"));

app.get("/api/camps", async (req, res) => {
  try {
    const camps = await Camp.findAll();

    res.status(200).send({
      camps: camps.map((camp) => ({
        id: camp.id,
        name: camp.name,
        description: camp.description,
        location: camp.location,
        date: camp.date,
      })),
    });
  } catch (error) {
    res.status(500).send({
      message: "An error occurred",
    });
  }
});

app.get("/api/team", async (req, res) => {
  try {
    const members = await Member.findAll();

    res.status(200).send({
      members: members.map((member) => ({
        name: member.name,
        bio: member.bio,
        position: member.position,
        image: member.image,
      })),
    });
  } catch (error) {
    res.status(500).send({
      message: "An error occurred",
    });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const { firstName, lastName, email, campId } = req.body;

    if (!firstName || !lastName || !email || !campId) {
      res.status(418).send({
        message: "Please fill out all fields.",
        success: false,
      });
      return;
    }

    const user = await SignUp.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      res.status(409).send({
        message: "That email already exists.",
        success: false,
      });
      return;
    }

    SignUp.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      CampId: campId,
    });

    res
      .status(200)
      .send({ message: "Success! You're all registered.", success: true });
  } catch (error) {
    res.status(500).send({
      message: "An error occurred",
      success: false,
    });
  }
});

app.post("/api/signups", async (req, res) => {
  try {
    const { key } = req.body;
    if (key != config.key) {
      res.status(401).send({
        message: "Not authorized",
      });
      return;
    }

    const signups = await SignUp.findAll({
      attributes: ["firstName", "lastName", "email"],
      include: [
        {
          model: Camp,
          attributes: ["name"],
          required: false,
        },
      ],
    });

    res.status(200).send({
      signups: signups.map((signup) => ({
        firstName: signup.firstName,
        lastName: signup.lastName,
        email: signup.email,
        campName: signup.Camp.name,
      })),
    });
  } catch (error) {
    res.status(500).send({
      message: "An error occurred",
    });
  }
});

app.post("/api/apply", async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;
    const webhookClient = new WebhookClient({
      url: config.webhookUrl,
    });

    const embed = new EmbedBuilder()
      .setTitle("New Application")
      .setDescription(message)
      .addFields(
        { name: "First Name", value: firstName, inline: true },
        { name: "Last Name", value: lastName, inline: true },
        { name: "Email", value: `${email}` }
      )
      .setColor(0x14c414);

    webhookClient.send({
      username: "Soccer For Change",
      embeds: [embed],
    });

    res.status(200).send({
      message: "Your application was successfully sent for review!",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "An error occurred",
      success: false,
    });
  }
});

app.post("/create-intent", async (req, res) => {
  try {
    const { email } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000,
      currency: "usd",
      receipt_email: email,
      payment_method_types: ["card"],
    });
    res.json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
