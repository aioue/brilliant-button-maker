// Silkscreen font character definitions (based on Bill Zeller's sprite coordinates)
const FONT_MAP = {
    'A': { x: 0, y: 0, w: 6 }, 'B': { x: 6, y: 0, w: 6 }, 'C': { x: 12, y: 0, w: 6 },
    'D': { x: 18, y: 0, w: 6 }, 'E': { x: 24, y: 0, w: 5 }, 'F': { x: 29, y: 0, w: 5 },
    'G': { x: 34, y: 0, w: 6 }, 'H': { x: 40, y: 0, w: 6 }, 'I': { x: 46, y: 0, w: 3 },
    'J': { x: 49, y: 0, w: 6 }, 'K': { x: 55, y: 0, w: 6 }, 'L': { x: 61, y: 0, w: 5 },
    'M': { x: 66, y: 0, w: 7 }, 'N': { x: 73, y: 0, w: 7 }, 'O': { x: 80, y: 0, w: 6 },
    'P': { x: 86, y: 0, w: 6 }, 'Q': { x: 92, y: 0, w: 6 }, 'R': { x: 98, y: 0, w: 6 },
    'S': { x: 104, y: 0, w: 6 }, 'T': { x: 110, y: 0, w: 5 }, 'U': { x: 115, y: 0, w: 6 },
    'V': { x: 121, y: 0, w: 7 }, 'W': { x: 128, y: 0, w: 7 }, 'X': { x: 135, y: 0, w: 7 },
    'Y': { x: 142, y: 0, w: 7 }, 'Z': { x: 149, y: 0, w: 5 }, ' ': { x: 154, y: 0, w: 4 },
    '1': { x: 0, y: 10, w: 5 }, '2': { x: 5, y: 10, w: 6 }, '3': { x: 11, y: 10, w: 6 },
    '4': { x: 17, y: 10, w: 6 }, '5': { x: 23, y: 10, w: 6 }, '6': { x: 29, y: 10, w: 6 },
    '7': { x: 35, y: 10, w: 6 }, '8': { x: 41, y: 10, w: 6 }, '9': { x: 47, y: 10, w: 6 },
    '0': { x: 53, y: 10, w: 6 }, '!': { x: 59, y: 10, w: 3 }, '@': { x: 62, y: 10, w: 7 },
    '#': { x: 69, y: 10, w: 7 }, '$': { x: 76, y: 10, w: 6 }, '%': { x: 82, y: 10, w: 7 },
    '^': { x: 89, y: 10, w: 5 }, '&': { x: 94, y: 10, w: 6 }, '*': { x: 100, y: 10, w: 7 },
    '(': { x: 107, y: 10, w: 4 }, ')': { x: 111, y: 10, w: 4 }, '_': { x: 115, y: 10, w: 6 },
    '+': { x: 121, y: 10, w: 7 }, '`': { x: 128, y: 10, w: 4 }, '~': { x: 132, y: 10, w: 6 },
    '[': { x: 138, y: 10, w: 4 }, ']': { x: 142, y: 10, w: 4 }, '\\': { x: 146, y: 10, w: 5 },
    '{': { x: 151, y: 10, w: 5 }, '}': { x: 156, y: 10, w: 5 }, '|': { x: 161, y: 10, w: 3 },
    ';': { x: 164, y: 10, w: 4 }, ':': { x: 168, y: 10, w: 3 }, '\'': { x: 171, y: 10, w: 3 },
    '"': { x: 174, y: 10, w: 5 }, ',': { x: 179, y: 10, w: 4 }, '.': { x: 183, y: 10, w: 3 },
    '/': { x: 186, y: 10, w: 5 }, '<': { x: 191, y: 10, w: 5 }, '>': { x: 196, y: 10, w: 5 },
    '?': { x: 201, y: 10, w: 6 }, '=': { x: 207, y: 10, w: 5 }
};

