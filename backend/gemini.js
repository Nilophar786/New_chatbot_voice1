import axios from "axios"
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// Predefined commands for Windows system operations with executable commands
const predefinedCommands = {
  "open notepad": {
    type: "general",
    userInput: "open notepad",
    response: "Opening Notepad",
    executable: "notepad.exe"
  },
  "open calculator": {
    type: "calculator-open",
    userInput: "open calculator",
    response: "Opening Calculator",
    executable: "calc.exe"
  },
  "open command prompt": {
    type: "general",
    userInput: "open command prompt",
    response: "Opening Command Prompt",
    executable: "cmd.exe"
  },
  "open powershell": {
    type: "general",
    userInput: "open powershell",
    response: "Opening PowerShell",
    executable: "powershell.exe"
  },
  "open task manager": {
    type: "general",
    userInput: "open task manager",
    response: "Opening Task Manager",
    executable: "taskmgr.exe"
  },
  "open control panel": {
    type: "general",
    userInput: "open control panel",
    response: "Opening Control Panel",
    executable: "control.exe"
  },
  "open file explorer": {
    type: "general",
    userInput: "open file explorer",
    response: "Opening File Explorer",
    executable: "explorer.exe"
  },
  "open paint": {
    type: "general",
    userInput: "open paint",
    response: "Opening Paint",
    executable: "mspaint.exe"
  },
  "open wordpad": {
    type: "general",
    userInput: "open wordpad",
    response: "Opening WordPad",
    executable: "write.exe"
  },
  "open snipping tool": {
    type: "general",
    userInput: "open snipping tool",
    response: "Opening Snipping Tool",
    executable: "SnippingTool.exe"
  },
  "open magnifier": {
    type: "general",
    userInput: "open magnifier",
    response: "Opening Magnifier",
    executable: "Magnify.exe"
  },
  "open narrator": {
    type: "general",
    userInput: "open narrator",
    response: "Opening Narrator",
    executable: "Narrator.exe"
  },
  "open onscreen keyboard": {
    type: "general",
    userInput: "open onscreen keyboard",
    response: "Opening On-Screen Keyboard",
    executable: "osk.exe"
  },
  "open sticky notes": {
    type: "general",
    userInput: "open sticky notes",
    response: "Opening Sticky Notes",
    executable: "StikyNot.exe"
  },
  "open character map": {
    type: "general",
    userInput: "open character map",
    response: "Opening Character Map",
    executable: "charmap.exe"
  },
  "open disk cleanup": {
    type: "general",
    userInput: "open disk cleanup",
    response: "Opening Disk Cleanup",
    executable: "cleanmgr.exe"
  },
  "open system restore": {
    type: "general",
    userInput: "open system restore",
    response: "Opening System Restore",
    executable: "rstrui.exe"
  },
  "open device manager": {
    type: "general",
    userInput: "open device manager",
    response: "Opening Device Manager",
    executable: "devmgmt.msc"
  },
  "open disk management": {
    type: "general",
    userInput: "open disk management",
    response: "Opening Disk Management",
    executable: "diskmgmt.msc"
  },
  "open services": {
    type: "general",
    userInput: "open services",
    response: "Opening Windows Services",
    executable: "services.msc"
  },
  "open event viewer": {
    type: "general",
    userInput: "open event viewer",
    response: "Opening Event Viewer",
    executable: "eventvwr.msc"
  },
  "open performance monitor": {
    type: "general",
    userInput: "open performance monitor",
    response: "Opening Performance Monitor",
    executable: "perfmon.msc"
  },
  "open resource monitor": {
    type: "general",
    userInput: "open resource monitor",
    response: "Opening Resource Monitor",
    executable: "resmon.exe"
  },
  "open task scheduler": {
    type: "general",
    userInput: "open task scheduler",
    response: "Opening Task Scheduler",
    executable: "taskschd.msc"
  },
  "open registry editor": {
    type: "general",
    userInput: "open registry editor",
    response: "Opening Registry Editor",
    executable: "regedit.exe"
  },
  "open msconfig": {
    type: "general",
    userInput: "open msconfig",
    response: "Opening System Configuration",
    executable: "msconfig.exe"
  },
  "open system information": {
    type: "general",
    userInput: "open system information",
    response: "Opening System Information",
    executable: "msinfo32.exe"
  },
  "open system properties": {
    type: "general",
    userInput: "open system properties",
    response: "Opening System Properties",
    executable: "sysdm.cpl"
  },
  "open power options": {
    type: "general",
    userInput: "open power options",
    response: "Opening Power Options",
    executable: "powercfg.cpl"
  },
  "open network connections": {
    type: "general",
    userInput: "open network connections",
    response: "Opening Network Connections",
    executable: "ncpa.cpl"
  },
  "open sound settings": {
    type: "general",
    userInput: "open sound settings",
    response: "Opening Sound settings",
    executable: "mmsys.cpl"
  },
  "open display settings": {
    type: "general",
    userInput: "open display settings",
    response: "Opening Display settings",
    executable: "desk.cpl"
  },
  "open mouse settings": {
    type: "general",
    userInput: "open mouse settings",
    response: "Opening Mouse settings",
    executable: "main.cpl"
  },
  "open keyboard settings": {
    type: "general",
    userInput: "open keyboard settings",
    response: "Opening Keyboard settings",
    executable: "control keyboard"
  },
  "open date and time settings": {
    type: "general",
    userInput: "open date and time settings",
    response: "Opening Date and Time settings",
    executable: "timedate.cpl"
  },
  "open region settings": {
    type: "general",
    userInput: "open region settings",
    response: "Opening Region settings",
    executable: "intl.cpl"
  },
  "open firewall settings": {
    type: "general",
    userInput: "open firewall settings",
    response: "Opening Firewall settings",
    executable: "firewall.cpl"
  },
  "open windows defender": {
    type: "general",
    userInput: "open windows defender",
    response: "Opening Windows Defender",
    executable: "windowsdefender:"
  },
  "open recycle bin": {
    type: "general",
    userInput: "open recycle bin",
    response: "Opening Recycle Bin",
    executable: "shell:RecycleBinFolder"
  },
  "empty recycle bin": {
    type: "general",
    userInput: "empty recycle bin",
    response: "Emptying Recycle Bin",
    executable: "rd /s /q %systemdrive%\\$Recycle.Bin"
  },
  "shutdown pc": {
    type: "general",
    userInput: "shutdown pc",
    response: "Shutting down your computer",
    executable: "shutdown /s /t 0"
  },
  "restart pc": {
    type: "general",
    userInput: "restart pc",
    response: "Restarting your computer",
    executable: "shutdown /r /t 0"
  },
  "lock pc": {
    type: "general",
    userInput: "lock pc",
    response: "Locking your computer",
    executable: "rundll32.exe user32.dll,LockWorkStation"
  },
  "sleep pc": {
    type: "general",
    userInput: "sleep pc",
    response: "Putting your computer to sleep",
    executable: "rundll32.exe powrprof.dll,SetSuspendState 0,1,0"
  },
  "hibernate pc": {
    type: "general",
    userInput: "hibernate pc",
    response: "Hibernating your computer",
    executable: "shutdown /h"
  },
  "sign out": {
    type: "general",
    userInput: "sign out",
    response: "Signing out",
    executable: "shutdown /l"
  },
  "check ip address": {
    type: "general",
    userInput: "check ip address",
    response: "Fetching your IP address",
    executable: "ipconfig"
  },
  "ping google": {
    type: "general",
    userInput: "ping google",
    response: "Pinging Google",
    executable: "ping google.com"
  },
  "flush dns": {
    type: "general",
    userInput: "flush dns",
    response: "Flushing DNS cache",
    executable: "ipconfig /flushdns"
  },
  "check system info": {
    type: "general",
    userInput: "check system info",
    response: "Showing system information",
    executable: "systeminfo"
  },
  "check windows version": {
    type: "general",
    userInput: "check windows version",
    response: "Checking Windows version",
    executable: "ver"
  },
  "open run dialog": {
    type: "general",
    userInput: "open run dialog",
    response: "Opening Run dialog",
    executable: "start run"
  },
  "open downloads folder": {
    type: "general",
    userInput: "open downloads folder",
    response: "Opening Downloads folder",
    executable: "shell:Downloads"
  },
  "open desktop folder": {
    type: "general",
    userInput: "open desktop folder",
    response: "Opening Desktop folder",
    executable: "shell:Desktop"
  },
  "open documents folder": {
    type: "general",
    userInput: "open documents folder",
    response: "Opening Documents folder",
    executable: "shell:Personal"
  },
  "open pictures folder": {
    type: "general",
    userInput: "open pictures folder",
    response: "Opening Pictures folder",
    executable: "shell:My Pictures"
  },
  "open videos folder": {
    type: "general",
    userInput: "open videos folder",
    response: "Opening Videos folder",
    executable: "shell:My Video"
  },
  "open music folder": {
    type: "general",
    userInput: "open music folder",
    response: "Opening Music folder",
    executable: "shell:My Music"
  }
};

