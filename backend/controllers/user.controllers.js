import uploadOnCloudinary from "../config/cloudinary.js"
import geminiResponse from "../gemini.js"
import comprehensiveAssistantResponse from "../comprehensiveAssistant.js"
import User from "../models/user.model.js"
import moment from "moment"
import fs from "fs"
import { exec } from "child_process"
import path from "path"
import os from "os"
import axios from "axios"
 export const getCurrentUser=async (req,res)=>{
    try {
        const userId=req.userId
        const user=await User.findById(userId).select("-password")
        if(!user){
return res.status(404).json({message:"user not found"})
        }

   return res.status(200).json(user)     
    } catch (error) {
       return res.status(400).json({message:"get current user error"}) 
    }
}

export const updateAssistant=async (req,res)=>{
   try {
      const {assistantName,imageUrl,customizationData}=req.body
      let assistantImage;
if(req.file){
   assistantImage=await uploadOnCloudinary(req.file.path)
}else{
   assistantImage=imageUrl
}

const user=await User.findByIdAndUpdate(req.userId,{
   assistantName,assistantImage,customizationData: JSON.parse(customizationData)
},{new:true}).select("-password")
return res.status(200).json(user)


   } catch (error) {
       return res.status(400).json({message:"updateAssistantError user error"})
   }
}



const handleFolderAdd = (folderName, type, userInput, res) => {
  if (!folderName) {
    return res.status(400).json({ response: "Folder name is required." });
  }

  // Clean up folder name by removing common command prefixes
  let cleanFolderName = folderName
    .replace(/^(jarvis\s+)?create\s+/i, '') // Remove "jarvis create" or "create"
    .replace(/^(jarvis\s+)?add\s+/i, '') // Remove "jarvis add" or "add"
    .replace(/\s*folder\.?$/i, '') // Remove "folder" suffix
    .trim();

  // If the cleaned name is empty or just contains common words, try to use the original
  if (!cleanFolderName || cleanFolderName.length < 2) {
    cleanFolderName = folderName;
  }

  try {
    // Use absolute path resolution for consistent behavior
    const absolutePath = path.resolve(cleanFolderName);
    if (!fs.existsSync(absolutePath)) {
      fs.mkdirSync(absolutePath);
      return res.json({
        type,
        userInput,
        response: `Folder '${cleanFolderName}' created successfully at ${absolutePath}`
      });
    } else {
      return res.json({
        type,
        userInput,
        response: `Folder '${cleanFolderName}' already exists at ${absolutePath}`
      });
    }
  } catch (err) {
    console.error("Folder creation error:", err);
    return res.status(500).json({
      response: `Error creating folder '${cleanFolderName}'. ${err.message}`,
      error: err.message
    });
  }
};

const handleFolderDelete = (folderName, type, userInput, res) => {
  if (!folderName) {
    return res.status(400).json({ response: "Folder name is required." });
  }

  // Clean up folder name by removing common command prefixes
  let cleanFolderName = folderName
    .replace(/^(jarvis\s+)?delete\s+/i, '') // Remove "jarvis delete" or "delete"
    .replace(/^(jarvis\s+)?remove\s+/i, '') // Remove "jarvis remove" or "remove"
    .replace(/\s*folder\.?$/i, '') // Remove "folder" suffix
    .trim();

  // If the cleaned name is empty or just contains common words, try to use the original
  if (!cleanFolderName || cleanFolderName.length < 2) {
    cleanFolderName = folderName;
  }

  try {
    // Use absolute path resolution for consistent behavior
    const absolutePath = path.resolve(cleanFolderName);
    if (fs.existsSync(absolutePath)) {
      fs.rmSync(absolutePath, { recursive: true, force: true });
      return res.json({
        type,
        userInput,
        response: `Folder '${cleanFolderName}' deleted successfully from ${absolutePath}`
      });
    } else {
      return res.json({
        type,
        userInput,
        response: `Folder '${cleanFolderName}' does not exist at ${absolutePath}`
      });
    }
  } catch (err) {
    console.error("Folder deletion error:", err);
    return res.status(500).json({
      response: `Error deleting folder '${cleanFolderName}'. ${err.message}`,
      error: err.message
    });
  }
};

