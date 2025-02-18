import React from "react";
import ChatBot from "react-chatbotify";

export default function Chatbot() {
  const helpOptions = [
    "Our Products",
    "Rewards & Points",
    "Reservation",
    "Orders",
    "What do we offer?",
  ];
  const productOptions = [
    "Our Store",
    "Most Popular Dish",
    "Most Popular Dish Category",
    "Others",
  ];
  const rewardOptions = [
    "Rewards & Points Guide",
    "How to earn points?",
    "What are the type of rewards I can get?",
    "Where can I see the rewards I have?",
    "Membership",
    "Others",
  ];
  const reserveOptions = [
    "Make a Reservation Now",
    "How to view my reservation?",
    "How to edit my upcoming reservations?",
    "Others",
  ];
  const orderOptions = [
    "Where to view my orders?",
    "What are the accepted payment methods?",
    "What are the types of services?",
    "How long will my order be ready?",
    "Others",
  ];
  const aboutOptions = ["Others"];

  // const themes = [
  //   {id: "minimal_midnight", version: "0.1.0"},
  //   {id: "simple_blue", version: "0.1.0"}
  // ]

  const flow = {
    start: {
      message:
        "Hi I am Tan Jin, Welcome to Vegeatery 🥳 \n How may I assist you today?",
      options: helpOptions,
      path: "process_options",
    },
    followup: {
      message: "What else can I assist you today?",
      options: helpOptions,
      path: "process_options",
    },
    process_options: {
      transition: { duration: 0 },
      chatDisabled: false,
      path: async (params) => {
        let link = "";
        let path = "";
        switch (params.userInput) {
          // Products
          case "Our Products":
            path = "ourProducts";
            break;
          case "Our Store":
            link = "/user/store";
            break;
          case "Most Popular Dish":
            path = "popularDish";
            break;
          case "Most Popular Dish Category":
            path = "popularCategory";
            break;
          // Rewards
          case "Rewards & Points":
            path = "rewardsPoints";
            break;
          case "Rewards & Points Guide":
            link = "/rewards";
            break;
          case "How to view my points & my current membership tier?":
            link = "/user/rewards";
            break;
          case "How to earn points?":
            path = "earnPoints";
            break;
          case "What are the type of rewards I can get?":
            path = "rewardTypes";
            break;
          case "Where can I see the rewards I have?":
            link = "/user/rewards";
            break;
          case "Membership":
            path = "membership";
            break;
          // Reservations
          case "Reservation":
            path = "reserve";
            break;
          case "Make a Reservation Now":
            link = "/reserve";
            break;
          case "How to view my reservation?":
            link = "/user/reservations";
            break;
          case "How to edit my upcoming reservations?":
            path = "scheduleReserve";
            break;
          // Orders
          case "Orders":
            path = "order";
            break;
          case "Where to view my orders?":
            link = "/user/orders";
            break;
          case "What are the accepted payment methods?":
            path = "paymentMethods";
            break;
          case "What are the types of services?":
            path = "serviceTypes";
            break;
          case "How long will my order be ready?":
            path = "orderReady";
            break;
          // About Us
          case "What do we offer?":
            path = "aboutUs";
            break;
          case "Others":
            path = "followup";
            break;
          default:
            return "unknown_input";
        }
        if (link) {
          await params.injectMessage("Sit tight! I'll send you right there!");
          setTimeout(() => {
            window.open(link);
          }, 1000);
          return "repeat"; // Keep user on same path after external link
        }

        // If transitioning to another flow path
        return path; // Return the new path to transition
      },
    },
    // Products
    ourProducts: {
      message:
        "We offer vegan and vegeaterian based meal dishes. Made with love, care and consideration for meeting our customers need as the priority! 🥰",
      options: productOptions,
      path: "process_options",
    },
    popularDish: {
      message:
        "The most popular dish at the moment is the Bolognese Pasta! 🍝 I recommend you to give it a try, its really really good! 🤩",
      options: productOptions,
      path: "process_options",
    },
    popularCategory: {
      message:
        "The most popular dish category is got to be our Signature dishs! 🧑‍🍳 They are really our Signatures! 😉",
      options: productOptions,
      path: "process_options",
    },
    // Rewards
    rewardsPoints: {
      message:
        "By ordering dishes, leaving reviews and giving feedback you can earn points to gain rewards to be used in your next order! 🌟",
      options: rewardOptions,
      path: "process_options",
    },
    earnPoints: {
      message:
        "By ordering more, you can earn even more! Every review you leave for your past order will allow you to earn points too! Start getting those points and treat yourself to the next meal! 😉",
      options: rewardOptions,
      path: "process_options",
    },
    rewardTypes: {
      message:
        "We offer a range of discount vouchers and other vouchers to be used in your next order! 😉",
      options: rewardOptions,
      path: "process_options",
    },
    membership: {
      message:
        "There are 3 membership tiers, Bronze, Sliver & Gold. Each time you tier up, you get access to more rewards for your use! 🎁",
      options: rewardOptions,
      path: "process_options",
    },
    // Reservations
    reserve: {
      message:
        "Come dine with us at Vegeatery! We warmly welcome you to our lovely eatery 🥰",
      options: reserveOptions,
      path: "process_options",
    },
    scheduleReserve: {
      message:
        "Go to the My Rservation in the user overview page and your can edit your reseravtions from there! 😉",
      options: reserveOptions,
      path: "process_options",
    },
    // Orders
    order: {
      message:
        "Want to know more about the ordering processes of Vegeatery? 🌟",
      options: orderOptions,
      path: "process_options",
    },
    paymentMethods: {
      message: "At the moment, we only accpet card payments! 💳",
      options: orderOptions,
      path: "process_options",
    },
    serviceTypes: {
      message:
        "We offer pick-up and delivery for all orders! It is up to your preference! 😉",
      options: orderOptions,
      path: "process_options",
    },
    orderReady: {
      message:
        "Once an order have been placed, we will take around 3 to 5 days to prepare your delicious meal for you! 🥰",
      options: orderOptions,
      path: "process_options",
    },
    // About Us
    aboutUs: {
      message:
        "We offer vegan and vegeaterian based meal dishes. Made with love, care and consideration for meeting our customers need as the priority! 🥰",
      options: aboutOptions,
      path: "process_options",
    },
    unknown_input: {
      message: "Sorry, I do not understand your message 😢!",
      options: helpOptions,
      path: "process_options",
    },
    one: {
      message: (params) => `Hi ${params.userInput}!`,
      chatDisabled: false,
    },
    two: {
      message: (params) => `Hi ${params.userInput}!`,
      chatDisabled: false,
    },
    end: {
      message: (params) => `Hi ${params.userInput}!`,
      chatDisabled: false,
    },
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ChatBot flow={flow} />
    </div>
  );
}