class ButtonMaker {
    constructor() {
        this.canvas1x = document.getElementById('buttonCanvas1x');
        this.canvas2x = document.getElementById('buttonCanvas2x');
        this.canvas4x = document.getElementById('buttonCanvas4x');

        // Use alpha: false to prevent semi-transparent pixels
        this.ctx1x = this.canvas1x.getContext('2d', { willReadFrequently: true, alpha: false });
        this.ctx2x = this.canvas2x.getContext('2d', { willReadFrequently: true, alpha: false });
        this.ctx4x = this.canvas4x.getContext('2d', { willReadFrequently: true, alpha: false });

        this.fontImage = null;

        // Define presets
        this.presets = {
            default: {
                leftText: 'RSS',
                rightText: 'VALID',
                leftTextColor: 'FFFFFF',
                leftBgColor: 'FF6600',
                rightTextColor: 'FFFFFF',
                rightBgColor: '888880',
                outerBorder: '666666',
                innerBorder: 'FFFFFF',
                leftTextPos: 5,
                rightTextPos: 4,
                barPosition: 25,
                advancedMode: false
            },
            blue: {
                leftText: 'GITHUB',
                rightText: 'PAGES',
                leftTextColor: 'FFFFFF',
                leftBgColor: '454545',
                rightTextColor: 'FFFFFF',
                rightBgColor: '0475B6',
                outerBorder: '666666',
                innerBorder: 'FFFFFF',
                leftTextPos: 5,
                rightTextPos: 4,
                barPosition: 25,
                advancedMode: true
            }
        };

        this.setupControls();
        this.loadFont();

        // Load the Blue preset by default on startup
        this.loadPreset('blue');
    }

    // Compute text width in pixels using FONT_MAP widths
    getTextPixelWidth(text) {
        if (!text) return 0;
        let width = 0;
        for (const ch of text) {
            const info = FONT_MAP[ch] || { w: 6 };
            width += info.w;
        }
        return width;
    }

    setupControls() {
        // Text inputs
        document.getElementById('leftText').addEventListener('input', () => {
            this.setPresetToCustom();
            this.drawButton();
        });
        document.getElementById('rightText').addEventListener('input', () => {
            this.setPresetToCustom();
            this.drawButton();
        });

        // Number inputs
        document.getElementById('leftTextPos').addEventListener('input', () => {
            this.setPresetToCustom();
            this.drawButton();
        });
        document.getElementById('rightTextPos').addEventListener('input', () => {
            this.setPresetToCustom();
            this.drawButton();
        });
        document.getElementById('barPosition').addEventListener('input', () => {
            this.setPresetToCustom();
            this.drawButton();
        });

        // Advanced mode checkbox
        document.getElementById('advancedMode').addEventListener('change', () => {
            this.toggleBarPositionVisibility();
            this.setPresetToCustom();
            this.drawButton();
        });

        // Render preset swatches
        this.renderPresetSwatches();

        // Color pickers and hex inputs synchronization
        this.setupColorSync('leftTextColor');
        this.setupColorSync('leftBgColor');
        this.setupColorSync('rightTextColor');
        this.setupColorSync('rightBgColor');
        this.setupColorSync('outerBorder');
        this.setupColorSync('innerBorder');

        // Download buttons
        document.getElementById('downloadBtn1x').addEventListener('click', () => this.downloadButton(this.canvas1x, '1x'));
        document.getElementById('downloadBtn2x').addEventListener('click', () => this.downloadButton(this.canvas2x, '2x'));
        document.getElementById('downloadBtn4x').addEventListener('click', () => this.downloadButton(this.canvas4x, '4x'));

        // Copy data URL button
        document.getElementById('copyDataUrlBtn').addEventListener('click', () => this.copyDataUrl());
    }

    renderPresetSwatches() {
        const container = document.getElementById('presetSwatches');
        if (!container) return;
        container.innerHTML = '';

        const makeSwatch = (key, preset, label) => {
            const sw = document.createElement('button');
            sw.type = 'button';
            sw.className = 'preset-swatch';
            sw.title = `${label}: left ${preset.leftBgColor} / right ${preset.rightBgColor}`;

            const leftChip = document.createElement('span');
            leftChip.className = 'chip';
            leftChip.style.backgroundColor = `#${preset.leftBgColor}`;

            const rightChip = document.createElement('span');
            rightChip.className = 'chip';
            rightChip.style.backgroundColor = `#${preset.rightBgColor}`;

            const text = document.createElement('span');
            text.className = 'label';
            text.textContent = label;

            sw.appendChild(leftChip);
            sw.appendChild(rightChip);
            sw.appendChild(text);

            sw.addEventListener('click', () => this.loadPreset(key));

            return sw;
        };

        // Expose swatches for all presets except custom
        for (const [key, preset] of Object.entries(this.presets)) {
            if (key === 'custom') continue;
            const label = key === 'default' ? 'Classic' : key.charAt(0).toUpperCase() + key.slice(1);
            container.appendChild(makeSwatch(key, preset, label));
        }
    }