const handleFolderOpen = (folderName, type, userInput, res) => {
  if (!folderName) {
    return res.status(400).json({ response: "Folder name is required." });
  }

  // Extract folder name from AI response - handle various response formats
  let cleanFolderName = '';

  // Common folder names that should be recognized
  const commonFolderNames = ['documents', 'downloads', 'desktop', 'pictures', 'music', 'videos', 'onedrive', 'temp'];

  // Check if the response contains any common folder names
  for (const commonName of commonFolderNames) {
    if (folderName.toLowerCase().includes(commonName)) {
      cleanFolderName = commonName;
      break;
    }
  }

  // If no common folder found, try to extract a simple name
  if (!cleanFolderName) {
    // Remove common prefixes and suffixes
    let processedName = folderName
      .replace(/^(open|create|jarvis|please|can you|would you|help me)\s+/i, '')
      .replace(/\s+(folder|directory|please|now|for me)$/i, '')
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .trim();

    // Split into words and find the most likely folder name
    const words = processedName.split(/\s+/);
    for (const word of words) {
      if (word.length >= 2 && word.length <= 20 && /^[a-zA-Z0-9_-]+$/.test(word)) {
        cleanFolderName = word;
        break;
      }
    }
  }

  // If still no valid name, use a timestamp-based name
  if (!cleanFolderName || cleanFolderName.length < 2) {
    cleanFolderName = `folder_${Date.now()}`;
  }

  // Ensure the name is not too long
  if (cleanFolderName.length > 20) {
    cleanFolderName = cleanFolderName.substring(0, 20);
  }

  // Get user's home directory
  const homeDir = os.homedir();

  // Map common folder names to their Windows paths
  const commonFolders = {
    'documents': path.join(homeDir, 'Documents'),
    'downloads': path.join(homeDir, 'Downloads'),
    'desktop': path.join(homeDir, 'Desktop'),
    'pictures': path.join(homeDir, 'Pictures'),
    'music': path.join(homeDir, 'Music'),
    'videos': path.join(homeDir, 'Videos'),
    'onedrive': path.join(homeDir, 'OneDrive'),
    'program files': 'C:\\Program Files',
    'program files x86': 'C:\\Program Files (x86)',
    'windows': 'C:\\Windows',
    'system32': 'C:\\Windows\\System32',
    'temp': process.env.TEMP || 'C:\\Windows\\Temp',
    'c drive': 'C:\\',
    'd drive': 'D:\\',
    'e drive': 'E:\\'
  };

  // Check if it's a common folder name
  const lowerName = cleanFolderName.toLowerCase();
  let targetPath = commonFolders[lowerName] || path.resolve(cleanFolderName);

  try {
    // Create folder if it doesn't exist
    if (!fs.existsSync(targetPath)) {
      try {
        fs.mkdirSync(targetPath, { recursive: true });
        console.log(`Created folder: ${targetPath}`);
      } catch (createError) {
        console.error(`Failed to create folder: ${createError.message}`);
        return res.status(500).json({
          response: `Cannot create folder '${cleanFolderName}': ${createError.message}`,
          error: createError.message
        });
      }
    }

    // Use Windows-specific command for better compatibility
    const command = `explorer.exe "${targetPath}"`;

      // Execute the command with proper error handling
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Folder open error: ${error.message}`);
          // Cannot send response here because headers might have been sent already
          // Log error and return early
          return;
        }
        if (stderr) {
          console.warn(`Folder open warning: ${stderr}`);
        }
        console.log(`Folder opened successfully: ${targetPath}`);
      });

      return res.json({
        type,
        userInput,
        response: `Folder '${cleanFolderName}' opened successfully at ${targetPath}`
      });

  } catch (err) {
    console.error("Folder open error:", err);
    return res.status(500).json({
      response: `Error opening folder '${cleanFolderName}': ${err.message}`,
      error: err.message
    });
  }
};

const handleAppOpen = (appName, type, userInput, res) => {
  if (!appName) {
    return res.status(400).json({ response: "Application name is required." });
  }

  // Extract app name from AI response - handle various response formats
  let cleanAppName = '';

  // Common folder names that should be recognized for universal opening
  const commonFolderNames = ['document', 'documents', 'download', 'downloads', 'desktop', 'pictures', 'music', 'videos', 'onedrive', 'temp'];

  // Check if it's a folder first
  for (const commonFolder of commonFolderNames) {
    if (appName.toLowerCase().includes(commonFolder)) {
      // It's a folder, call handleFolderOpen
      return handleFolderOpen(appName, type, userInput, res);
    }
  }

  // Common app names that should be recognized
  const commonApps = ['notepad', 'calculator', 'paint', 'word', 'excel', 'powerpoint', 'cmd', 'powershell', 'explorer', 'chrome', 'firefox', 'edge', 'google', 'facebook', 'youtube', 'instagram', 'twitter', 'whatsapp', 'gmail', 'outlook', 'github', 'netflix', 'amazon', 'linkedin', 'reddit', 'spotify', 'discord', 'telegram', 'zoom', 'slack', 'notion', 'media player', 'microsoft store', 'clock'];

  // Check if the response contains any common app names
  for (const commonApp of commonApps) {
    if (appName.toLowerCase().includes(commonApp)) {
      cleanAppName = commonApp;
      break;
    }
  }

  // If no common app found, try to extract a simple name
  if (!cleanAppName) {
    // Remove common prefixes and suffixes - expanded list
    let processedName = appName
      .replace(/^(open|jarvis|please|can you|would you|help me|i don't know how to open|certainly|sure|okay|alright)\s+/i, '')
      .replace(/\s+(please|now|for me|for you|right now|immediately|\.|!|\?)$/i, '')
      .replace(/\s+(opening|launching|starting|running)\s+/i, ' ')
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .trim();

    // Split into words and find the most likely app name
    const words = processedName.split(/\s+/);
    for (const word of words) {
      if (word.length >= 2 && word.length <= 20 && /^[a-zA-Z0-9_-]+$/.test(word)) {
        cleanAppName = word.toLowerCase();
        break;
      }
    }
  }

  // If still no valid name, return error
  if (!cleanAppName || cleanAppName.length < 2) {
    return res.json({
      type,
      userInput,
      response: `I don't know how to open '${appName}'. Please try a different application name.`
    });
  }

  try {
    const webApps = {
      'google': 'https://www.google.com',
      'chatgpt': 'https://chat.openai.com',
      'facebook': 'https://www.facebook.com',
      'youtube': 'https://www.youtube.com',
      'instagram': 'https://www.instagram.com',
      'twitter': 'https://twitter.com',
      'whatsapp': 'https://web.whatsapp.com',
      'gmail': 'https://mail.google.com',
      'outlook': 'https://outlook.live.com',
      'github': 'https://github.com',
      'netflix': 'https://www.netflix.com',
      'amazon': 'https://www.amazon.com',
      'linkedin': 'https://www.linkedin.com',
      'reddit': 'https://www.reddit.com',
      'spotify': 'https://open.spotify.com',
      'discord': 'https://discord.com',
      'telegram': 'https://web.telegram.org',
      'zoom': 'https://zoom.us',
      'slack': 'https://slack.com',
      'notion': 'https://www.notion.so'
     
    };

    const windowsApps = {
      'notepad': 'notepad',
      'calculator': 'calc',
      'paint': 'mspaint',
      'word': 'winword',
      'excel': 'excel',
      'powerpoint': 'powerpnt',
      'cmd': 'cmd',
      'powershell': 'powershell',
      'explorer': 'explorer',
      'task manager': 'taskmgr',
      'control panel': 'control',
      'settings': 'start ms-settings:',
      'media player': 'wmplayer',
      'microsoft store': 'ms-windows-store:',
      'clock': 'start ms-clock:'
    };

    if (webApps[cleanAppName]) {
      exec(`start ${webApps[cleanAppName]}`);
      return res.json({
        type,
        userInput,
        response: `Opening ${cleanAppName} in your browser...`
      });
    } else if (windowsApps[cleanAppName]) {
      exec(`start ${windowsApps[cleanAppName]}`);
      return res.json({
        type,
        userInput,
        response: `Opening ${cleanAppName}...`
      });
    } else {
      return res.json({
        type,
        userInput,
        response: `I don't know how to open '${cleanAppName}'. Please try a different application name.`
      });
    }
  } catch (err) {
    console.error("Application open error:", err);
    return res.status(500).json({
      response: `Error opening ${cleanAppName}. Please try a different application name.`,
      error: err.message
    });
  }
};

