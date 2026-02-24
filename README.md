# MOODPAW 🐾

**MOODPAW** is a highly customizable, web-based mood-badge generator designed for the furry community and beyond. Express your social energy, roleplay preferences, or contact status with beautifully crafted, print-ready badges.

## Features

- **Preset Categories**: Quick-start with curated presets for:
  - **Contact**: Friendly, Shy, No Hugs, Yes Hugs, Uppies, etc.
  - **Energy**: High Energy, Low Battery, Overstimulated, Need Coffee, Chill.
  - **RP**: In Character, Out of Character, Villain Mode, Soft Mode, Gremlin Mode.
  - **Social**: Looking for Artists, Open for Collabs, Sketch Mode, Roomparty Host/Guest.
- **Multilingual Support**: Full interface and preset translations for **English** and **Russian**.
- **Custom Dimensions**:
  - Square (400x400)
  - Portrait (300x400)
  - Landscape (400x300)
  - Custom E-Badge (user-defined px)
- **Shape Control**: Toggle between standard rounded rectangles and perfect circular badges.
- **Rich Iconography**:
  - **Emojis**: Support for both **Noto Color Emoji** (vibrant) and **Noto Emoji** (monochrome).
  - **Font Awesome**: Integration for thousands of vector icons via FA IDs (e.g., `fa-paw`).
  - **Custom Content**: Use any text or emoji as the central icon.
- **Typography**: Choose from popular Google Fonts (Inter, Montserrat, Oswald, etc.) with independent font scaling for top and bottom text.
- **Export Options**:
  - Download individual badges as high-quality PNGs.
  - Export your entire collection as a organized ZIP archive.

## Tech Stack

- **Framework**: [React 18+](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Image Generation**: [html-to-image](https://github.com/tsayen/html-to-image)
- **Archiving**: [JSZip](https://stuk.github.io/jszip/)
- **Icons**: [Lucide React](https://lucide.dev/) & [Font Awesome 6](https://fontawesome.com/)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/moodpaw.git
   cd moodpaw
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Usage

1. **Select a Language**: Toggle between EN and RU in the header.
2. **Choose a Preset**: Click any preset button to instantly apply a mood.
3. **Customize**:
   - Adjust the background color.
   - Change the font and text size.
   - Move text position using the height sliders.
   - Switch emoji styles (Colorful vs. Monochrome).
4. **Add to Collection**: Click "Add to Collection" to save your design locally.
5. **Download**: Use the download buttons to save your badges as PNG files.

## License

This project is licensed under the GNU/GPL v3 license.