    toggleBarPositionVisibility() {
        const advancedMode = document.getElementById('advancedMode').checked;
        const barPositionGroup = document.getElementById('barPositionGroup');
        barPositionGroup.style.display = advancedMode ? 'none' : 'flex';
    }

    setPresetToCustom() {}

    loadPreset(presetName) {
        const preset = this.presets[presetName];
        if (!preset) return;

        document.getElementById('leftText').value = preset.leftText;
        document.getElementById('rightText').value = preset.rightText;

        document.getElementById('leftTextColor').value = '#' + preset.leftTextColor;
        document.getElementById('leftTextColorHex').value = preset.leftTextColor;

        document.getElementById('leftBgColor').value = '#' + preset.leftBgColor;
        document.getElementById('leftBgColorHex').value = preset.leftBgColor;

        document.getElementById('rightTextColor').value = '#' + preset.rightTextColor;
        document.getElementById('rightTextColorHex').value = preset.rightTextColor;

        document.getElementById('rightBgColor').value = '#' + preset.rightBgColor;
        document.getElementById('rightBgColorHex').value = preset.rightBgColor;

        document.getElementById('outerBorder').value = '#' + preset.outerBorder;
        document.getElementById('outerBorderHex').value = preset.outerBorder;

        document.getElementById('innerBorder').value = '#' + preset.innerBorder;
        document.getElementById('innerBorderHex').value = preset.innerBorder;

        document.getElementById('leftTextPos').value = preset.leftTextPos;
        document.getElementById('rightTextPos').value = preset.rightTextPos;
        document.getElementById('barPosition').value = preset.barPosition;

        document.getElementById('advancedMode').checked = preset.advancedMode;

        this.toggleBarPositionVisibility();
        this.drawButton();
    }

    setupColorSync(baseName) {
        const colorPicker = document.getElementById(baseName);
        const hexInput = document.getElementById(baseName + 'Hex');

        colorPicker.addEventListener('input', (e) => {
            hexInput.value = e.target.value.substring(1);
            this.setPresetToCustom();
            this.drawButton();
        });

        hexInput.addEventListener('input', (e) => {
            let hex = e.target.value.replace(/[^0-9a-fA-F]/g, '').substring(0, 6);
            hexInput.value = hex;
            if (hex.length === 6) {
                colorPicker.value = '#' + hex;
                this.setPresetToCustom();
                this.drawButton();
            }
        });
    }

    loadFont() {
        // Load the actual Silkscreen font sprite
        const img = new Image();
        img.onload = () => {
            this.fontSprite = img;
            this.drawButton();
        };
        img.onerror = () => {
            console.error('Failed to load font sprite');
            // Fallback to generated sprite
            this.fontSprite = createSilkscreenSprite();
            this.drawButton();
        };
        img.src = 'silkscreen-font-sprites/font.png';
    }

    hexToRgb(hex) {
        hex = hex.replace('#', '');
        return {
            r: parseInt(hex.substring(0, 2), 16),
            g: parseInt(hex.substring(2, 4), 16),
            b: parseInt(hex.substring(4, 6), 16)
        };
    }

