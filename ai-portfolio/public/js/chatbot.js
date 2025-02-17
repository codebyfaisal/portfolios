const botContainer = document.querySelector(".chatbot-container");
const chatbot = botContainer.querySelector(".chatbot");
const chatbotBtn = botContainer.querySelector(".chatbot-btn");
const botChatbox = chatbot.querySelector(".chatbox");
const botForm = chatbot.querySelector(".chatbot-container .user-msg");
const sendBtn = document.getElementById("send-btn");
const userMessage = document.getElementById("user-msg");

{
  /*
<div class="chat-msg bot">
  <div class="icon">
    <img src="./icons/agent.svg" alt="agent icon" />
  </div>
  <p class="chat-text">Hi! How I can assist you today.😊</p>
</div>
<div class="chat-msg user">
  <div class="icon">
    <img src="./icons/user.svg" alt="user icon" />
  </div>
  <p class="chat-text">Hi! What's your name.</p>
</div> */
}

const scrollToBottom = () => {
  botChatbox.scrollTo({
    top: botChatbox.scrollHeight,
    behavior: "smooth",
  });
};

// function for create div message
const createDiv = (_class, _msg) => {
  const div_chatMsg = document.createElement("div");
  const div_icon = document.createElement("div");
  const img_icon = document.createElement("img");
  const p_chatText = document.createElement("p");

  div_chatMsg.appendChild(div_icon);
  div_chatMsg.appendChild(p_chatText);

  if (_class === "bot") {
    div_icon.appendChild(img_icon);
    img_icon.src = "./icons/bot.svg";
    img_icon.alt = "ai bot icon";
    div_icon.setAttribute("class", "icon");
  }

  div_chatMsg.setAttribute("class", "chat-msg " + _class);
  p_chatText.setAttribute("class", "chat-text");
  p_chatText.innerText = _msg;

  return div_chatMsg;
};

const fetchResponse = async (message) => {
  // create div_chatMsg for bot
  const div_chatMsg = createDiv("bot", "  ");
  div_chatMsg.classList.add("chat-loading");
  botChatbox.appendChild(div_chatMsg);
  scrollToBottom();  

  // make api call
  try {
    const response = await fetch("/.netlify/functions/app", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    // throw if error
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    // show response
    div_chatMsg.querySelector(".chat-text").innerHTML = data.response;
  } catch (error) {
    console.error("Error:", error);

    // show error
    div_chatMsg.querySelector(".chat-text").innerText =
      "I apologize, I'm having trouble connecting right now. Please try again later.";
  } finally {
    // remove loading
    div_chatMsg.classList.remove("chat-loading");
    scrollToBottom();
  }
};

botForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (userMessage.value === "") {
    userMessage.style.boxShadow = "0 0 0 1px red";
    userMessage.placeholder = "Please type message";
    return;
  }
  sendBtn.children[0].src = "./icons/loader.svg";

  // create div_chatMsg for bot
  const div_chatMsg = createDiv("user", userMessage.value);
  botChatbox.appendChild(div_chatMsg);
  scrollToBottom();

  await fetchResponse(userMessage.value);

  userMessage.value = "";
  sendBtn.children[0].src = "./icons/send.svg";
});

// eventlistner for closing and opening bot
chatbotBtn.addEventListener("click", () => {
  if (chatbot.classList.contains("close")) {
    chatbot.classList.remove("close");
    chatbotBtn.children[0].src = "./icons/close.svg";
    chatbotBtn.style.transform = "rotate(90deg)";
  } else {
    chatbot.classList.add("close");
    chatbotBtn.style.transform = "";
    setTimeout(() => {
      chatbotBtn.children[0].src = "./icons/message.svg";
    }, 150);
  }
});

userMessage.addEventListener("input", () => {
  userMessage.style.boxShadow = "";
  userMessage.placeholder = "Ask!";
});
