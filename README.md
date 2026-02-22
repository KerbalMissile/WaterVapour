# WaterVapour

A lighweight Steam game launcher built in JavaScript and HTML. Currently only for Windows.

> [!WARNING]
> This is a **Beta** version of the app. It is still a work in progress and may have bugs or other issues.

## Features
- **Game Detection** - Will automatically detect games inside a steamapps folder by looking at the .acf's
- **Default Folder Directory at C:** - The app's default directory is C:\Program Files (x86)\Steam\steamapps
- **Switchable Folder Directory** - You can switch wich folder the app looks at for your games.
- **Game Icon Viewing** - It will show the icons of each game in your steamapps folder. Note this isn't 100% it may not pick up EVERY icon
- **Folder Memory** - Will remember your last input for your directory to your steamapps folder.

## Screenshots
<img width="443" height="793" alt="image" src="https://github.com/user-attachments/assets/a4516466-33a4-4c21-956a-922a5557a732" />

## Roadmap
- **Fully 100% working Game Icon Detection**
- **Multiple steamapps folder picking**

## Contributing

```bash
# Clone the repository
git clone https://github.com/KerbalMissile/WaterVapour.git
cd WaterVapour

# Install the dependencies
npm install

# Run
npm start
```

### Requirements
| Dependency | Purpose
|---|---|
| [Electron](https://www.electronjs.org/) | Desktop app tool |

If you find bugs please either submit an issue report with `ISSUE:` in the title or fork WaterVapour and make a Pull Request.
If you want a feature please also make an issue report with `SUGGESTION:` in the title.

## Extras

This entire README was heavily inspired by [Snowify](https://github.com/nyakuoff/Snowify), that is why it looks so similar.

> [!NOTE]
> **AI Disclaimer:** Parts of this app were either made by AI or assisted by AI with. I am not an expert in JavaScript and still have issues in HTML sometimes, so AI does help me out. If you aren't comfortable with using this that is fine, I of course won't force anyone. The code may have flaws because of thism if you spot one or maybe think something could be better, please contribute.
