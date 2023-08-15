let recognition;
let lang = 'en-US';

function setLang(text){
    lang = text;
}
function showLang() {
    var langMenu = document.getElementById("LangBtn");
        
    if (langMenu.style.display === "none") {
        langMenu.style.display = "block";
    } else {
        langMenu.style.display = "none";
    }
}

function sprecog() {
    if (!recognition) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.onresult = handleSpeechResult;
        recognition.onerror = handleRecognitionError;
        recognition.onend = handleRecognitionEnd;
        }

    if (recognition && recognition.isStarted) {
        recognition.stop();
        console.log("Stop Speech Recognition");
    } else {
        recognition.lang = lang;
        
        recognition.start();
        console.log("Start Speech Recognition");
        document.getElementById("sendbtn").disabled = true;
    }
}
function handleSpeechResult(event) {
    const transcript = event.results[0][0].transcript;
    console.log(`You said: ${transcript}`);
    speakText(transcript);
    chatWithBot(transcript); // Call the chatbot function with the recognized transcript
}

function handleRecognitionError(event) {
    console.error('Recognition error:', event.error);
}

function handleRecognitionEnd() {
    console.log('Recognition ended');
    document.getElementById("sendbtn").disabled=false;
}

const apiKey = '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'; // Replace with your OpenAI API key
const model = "gpt-3.5-turbo"; // Change this to your desired model, if needed

async function chatWithBot(transcript) {
    try {
        const messages = [
            { role: "system", content: "you are BRYAN or Brilliantly Responsive, Yet Attentive Navigational Artificial Intelligence, an assistant to assist on general tasks with short responses. Tell everyone you are good when they ask you how are you, talk very much like a human. give SHORT RESPONSES, 1-2 lines. WHEN YOU NEED TO OPEN LINKS, PROVIDE THE LINKS WITHIN ` LIKE `https://link.com`. say, 'opening', then the website, then the link, nothing else" },
            { role: "user", content: transcript },
        ];

        const temperature = 1.8;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                messages,
                temperature,
            }),
        });

        if (!response.ok) {
            console.error("Failed to get chatbot response.");
            return;
        }

        const data = await response.json();
        const botReply = data.choices[0].message.content;

        if(botReply.match((/`([^`]+)`/) || []))[1];
        console.log()

        console.log("Bot's reply:", botReply);

        // Append the bot's reply to the message area
        // Add your code here to display the bot's reply

        // Speak the bot's reply
        speakText(botReply);
    } catch (error) {
        console.error("Error while interacting with the chatbot:", error);
    }
}

function speakText(text) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.volume = 10;
    speech.rate = 1.3;
    speech.pitch = 200;
    window.speechSynthesis.speak(speech);
}