    drawButton() {
        // Get all values
        const outerBorder = document.getElementById('outerBorder').value;
        const innerBorder = document.getElementById('innerBorder').value;
        const leftFill = document.getElementById('leftBgColor').value;
        const rightFill = document.getElementById('rightBgColor').value;
        const leftText = document.getElementById('leftText').value.toUpperCase();
        const rightText = document.getElementById('rightText').value.toUpperCase();
        const leftTextColor = document.getElementById('leftTextColor').value;
        const rightTextColor = document.getElementById('rightTextColor').value;
        const leftTextPos = parseInt(document.getElementById('leftTextPos').value);
        const rightTextPos = parseInt(document.getElementById('rightTextPos').value);
        const advancedMode = document.getElementById('advancedMode').checked;

        let barPosition = parseInt(document.getElementById('barPosition').value);
        let buttonWidth = 80;

        // Advanced mode: calculate dynamic width
        if (advancedMode) {
            const leftTextWidth = this.getTextPixelWidth(leftText);
            const rightTextWidth = this.getTextPixelWidth(rightText);

            // Minimum padding: 2px border + 2px padding on each side
            const minPadding = 4;

            // Calculate optimal bar position and total width
            barPosition = 2 + minPadding + leftTextWidth + minPadding;
            const rightBoxWidth = minPadding + rightTextWidth + minPadding;
            buttonWidth = barPosition + 1 + rightBoxWidth + 2; // +1 for bar, +2 for right border
        }

        // Update canvas sizes
        this.canvas1x.width = buttonWidth;
        this.canvas2x.width = buttonWidth * 2;
        this.canvas4x.width = buttonWidth * 4;

        // Draw at 1x scale
        this.drawButtonAtScale(this.ctx1x, 1, buttonWidth, outerBorder, innerBorder, barPosition,
            leftFill, rightFill, leftText, rightText, leftTextColor, rightTextColor,
            leftTextPos, rightTextPos, advancedMode);

        // Draw at 2x scale
        this.drawButtonAtScale(this.ctx2x, 2, buttonWidth, outerBorder, innerBorder, barPosition,
            leftFill, rightFill, leftText, rightText, leftTextColor, rightTextColor,
            leftTextPos, rightTextPos, advancedMode);

        // Draw at 4x scale
        this.drawButtonAtScale(this.ctx4x, 4, buttonWidth, outerBorder, innerBorder, barPosition,
            leftFill, rightFill, leftText, rightText, leftTextColor, rightTextColor,
            leftTextPos, rightTextPos, advancedMode);
    }

    drawButtonAtScale(ctx, scale, buttonWidth, outerBorder, innerBorder, barPosition,
        leftFill, rightFill, leftText, rightText, leftTextColor, rightTextColor,
        leftTextPos, rightTextPos, advancedMode) {

        const s = scale; // shorthand
        const canvas = ctx.canvas;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Disable smoothing for crisp pixels
        ctx.imageSmoothingEnabled = false;

        // Draw borders using fills to avoid anti-aliased strokes
        // Outer 1px border
        ctx.fillStyle = outerBorder;
        ctx.fillRect(0, 0, buttonWidth * s, 15 * s);

        // Inner 1px border (inset by 1px)
        ctx.fillStyle = innerBorder;
        ctx.fillRect(1 * s, 1 * s, (buttonWidth - 2) * s, 13 * s);

        // Clear inner content area before section fills
        ctx.clearRect(2 * s, 2 * s, (buttonWidth - 4) * s, 11 * s);

        // Fill left section
        ctx.fillStyle = leftFill;
        ctx.fillRect(2 * s, 2 * s, (barPosition - 2) * s, 11 * s);

        // Fill right section
        ctx.fillStyle = rightFill;
        ctx.fillRect((barPosition + 1) * s, 2 * s, (buttonWidth - barPosition - 3) * s, 11 * s);

        // Vertical white divider at the bar position
        ctx.fillStyle = innerBorder;
        ctx.fillRect(barPosition * s, 1 * s, 1 * s, 12 * s);

        // Auto-center left text within the left box (x=2..barPosition-1)
        const leftBoxWidth = (barPosition - 2);
        const leftTextWidth = this.getTextPixelWidth(leftText);
        let autoLeftX = 2 + Math.floor(Math.max(0, leftBoxWidth - leftTextWidth) / 2);

        // Auto-center right text if in advanced mode
        const rightBoxWidth = (buttonWidth - barPosition - 3);
        const rightTextWidth = this.getTextPixelWidth(rightText);
        let autoRightX = advancedMode
            ? barPosition + 1 + Math.floor(Math.max(0, rightBoxWidth - rightTextWidth) / 2)
            : barPosition + rightTextPos;

        // Draw text at y=5 to match original positioning
        this.drawTextAtScale(ctx, scale, leftText, autoLeftX, 5, leftTextColor);
        this.drawTextAtScale(ctx, scale, rightText, autoRightX, 5, rightTextColor);
    }