const geminiResponse=async (command,assistantName,userName)=>{
try {
    // Check if the command matches any predefined command
    const normalizedCommand = command.toLowerCase().trim();
    if (predefinedCommands[normalizedCommand]) {
        const predefinedResponse = predefinedCommands[normalizedCommand];

        // Execute the Windows command
        try {
            console.log(`Executing command: ${predefinedResponse.executable}`);
            await execAsync(predefinedResponse.executable);
            console.log(`Successfully executed: ${predefinedResponse.executable}`);
        } catch (execError) {
            console.error(`Failed to execute command: ${predefinedResponse.executable}`, execError);
            // Continue with response even if execution fails
        }

        return JSON.stringify({
            type: predefinedResponse.type,
            userInput: predefinedResponse.userInput,
            response: predefinedResponse.response
        });
    }

    let apiUrl = process.env.GEMINI_API_URL;

    if (!apiUrl) {
        throw new Error("GEMINI_API_URL is not defined in environment variables");
    }

    // If the URL doesn't contain the full API endpoint, construct it
    if (!apiUrl.includes('generativelanguage.googleapis.com')) {
        // Extract API key from the URL if it's in key= format
        const apiKey = apiUrl.includes('key=') ? apiUrl.split('key=')[1] : apiUrl;
        apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    }

    // Final validation
    if (!apiUrl || !apiUrl.includes('key=')) {
        throw new Error("Invalid GEMINI_API_URL format. Please check your .env file configuration.");
    }
    const prompt = `You are a virtual assistant named ${assistantName} created by ${userName}. 
You are not Google. You will now behave like a voice-enabled assistant.

Your task is to understand the user's natural language input and respond with a JSON object like this:

{
  "type": "general" | "google-search" | "youtube-search" | "youtube-play" | "youtube-open" | "get-time" | "get-date" | "get-day" | "get-month"|"calculator-open" | "instagram-open" |"facebook-open" |"weather-show" | "google-open"
  ,
  "userInput": "<original user input>" {only remove your name from userinput if exists} and agar kisi ne google ya youtube pe kuch search karne ko bola hai to userInput me only bo search baala text jaye,

  "response": "<a short spoken response to read out loud to the user>"
}

Instructions:
- "type": determine the intent of the user.
- "userinput": original sentence the user spoke.
- "response": A short voice-friendly reply, e.g., "Sure, playing it now", "Here's what I found", "Today is Tuesday", etc.

Type meanings:
- "general": if it's a factual or informational question. aur agar koi aisa question puchta hai jiska answer tume pata hai usko bhi general ki category me rakho bas short answer dena
- "google-search": if user wants to search something on Google .
- "youtube-search": if user wants to search something on YouTube.
- "youtube-play": if user wants to directly play a video or song.
- "youtube-open": if user wants to open YouTube homepage.
- "google-open": if user wants to open Google homepage.
- "calculator-open": if user wants to  open a calculator .
- "instagram-open": if user wants to  open instagram .
- "facebook-open": if user wants to open facebook.
-"weather-show": if user wants to know weather
- "get-time": if user asks for current time.
- "get-date": if user asks for today's date.
- "get-day": if user asks what day it is.
- "get-month": if user asks for the current month.

Important:
- Use ${userName} agar koi puche tume kisne banaya 
- Only respond with the JSON object, nothing else.


now your userInput- ${command}
`;


    const result=await axios.post(apiUrl,{
    "contents": [{
    "parts":[{"text": prompt}]
    }]
    })
    if (!result.data || !result.data.candidates || result.data.candidates.length === 0) {
        throw new Error("No candidates returned from Gemini API");
    }
    if (!result.data.candidates[0].content || !result.data.candidates[0].content.parts || result.data.candidates[0].content.parts.length === 0) {
        throw new Error("No content parts returned from Gemini API");
    }
    return result.data.candidates[0].content.parts[0].text;
} catch (error) {
    console.error("geminiResponse error:", error);
    throw error;
}
}

export default geminiResponse