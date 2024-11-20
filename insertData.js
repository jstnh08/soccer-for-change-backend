import { Camp, Member } from "./db.js";

// await Member.create({
//   name: "Vedanth Rao",
//   position: "Soccer Coach",
//   bio: "Vedanth is a soccer player with 6 years of premier soccer experience, 2 years of select soccer experience and current soccer player at Interlake High School, he has a passion for serving the community and loves working with kids!",
//   image: "/static/vedu.png",
// });

await Member.destroy({
  where: {
    name: "Adel Dekhani",
  },
});

await Member.create({
  name: "Adel Dekhani",
  position: "Class Coordinator",
  bio: "Adel is a high schooler with a passion for fitness, with over 2 years of teaching experience with Bellevue Ski School, he has extensive experience working with kids and understands how to create an environment where their skills can flourish.",
  image: "/static/adel.jpg",
});

// await Camp.create({
//   name: "Soccer Coaching Camp",
//   description:
//     "Sign up your child for a 1 week soccer camp this summer! They will advance their skills and bond with their peers as they complete several practice activities meant for kids of all skill levels! All classes are taught by current high school soccer players with coaching experience.",
//   location: "Clyde Hill Elementary",
//   date: null,
// });