    drawTextAtScale(ctx, scale, text, x, y, color) {
        if (!this.fontSprite) return;

        // Create a colored version of the font sprite
        const coloredSprite = this.createColoredSprite(color);

        // Disable smoothing for pixel-perfect rendering
        const prevSmoothing = ctx.imageSmoothingEnabled;
        ctx.imageSmoothingEnabled = false;

        // Draw each character from the sprite
        let currentX = x * scale;
        for (let char of text) {
            const charInfo = FONT_MAP[char];
            if (charInfo) {
                // Copy character from sprite to button canvas
                // Source: charInfo.x, charInfo.y, charInfo.w, 6 (height)
                // Dest: currentX, y * scale, charInfo.w * scale, 6 * scale
                ctx.drawImage(
                    coloredSprite,
                    charInfo.x, charInfo.y, charInfo.w, 6,
                    currentX, y * scale, charInfo.w * scale, 6 * scale
                );
                currentX += charInfo.w * scale;
            }
        }

        // Restore smoothing setting
        ctx.imageSmoothingEnabled = prevSmoothing;
    }

    createColoredSprite(color) {
        // Create a temporary canvas to colorize the sprite
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.fontSprite.width;
        tempCanvas.height = this.fontSprite.height;
        const tempCtx = tempCanvas.getContext('2d');

        // Disable ALL smoothing to prevent anti-aliasing artifacts
        tempCtx.imageSmoothingEnabled = false;
        tempCtx.webkitImageSmoothingEnabled = false;
        tempCtx.mozImageSmoothingEnabled = false;
        tempCtx.msImageSmoothingEnabled = false;

        // Draw the original sprite (black mask)
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(this.fontSprite, 0, 0);

        // Colorize via compositing: keep alpha from sprite, replace RGB with target color
        tempCtx.globalCompositeOperation = 'source-in';
        tempCtx.fillStyle = color;
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.globalCompositeOperation = 'source-over';

        return tempCanvas;
    }

    downloadButton(canvas, sizeLabel) {
        // Create a new canvas without alpha to ensure RGB output
        const rgbCanvas = document.createElement('canvas');
        rgbCanvas.width = canvas.width;
        rgbCanvas.height = canvas.height;
        const rgbCtx = rgbCanvas.getContext('2d', { alpha: false });

        // Disable smoothing
        rgbCtx.imageSmoothingEnabled = false;

        // Copy the button to RGB canvas
        rgbCtx.drawImage(canvas, 0, 0);

        // Get current settings for filename
        const leftTextColor = document.getElementById('leftTextColorHex').value;
        const leftBgColor = document.getElementById('leftBgColorHex').value;
        const leftTextPos = document.getElementById('leftTextPos').value;
        const rightTextColor = document.getElementById('rightTextColorHex').value;
        const rightBgColor = document.getElementById('rightBgColorHex').value;
        const rightTextPos = document.getElementById('rightTextPos').value;
        const outerBorder = document.getElementById('outerBorderHex').value;
        const innerBorder = document.getElementById('innerBorderHex').value;
        const advancedMode = document.getElementById('advancedMode').checked;

        // Generate detailed filename
        // Format: button-WIDTHxHEIGHT-SCALE_LEFTTXTCOLOR-LEFTBGCOLOR-LEFTTXTPOS_RIGHTTXTCOLOR-RIGHTBGCOLOR-RIGHTTXTPOS_OUTERBORDER-INNERBORDER_MODE.png
        const modeStr = advancedMode ? 'auto' : 'manual';
        const filename = `button-${canvas.width}x${canvas.height}-${sizeLabel}_${leftTextColor}-${leftBgColor}-${leftTextPos}_${rightTextColor}-${rightBgColor}-${rightTextPos}_${outerBorder}-${innerBorder}_${modeStr}.png`;

        const link = document.createElement('a');
        link.download = filename;
        link.href = rgbCanvas.toDataURL('image/png');
        link.click();
    }

    async copyDataUrl() {
        const dataUrl = this.canvas1x.toDataURL('image/png');
        try {
            await navigator.clipboard.writeText(dataUrl);
            alert('Data URL copied to clipboard!');
        } catch (err) {
            // Fallback for browsers that don't support clipboard API
            const textarea = document.createElement('textarea');
            textarea.value = dataUrl;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Data URL copied to clipboard!');
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ButtonMaker();
});