// Helper function for standard JSON responses
const sendStandardResponse = (type, userInput, response, res) => {
  return res.json({
    type,
    userInput,
    response
  });
};

const handleWindowsControl = (command, type, userInput, res) => {
  if (!command) {
    return res.status(400).json({ response: "Command is required for Windows control." });
  }

  // Clean up the command by removing common prefixes
  let cleanCommand = command
    .replace(/^(jarvis|jarvish|windows)\s+/i, '')
    .replace(/\s+(karu|karo|kar|do|please|now)$/i, '')
    .trim()
    .toLowerCase();

  // Normalize close/exit synonyms to "close" for consistent handling
  cleanCommand = cleanCommand
    .replace(/\b(exit|stop|shut down|turn off|end)\b/g, 'close');

  try {
    let commandToExecute = '';
    let responseMessage = '';

    // Universal close app handling
    const closeMatch = cleanCommand.match(/\bclose\s+(.+)/i);
    if (closeMatch) {
      let appPhrase = closeMatch[1].trim();
      // Clean app phrase by removing dots and extra spaces
      appPhrase = appPhrase.replace(/\./g, '').replace(/\s+/g, ' ').trim();
      // Extract app name: take first word or common phrases
      const appName = appPhrase.split(/\s+/)[0].toLowerCase();

      // Known web apps that require closing browsers
      const webApps = ['youtube', 'facebook', 'instagram', 'twitter', 'gmail', 'netflix', 'spotify', 'linkedin', 'reddit', 'amazon'];

      // Mapping of app names/phrases to executables
      const appMapping = {
        'chrome': 'chrome.exe',
        'google': 'chrome.exe',
        'edge': 'msedge.exe',
        'microsoft': 'msedge.exe',
        'firefox': 'firefox.exe',
        'notepad': 'notepad.exe',
        'calculator': 'calc.exe',
        'calc': 'calc.exe',
        'paint': 'mspaint.exe',
        'mspaint': 'mspaint.exe',
        'cmd': 'cmd.exe',
        'command': 'cmd.exe',
        'prompt': 'cmd.exe',
        'powershell': 'powershell.exe',
        'task': 'taskmgr.exe',
        'manager': 'taskmgr.exe',
        'vlc': 'vlc.exe',
        'player': 'vlc.exe',
        'whatsapp': 'WhatsApp.exe',
        'desktop': 'WhatsApp.exe', // for whatsapp desktop
        'teams': 'Teams.exe',
        'microsoft': 'Teams.exe', // partial match for microsoft teams
        'explorer': 'explorer.exe',
        'file': 'explorer.exe',
        'word': 'winword.exe',
        'excel': 'excel.exe',
        'powerpoint': 'powerpnt.exe'
      };

      let executables;
      if (webApps.includes(appName)) {
        executables = ['chrome.exe', 'msedge.exe', 'firefox.exe'];
        responseMessage = `Closing ${appPhrase} by terminating browser processes (this will close all tabs/windows of the browser).`;
      } else {
        const mappedExe = appMapping[appName] || appMapping[appPhrase.split(' ')[0]]; // Try first word
        if (mappedExe) {
          executables = [mappedExe];
          responseMessage = `Closing ${appPhrase}.`;
        } else {
          return res.json({
            type,
            userInput,
            response: `Sorry, I don't know how to close '${appPhrase}' yet. Please try a common application like Chrome, Notepad, or Calculator.`
          });
        }
      }

      // Build command for multiple executables if needed
      if (Array.isArray(executables)) {
        commandToExecute = executables.map(exe => `taskkill /f /im ${exe} 2>nul`).join(' || ');
      } else {
        commandToExecute = `taskkill /f /im ${executables}`;
      }

      // Execute the command
      exec(commandToExecute, (error, stdout, stderr) => {
        if (error) {
          console.error(`Windows control error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.warn(`Windows control warning: ${stderr}`);
        }
        console.log(`Windows control executed: ${cleanCommand}`);
      });

      return res.json({
        type,
        userInput,
        response: responseMessage
      });
    }

    // Network controls
    if (cleanCommand.includes('wifi on') || cleanCommand.includes('wi-fi on')) {
      commandToExecute = 'netsh wlan set hostednetwork mode=allow ssid=JarvisHotspot key=jarvis123';
      responseMessage = 'WiFi is being turned on.';
    } else if (cleanCommand.includes('wifi off') || cleanCommand.includes('wi-fi off')) {
      commandToExecute = 'netsh wlan set hostednetwork mode=disallow';
      responseMessage = 'WiFi is being turned off.';
    } else if (cleanCommand.includes('bluetooth on')) {
      commandToExecute = 'powershell.exe -Command "Start-Process -FilePath \'ms-settings:bluetooth\'"';
      responseMessage = 'Opening Bluetooth settings. Please turn Bluetooth on manually.';
    } else if (cleanCommand.includes('bluetooth off')) {
      commandToExecute = 'powershell.exe -Command "Start-Process -FilePath \'ms-settings:bluetooth\'"';
      responseMessage = 'Opening Bluetooth settings. Please turn Bluetooth off manually.';
    } else if (cleanCommand.includes('airplane mode on')) {
      commandToExecute = 'powershell.exe -Command "Start-Process -FilePath \'ms-settings:network-airplanemode\'"';
      responseMessage = 'Opening Airplane mode settings. Please turn Airplane mode on manually.';
    } else if (cleanCommand.includes('airplane mode off')) {
      commandToExecute = 'powershell.exe -Command "Start-Process -FilePath \'ms-settings:network-airplanemode\'"';
      responseMessage = 'Opening Airplane mode settings. Please turn Airplane mode off manually.';
    }

    // Audio controls
    else if (cleanCommand.includes('volume up')) {
      commandToExecute = 'powershell.exe -Command "(new-object -com wscript.shell).SendKeys([char]175)';
      responseMessage = 'Increasing volume.';
    } else if (cleanCommand.includes('volume down')) {
      commandToExecute = 'powershell.exe -Command "(new-object -com wscript.shell).SendKeys([char]174)';
      responseMessage = 'Decreasing volume.';
    } else if (cleanCommand.includes('mute')) {
      commandToExecute = 'powershell.exe -Command "(new-object -com wscript.shell).SendKeys([char]173)';
      responseMessage = 'Muting audio.';
    } else if (cleanCommand.includes('unmute')) {
      commandToExecute = 'powershell.exe -Command "(new-object -com wscript.shell).SendKeys([char]173)';
      responseMessage = 'Unmuting audio.';
    }

    // Display controls
    else if (cleanCommand.includes('brightness')) {
      const brightnessMatch = cleanCommand.match(/brightness\s+(\d+)/);
      if (brightnessMatch) {
        const level = Math.min(100, Math.max(0, parseInt(brightnessMatch[1])));
        commandToExecute = `powershell.exe -Command "(Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightnessMethods).WmiSetBrightness(1,${level})"`;
        responseMessage = `Setting brightness to ${level}%.`;
      } else {
        responseMessage = 'Please specify brightness level (0-100).';
      }
    }

    // Application launching
    else if (cleanCommand.includes('open chrome')) {
      commandToExecute = 'start chrome';
      responseMessage = 'Opening Google Chrome.';
    } else if (cleanCommand.includes('open notepad')) {
      commandToExecute = 'start notepad';
      responseMessage = 'Opening Notepad.';
    } else if (cleanCommand.includes('open file explorer') || cleanCommand.includes('open explorer')) {
      commandToExecute = 'start explorer';
      responseMessage = 'Opening File Explorer.';
    } else if (cleanCommand.includes('open task manager')) {
      commandToExecute = 'start taskmgr';
      responseMessage = 'Opening Task Manager.';
    } else if (cleanCommand.includes('open control panel')) {
      commandToExecute = 'start control';
      responseMessage = 'Opening Control Panel.';
    } else if (cleanCommand.includes('open settings')) {
      commandToExecute = 'start ms-settings:';
      responseMessage = 'Opening Settings.';
    } else if (cleanCommand.includes('open cmd')) {
      commandToExecute = 'start cmd';
      responseMessage = 'Opening Command Prompt.';
    } else if (cleanCommand.includes('open powershell')) {
      commandToExecute = 'start powershell';
      responseMessage = 'Opening PowerShell.';
    } else if (cleanCommand.includes('open calculator')) {
      commandToExecute = 'start calc';
      responseMessage = 'Opening Calculator.';
    } else if (cleanCommand.includes('open paint')) {
      commandToExecute = 'start mspaint';
      responseMessage = 'Opening Paint.';
    } else if (cleanCommand.includes('open camera')) {
      commandToExecute = 'start microsoft.windows.camera:';
      responseMessage = 'Opening Camera.';
    } else if (cleanCommand.includes('open word') || cleanCommand.includes('open ms word')) {
      commandToExecute = 'start winword';
      responseMessage = 'Opening Microsoft Word.';
    } else if (cleanCommand.includes('open excel')) {
      commandToExecute = 'start excel';
      responseMessage = 'Opening Microsoft Excel.';
    } else if (cleanCommand.includes('open powerpoint')) {
      commandToExecute = 'start powerpnt';
      responseMessage = 'Opening Microsoft PowerPoint.';
    } else if (cleanCommand.includes('open edge')) {
      commandToExecute = 'start msedge';
      responseMessage = 'Opening Microsoft Edge.';
    } else if (cleanCommand.includes('open media player')) {
      commandToExecute = 'start wmplayer';
      responseMessage = 'Opening media player.';
    } else if (cleanCommand.includes('open vscode') || cleanCommand.includes('open visual studio code')) {
      commandToExecute = 'start code';
      responseMessage = 'Opening Visual Studio Code.';
    }

    // Window management
    else if (cleanCommand.includes('minimize all windows')) {
      commandToExecute = 'powershell.exe -Command "(new-object -com wscript.shell).SendKeys(\'^%{BREAK}\')"';
      responseMessage = 'Minimizing all windows.';
    } else if (cleanCommand.includes('maximize window')) {
      commandToExecute = 'powershell.exe -Command "(new-object -com wscript.shell).SendKeys(\'%{UP}\')"';
      responseMessage = 'Maximizing current window.';
    } else if (cleanCommand.includes('switch window')) {
      commandToExecute = 'powershell.exe -Command "(new-object -com wscript.shell).SendKeys(\'%{TAB}\')"';
      responseMessage = 'Switching to next window.';
    }

    // System operations
    else if (cleanCommand.includes('lock')) {
      commandToExecute = 'rundll32.exe user32.dll,LockWorkStation';
      responseMessage = 'Locking the computer.';
    } else if (cleanCommand.includes('sleep')) {
      commandToExecute = 'rundll32.exe powrprof.dll,SetSuspendState 0,1,0';
      responseMessage = 'Putting computer to sleep.';
    } else if (cleanCommand.includes('hibernate')) {
      commandToExecute = 'shutdown /h';
      responseMessage = 'Hibernating the computer.';
    } else if (cleanCommand.includes('restart')) {
      commandToExecute = 'shutdown /r /t 0';
      responseMessage = 'Restarting the computer.';
    } else if (cleanCommand.includes('shutdown')) {
      commandToExecute = 'shutdown /s /t 0';
      responseMessage = 'Shutting down the computer.';
    } else if (cleanCommand.includes('log off')) {
      commandToExecute = 'shutdown /l';
      responseMessage = 'Logging off.';
    }

    // System utilities
    else if (cleanCommand.includes('take screenshot')) {
      commandToExecute = 'powershell.exe -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait(\'{PRTSC}\')"';
      responseMessage = 'Taking screenshot.';
    } else if (cleanCommand.includes('record screen')) {
      commandToExecute = 'start ms-screenrecorder:';
      responseMessage = 'Opening screen recording tool.';
    } else if (cleanCommand.includes('empty recycle bin')) {
      commandToExecute = 'powershell.exe -Command "Clear-RecycleBin -Force"';
      responseMessage = 'Emptying recycle bin.';
    } else if (cleanCommand.includes('check battery status')) {
      commandToExecute = 'powercfg /batteryreport /output "C:\\battery-report.html" && start C:\\battery-report.html';
      responseMessage = 'Generating battery report.';
    } else if (cleanCommand.includes('show ip address')) {
      commandToExecute = 'ipconfig | findstr /i "ipv4 address"';
      responseMessage = 'Showing IP address information.';
    }

    // Folder operations - updated to use os.homedir() and explorer.exe with flexible matching
    else if ((cleanCommand.includes('open') && cleanCommand.includes('downloads')) || cleanCommand.includes('downloads folder')) {
      const homeDir = os.homedir();
      commandToExecute = `explorer.exe "${path.join(homeDir, 'Downloads')}"`;
      responseMessage = 'Opening Downloads folder.';
    } else if ((cleanCommand.includes('open') && cleanCommand.includes('desktop')) || cleanCommand.includes('desktop folder')) {
      const homeDir = os.homedir();
      commandToExecute = `explorer.exe "${path.join(homeDir, 'Desktop')}"`;
      responseMessage = 'Opening Desktop folder.';
    } else if ((cleanCommand.includes('open') && cleanCommand.includes('documents')) || cleanCommand.includes('documents folder')) {
      const homeDir = os.homedir();
      commandToExecute = `explorer.exe "${path.join(homeDir, 'Documents')}"`;
      responseMessage = 'Opening Documents folder.';
    } else if ((cleanCommand.includes('open') && cleanCommand.includes('music')) || cleanCommand.includes('music folder')) {
      const homeDir = os.homedir();
      commandToExecute = `explorer.exe "${path.join(homeDir, 'Music')}"`;
      responseMessage = 'Opening Music folder.';
    } else if ((cleanCommand.includes('open') && cleanCommand.includes('pictures')) || cleanCommand.includes('pictures folder')) {
      const homeDir = os.homedir();
      commandToExecute = `explorer.exe "${path.join(homeDir, 'Pictures')}"`;
      responseMessage = 'Opening Pictures folder.';
    } else if ((cleanCommand.includes('open') && cleanCommand.includes('videos')) || cleanCommand.includes('videos folder')) {
      const homeDir = os.homedir();
      commandToExecute = `explorer.exe "${path.join(homeDir, 'Videos')}"`;
      responseMessage = 'Opening Videos folder.';
    }

    // If no command matched
    else {
      return res.json({
        type,
        userInput,
        response: `I don't know how to execute '${cleanCommand}'. Please try a different Windows control command.`
      });
    }

    // Execute the command
    if (commandToExecute) {
      exec(commandToExecute, (error, stdout, stderr) => {
        if (error) {
          console.error(`Windows control error: ${error.message}`);
          // Don't send response here as headers might be sent
          return;
        }
        if (stderr) {
          console.warn(`Windows control warning: ${stderr}`);
        }
        console.log(`Windows control executed: ${cleanCommand}`);
      });

      return res.json({
        type,
        userInput,
        response: responseMessage
      });
    }

  } catch (err) {
    console.error("Windows control error:", err);
    return res.status(500).json({
      response: `Error executing Windows control command: ${err.message}`,
      error: err.message
    });
  }
};

const handleFileOperation = (operationDetails, type, userInput, res) => {
  try {
    // Parse the operation details from the AI response
    // Expected format: "Copy code from app.js and paste it into auth.js, but only the login logic"
    const copyMatch = userInput.match(/copy\s+(?:code\s+)?from\s+([^\s,]+)\s+.*?\s+paste\s+(?:it\s+)?(?:into\s+|to\s+)?([^\s,]+)(?:\s*,\s*but\s+only\s+the\s+(.+?))?/i);

    if (!copyMatch) {
      return res.status(400).json({
        response: "I couldn't understand the copy-paste operation. Please specify source and destination files."
      });
    }

    const sourceFile = copyMatch[1].replace(/['"]/g, '');
    const destFile = copyMatch[2].replace(/['"]/g, '');
    const specificLogic = copyMatch[3] || 'all code';

    // Resolve file paths
    const sourcePath = path.resolve(sourceFile);
    const destPath = path.resolve(destFile);

    // Check if source file exists
    if (!fs.existsSync(sourcePath)) {
      return res.status(404).json({
        response: `Source file '${sourceFile}' not found.`
      });
    }

    // Read source file
    const sourceContent = fs.readFileSync(sourcePath, 'utf8');

    // For now, copy entire file content (in a real implementation, you'd parse and extract specific logic)
    // This is a simplified version - in production, you'd need more sophisticated code parsing
    let contentToPaste = sourceContent;

    if (specificLogic && specificLogic !== 'all code') {
      // Simple text matching for specific logic (very basic implementation)
      const lines = sourceContent.split('\n');
      const matchingLines = lines.filter(line =>
        line.toLowerCase().includes(specificLogic.toLowerCase())
      );
      contentToPaste = matchingLines.join('\n');
    }

    // Check if destination file exists
    let destContent = '';
    if (fs.existsSync(destPath)) {
      destContent = fs.readFileSync(destPath, 'utf8');
    }

    // Append or replace content (for simplicity, append)
    const newContent = destContent + '\n\n// Copied from ' + sourceFile + '\n' + contentToPaste;

    // Write to destination file
    fs.writeFileSync(destPath, newContent, 'utf8');

    return res.json({
      type,
      userInput,
      response: `Successfully copied ${specificLogic} from '${sourceFile}' to '${destFile}'.`
    });

  } catch (error) {
    console.error("File operation error:", error);
    return res.status(500).json({
      response: `Error performing file operation: ${error.message}`,
      error: error.message
    });
  }
};

const handleImageGenerate = async (prompt, type, userInput, res) => {
  try {
    let apiUrl = process.env.GEMINI_API_URL;

    if (!apiUrl) {
      return res.status(500).json({ response: "Image generation is not configured properly." });
    }

    // If the URL doesn't contain the full API endpoint, construct it
    if (!apiUrl.includes('generativelanguage.googleapis.com')) {
        // Extract API key from the URL if it's in key= format
        const apiKey = apiUrl.includes('key=') ? apiUrl.split('key=')[1] : apiUrl;
        apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    }

    // Final validation
    if (!apiUrl || !apiUrl.includes('key=')) {
        return res.status(500).json({ response: "Invalid GEMINI_API_URL format. Please check your .env file configuration." });
    }

    const result = await axios.post(apiUrl, {
      "contents": [{
        "parts": [
          {"text": `Generate a high-quality image based on this description: ${prompt}`},
          {"text": "Create a detailed and visually appealing image"}
        ]
      }],
      "generationConfig": {
        "responseModalities": ["text", "image"]
      }
    }, {
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!result.data || !result.data.candidates || result.data.candidates.length === 0) {
      return res.status(500).json({ response: "Failed to generate image. No response from AI." });
    }

    const candidate = result.data.candidates[0];
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      return res.status(500).json({ response: "Failed to generate image. No content received." });
    }

    // Look for image data
    for (const part of candidate.content.parts) {
      if (part.inlineData && part.inlineData.mimeType && part.inlineData.data) {
        return res.json({
          type,
          userInput,
          response: "Image generated successfully!",
          image: {
            mimeType: part.inlineData.mimeType,
            data: part.inlineData.data
          }
        });
      }
    }

    // If no image, return text response
    const textPart = candidate.content.parts.find(part => part.text);
    if (textPart) {
      return res.json({
        type,
        userInput,
        response: textPart.text
      });
    }

    return res.status(500).json({ response: "Failed to generate image. Please try again." });
  } catch (error) {
    console.error("Image generation error:", error.message);
    return res.status(500).json({ response: "Sorry, I couldn't generate the image right now. Please try again later." });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    if (!command || typeof command !== 'string' || command.trim().length === 0) {
      return res.status(200).json({ response: "Please provide a valid command." });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ response: "User not found." });
    }

    user.history.push(command);
    await user.save();

    const userName = user.name;
    const assistantName = user.assistantName;

    // Use comprehensive assistant for educational and feature-rich queries
    const result = await comprehensiveAssistantResponse(command, assistantName, userName, req.userId);

    if (!result || typeof result !== 'string') {
      return res.status(500).json({ response: "Unable to process your request at this time." });
    }

    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      return res.status(400).json({ response: "Sorry, I can't understand that command." });
    }

    let gemResult;
    try {
      gemResult = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return res.status(500).json({ response: "Sorry, I encountered an error processing your request." });
    }

    console.log(gemResult);
    const type = gemResult.type;

    switch (type) {
      case 'get-date':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`
        });
      case 'get-time':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current time is ${moment().format("hh:mm A")}`
        });
      case 'get-day':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("dddd")}`
        });
      case 'get-month':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("MMMM")}`
        });
      case 'folder-add':
        return handleFolderAdd(gemResult.userInput.trim(), type, gemResult.userInput, res);
      case 'folder-delete':
        return handleFolderDelete(gemResult.userInput.trim(), type, gemResult.userInput, res);
      case 'folder-open':
        return handleFolderOpen(gemResult.userInput.trim(), type, gemResult.userInput, res);
      case 'app-open':
      case 'app-open-universal':
        return handleAppOpen(gemResult.userInput.trim(), type, gemResult.userInput, res);
      case 'google-search':
      case 'youtube-search':
      case 'youtube-play':
      case 'youtube-open':
      case 'google-open':
      case 'general':
      case 'calculator-open':
      case 'instagram-open':
      case 'facebook-open':
      case 'weather-show':
      case 'healthcare':
      case 'education':
      case 'fullstack':
      case 'coding':
      case 'entertainment':
      case 'cricket':
      case 'jokes':
      case 'motivation':
      case 'news':
      case 'weather':
      case 'technology':
      case 'travel':
      case 'food':
      case 'general-knowledge':
      case 'english':
      case 'sports':
      case 'astrology':
      case 'meditation':
      case 'reminder':
        return sendStandardResponse(type, gemResult.userInput, gemResult.response, res);
      case 'stop':
        return sendStandardResponse(type, gemResult.userInput, gemResult.response, res);
      case 'pause':
        return sendStandardResponse(type, gemResult.userInput, gemResult.response, res);
      case 'resume':
        return sendStandardResponse(type, gemResult.userInput, gemResult.response, res);
      case 'image-generate':
        // Handle image generation
        return handleImageGenerate(gemResult.userInput, type, gemResult.userInput, res);
      case 'windows-control':
        return handleWindowsControl(gemResult.userInput.trim(), type, gemResult.userInput, res);
      case 'file-operation':
        return handleFileOperation(gemResult.userInput.trim(), type, gemResult.userInput, res);
      case 'assistant-control':
        // Handle assistant control commands like YouTube searches
        if (gemResult.userInput.toLowerCase().includes('youtube') || gemResult.userInput.toLowerCase().includes('play')) {
          // Extract search query from the command
          let searchQuery = gemResult.userInput
            .replace(/^(jarvis\s+)?play\s+/i, '')
            .replace(/\s+on\s+youtube\.?$/i, '')
            .trim();
          const youtubeUrl = `https://www.youtube.com/search?q=${encodeURIComponent(searchQuery)}`;
          exec(`start ${youtubeUrl}`);
          return res.json({
            type,
            userInput: gemResult.userInput,
            response: `Playing ${searchQuery} on YouTube.`
          });
        }
        return sendStandardResponse(type, gemResult.userInput, gemResult.response, res);
      default:
        return res.status(400).json({ response: "I didn't understand that command." });
    }
  } catch (error) {
    console.error("askToAssistant error:", error);
    return res.status(500).json({ response: "Sorry, I'm experiencing technical difficulties. Please try again later.", error: error.message });
  }
};

export const saveCustomization = async (req, res) => {
  try {
    const userId = req.userId;
    const { themeColors, selectedVoice, avatarScale, avatarRotation, voiceAssistantImage } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Update user's customization data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        customizationData: {
          themeColors,
          selectedVoice,
          avatarScale,
          avatarRotation,
          voiceAssistantImage
        }
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Customization saved successfully",
      customizationData: updatedUser.customizationData
    });
  } catch (error) {
    console.error("saveCustomization error:", error);
    return res.status(500).json({ message: "Failed to save customization", error: error.message });
  }
};
